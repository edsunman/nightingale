uniform sampler2D alphaMap;
uniform float useAlphaMap;
uniform sampler2D map;
uniform float useMap;
uniform float spriteSheet;
uniform vec4 colorStops;
uniform mat4 colors;

varying vec2 vRotation;
varying float vNormalLife;
varying float vColorRandom;
varying float vLightnessRandom;

vec3 hue2rgb(float hue) {
    hue = fract(hue);
    return saturate(vec3(abs(hue * 6. - 3.) - 1., 2. - abs(hue * 6. - 2.), 2. - abs(hue * 6. - 4.)));
}

vec3 rgb2hsl(vec3 c) {
    float cMin = min(min(c.r, c.g), c.b), cMax = max(max(c.r, c.g), c.b), delta = cMax - cMin;
    vec3 hsl = vec3(0., 0., (cMax + cMin) / 2.);
    if(delta != 0.0) { //If it has chroma and isn't gray.
        if(hsl.z < .5) {
            hsl.y = delta / (cMax + cMin); //Saturation.
        } else {
            hsl.y = delta / (2. - cMax - cMin); //Saturation.
        }
        float deltaR = (((cMax - c.r) / 6.) + (delta / 2.)) / delta, deltaG = (((cMax - c.g) / 6.) + (delta / 2.)) / delta, deltaB = (((cMax - c.b) / 6.) + (delta / 2.)) / delta;
		//Hue.
        if(c.r == cMax) {
            hsl.x = deltaB - deltaG;
        } else if(c.g == cMax) {
            hsl.x = (1. / 3.) + deltaR - deltaB;
        } else { //if(c.b==cMax){
            hsl.x = (2. / 3.) + deltaG - deltaR;
        }
        hsl.x = fract(hsl.x);
    }
    return hsl;
}

vec3 hsl2rgb(vec3 hsl) {
    if(hsl.y == 0.) {
        return vec3(hsl.z); //Luminance.
    } else {
        float b;
        if(hsl.z < .5) {
            b = hsl.z * (1. + hsl.y);
        } else {
            b = hsl.z + hsl.y - hsl.y * hsl.z;
        }
        float a = 2. * hsl.z - b;
        return a + hue2rgb(hsl.x) * (b - a);
    }
}

vec4 toLinear(vec4 sRGB) {
    bvec3 cutoff = lessThan(sRGB.rgb, vec3(0.04045));
    vec3 higher = pow((sRGB.rgb + vec3(0.055)) / vec3(1.055), vec3(2.4));
    vec3 lower = sRGB.rgb / vec3(12.92);

    return vec4(mix(higher, lower, cutoff), sRGB.a);
}

vec2 grid[9] = vec2[9](vec2(0.1666, 0.8333), vec2(0.5, 0.8333), vec2(0.8333, 0.8333), vec2(0.1666, 0.5), vec2(0.5, 0.5), vec2(0.8333, 0.5), vec2(0.1666, 0.1666), vec2(0.5, 0.1666), vec2(0.8333, 0.1666));

void main() {

    // build up color and alpha gradient
    vec4 gradient = mix(colors[0], colors[1], smoothstep(colorStops.x, colorStops.y, vNormalLife));
    gradient = mix(gradient, colors[2], smoothstep(colorStops.y, colorStops.z, vNormalLife));
    gradient = mix(gradient, colors[3], smoothstep(colorStops.z, colorStops.w, vNormalLife));

    // convert color to hsv and back to alter hue
    vec3 hsv = rgb2hsl(vec3(gradient.r, gradient.g, gradient.b));
    vec3 alteredHue = vec3(hsv.x + vColorRandom, hsv.y, hsv.z + vLightnessRandom);
    vec3 rgb = hsl2rgb(alteredHue);

    // make sure particle is not visible before it is born or after it has died
    if(vNormalLife < 0.0 || vNormalLife > 0.9999) {
        gradient.a = 0.0;
    }

    // mix color and shader
    vec4 finalMix = vec4(rgb.r, rgb.g, rgb.b, gradient.a);

    // sprite sheet section
    int spriteIndex = int(vNormalLife * spriteSheet * spriteSheet);
    vec2 rotateAround = vec2(0.5, 0.5);
    if(spriteSheet > 1.0) {
        rotateAround = grid[spriteIndex];
    }
    vec2 section = vec2((gl_PointCoord.x - 0.5) / spriteSheet, (1.0 - gl_PointCoord.y - 0.5) / spriteSheet);

    // rotate
    vec2 coords = section * mat2(vRotation.x, vRotation.y, -vRotation.y, vRotation.x) + rotateAround;

    if(useAlphaMap == 1.) {
        finalMix = vec4(finalMix.r, finalMix.g, finalMix.b, texture2D(alphaMap, vec2(coords.x, coords.y)).r * finalMix.a);
    }

    if(useMap == 1.) {
        vec4 mapTexture = texture2D(map, vec2(coords.x, coords.y));
        finalMix = vec4(mapTexture.r, mapTexture.g, mapTexture.b, finalMix.a);
    }

    gl_FragColor = toLinear(finalMix);
}