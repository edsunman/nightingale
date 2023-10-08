attribute float sizeRandom;
attribute float rotation;
attribute float colorRandom;
attribute float life;
attribute float randomValue;
attribute vec3 velocity;

uniform float maxLifetime;
uniform float dampen;
uniform vec4 sizeStops;
uniform vec4 sizes;
uniform vec3 gravity;
uniform vec3 wind;
uniform vec3 emitterPosition;

varying float vColorRandom;
varying vec2 vRotation;
varying float vNormalLife;
varying float vReverseNormalLife;

float PI = 3.1415926;
// TODO: alow custom easing function
float easeOut(float x) {
    //return sin((x * PI) / factor); // sine
    return pow(x - 1.0, 3.0) * (1.0 - x) + 1.0; // quart
}

float rand(float n) {
    return fract(sin(n) * 43758.5453123);
}

float noise(float p) {
    float fl = floor(p);
    float fc = fract(p);
    return mix(rand(fl), rand(fl + 1.0), fc);
}
/*
vec3 orbit(vec3 initialPosition, float life) {
    float radius = distance(vec2(emitterPosition.x, emitterPosition.z), vec2(initialPosition.x, initialPosition.z));
    float theta = life * 10.0;
    float x = 0.0 + radius * cos(theta);
    float z = 0.0 + radius * sin(theta);
    return initialPosition + vec3(x, 0.0, z);
}*/

void main() {
    // normlised lifetime; 0 = born, 1 - died
    vNormalLife = life / maxLifetime;

    // reverse lifetime; 1 = born, 0 = died // maybe not needed??
    vReverseNormalLife = 1.0 - vNormalLife;

    // dampen
    float dampenedLife = vNormalLife;
    if(dampen > 0.0) {
        dampenedLife = easeOut(vNormalLife);
    }

    // velocity
    vec3 newPosition = position + (velocity * dampenedLife);

    //float randomThing = randomVec(vec2(vNormalLife, vNormalLife));
    newPosition = vec3(newPosition.x, newPosition.y + noise(vNormalLife * 5.), newPosition.z);

    // gravity
    vec3 gravityVector = gravity * vNormalLife * vNormalLife;
    newPosition += gravityVector;

    // wind
    newPosition = newPosition + (wind * vNormalLife);

    // calculate screen position
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