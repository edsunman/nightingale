uniform sampler2D map;
uniform float useMap;
uniform vec4 colorStops;
uniform mat4 colors;

varying vec2 vRotation;
varying float vNormalLife;
varying float vColorRandom;

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

void main() {
    // rotate
    vec2 coords = (gl_PointCoord - 0.5) * mat2(vRotation.x, vRotation.y, -vRotation.y, vRotation.x) + 0.5;

    // build up color and alpha gradient
    vec4 gradient = mix(colors[0], colors[1], smoothstep(colorStops.x, colorStops.y, vNormalLife));
    gradient = mix(gradient, colors[2], smoothstep(colorStops.y, colorStops.z, vNormalLife));
    gradient = mix(gradient, colors[3], smoothstep(colorStops.z, colorStops.w, vNormalLife));

    // convert color to hls and back to alter hue
    vec3 hsv = rgb2hsv(vec3(gradient.r, gradient.g, gradient.b));
    vec3 alteredHue = vec3(hsv.x + vColorRandom, hsv.y, hsv.z);
    vec3 rgb = hsv2rgb(alteredHue);

    // make sure particle is not visible before it is born or after it has died
    if(vNormalLife < 0.0 || vNormalLife > 0.9999) {
        gradient.a = 0.0;
    }

    // mix color and shader
    vec4 finalMix = vec4(rgb.r, rgb.g, rgb.b, gradient.a);

    if(useMap == 1.) {
        finalMix = texture2D(map, coords) * finalMix;
    }

    gl_FragColor = finalMix;
}