attribute float sizeRandom;
attribute float rotation;
attribute float colorRandom;
attribute float life;
attribute vec3 velocity;

uniform float maxLifetime;
uniform float dampen;
uniform vec4 sizeStops;
uniform vec4 sizes;

varying float vColorRandom;
varying vec2 vRotation;
varying float vNormalLife;
varying float vReverseNormalLife;

float PI = 3.1415926;

float EaseOutSine(float x) {
    return sin((x * PI) / 2.0);
}

void main() {
    // normlised lifetime; 0 = born, 1 - died
    vNormalLife = life / maxLifetime;

    // reverse lifetime; 1 = born, 0 = died // maybe not needed??
    vReverseNormalLife = 1.0 - vNormalLife;

    // dampen
    float dampenedLife = vNormalLife;
    if(dampen > 0.0) {
        dampenedLife = EaseOutSine(vNormalLife);
    }

    // velocity
    vec3 newPosition = position + (velocity * dampenedLife);
    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // TODO: work out orthagraphic zoom
    float size = mix(sizes[0], sizes[1], smoothstep(sizeStops.x, sizeStops.y, vNormalLife));
    size = mix(size, sizes[2], smoothstep(sizeStops.y, sizeStops.z, vNormalLife));
    size = mix(size, sizes[3], smoothstep(sizeStops.z, sizeStops.w, vNormalLife));

    gl_PointSize = (size + sizeRandom) * (100.0 / length(mvPosition.xyz));

    // set varyings for fragment shader
    vRotation = vec2(cos(life * rotation), sin(life * rotation));
    vColorRandom = colorRandom;
}