uniform sampler2D alphaMap;
uniform float useAlphaMap;
uniform vec4 colorStops;
uniform mat4 colors;

varying vec2 vRotation;
varying float vNormalLife;
varying float vColorRandom;
varying float vLightnessRandom;

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

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
		/*vec3(
			hueRamp(a,b,hsl.x+(1./3.)),
			hueRamp(a,b,hsl.x),
			hueRamp(a,b,hsl.x-(1./3.))
		);*/
    }
}

vec4 toLinear(vec4 sRGB) {
    bvec3 cutoff = lessThan(sRGB.rgb, vec3(0.04045));
    vec3 higher = pow((sRGB.rgb + vec3(0.055)) / vec3(1.055), vec3(2.4));
    vec3 lower = sRGB.rgb / vec3(12.92);

    return vec4(mix(higher, lower, cutoff), sRGB.a);
}

void main() {
    // rotate
    vec2 coords = (gl_PointCoord - 0.5) * mat2(vRotation.x, vRotation.y, -vRotation.y, vRotation.x) + 0.5;

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

    if(useAlphaMap == 1.) {
        finalMix = vec4(finalMix.r, finalMix.g, finalMix.b, texture2D(alphaMap, coords).r * finalMix.a);
    }

    gl_FragColor = toLinear(finalMix);
}