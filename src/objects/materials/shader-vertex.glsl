varying vec2 vUv;
#include <common>
#include <skinning_pars_vertex>
void main() {
    #include <skinbase_vertex>
    #include <begin_vertex>
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <skinning_vertex>
    #include <project_vertex>
    vUv = uv;
				//gl_Position = projectionMatrix * mvPosition * 5.0;
}