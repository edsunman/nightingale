varying vec2 vUv;
uniform float dotSize;
uniform float opacity;

#include <common>
#include <skinning_pars_vertex>

float rand(float n) {
    return fract(sin(n) * 43758.5453123);
}

float noise(float p) {
    float fl = floor(p);
    float fc = fract(p);
    return mix(rand(fl), rand(fl + 1.0), fc);
}
void main() {
    #include <skinbase_vertex>
    #include <begin_vertex>
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <skinning_vertex>
   // #include <project_vertex>

    vec4 mvPosition = vec4(transformed, 1.0);

    float distort = noise(dotSize) * 80.;
    distort = distort - 55.;

    if(opacity < 1.) {
        mvPosition = vec4(mvPosition.x - (noise(dotSize) * distort), mvPosition.y + (noise(dotSize) * distort), mvPosition.z, 1.0);
    }

    #ifdef USE_INSTANCING

    mvPosition = instanceMatrix * mvPosition;

    #endif

    mvPosition = modelViewMatrix * mvPosition;

    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;
    //gl_Position = projectionMatrix * mvPosition * 5.0;
}