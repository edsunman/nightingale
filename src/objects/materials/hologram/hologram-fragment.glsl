varying vec2 vUv;
uniform sampler2D texture1;
uniform float time;
uniform float opacity;
uniform float dotSize;

vec4 toLinear(vec4 sRGB) {
    bvec3 cutoff = lessThan(sRGB.rgb, vec3(0.04045));
    vec3 higher = pow((sRGB.rgb + vec3(0.055)) / vec3(1.055), vec3(2.4));
    vec3 lower = sRGB.rgb / vec3(12.92);

    return vec4(mix(higher, lower, cutoff), sRGB.a);
}

void main() {

    vec4 baseColor = vec4(0.11, 0.91, 0.91, opacity / 8.); // transparent base color
   // vec4 texColor = vec4(9.11, 0.3, 9.4, opacity); // pink color
    vec4 texColor = vec4(0.11, 3.3, 3.4, opacity); // blue color
    vec2 uv = vUv;
    float offset = texture(texture1, uv * 5. + vec2(time * 1. + sin(time) * .1, 0)).x;
    uv *= dotSize;
    uv += vec2(offset);
    vec3 dotColor = vec3(float(length(uv - round(uv)) < 0.3));
    vec4 dot4 = vec4(dotColor, 1.0);
    gl_FragColor = mix(texColor, baseColor, 1.0 - dotColor.r);

}