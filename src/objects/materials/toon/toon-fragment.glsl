#include <common>
#include <lights_pars_begin>

uniform sampler2D map;
varying vec3 vNormal;
varying vec2 vUv;

void main() {

    vec4 tex = texture2D(map, vUv);
    vec3 mainColor = vec3(1., 1., 1.);
    vec4 mainColor4 = vec4(mainColor, 1.0);

    float NdotL = dot(vNormal, directionalLights[0].direction);
    float lightIntensity = smoothstep(0.0, 0.01, NdotL);
    vec3 directionalLight = (directionalLights[0].color / 3.33) * lightIntensity;

    vec3 modifier = vec3(2.0, 2.0, 2.0);
    vec4 finalColor = vec4(mainColor * directionalLight, 1.0);

    gl_FragColor = tex * finalColor; 
    //gl_FragColor = finalColor;

}