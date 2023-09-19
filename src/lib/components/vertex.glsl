attribute float size;
attribute float angle;
attribute vec4 particleColor;
attribute float life;
attribute vec3 velocity;

uniform float maxLifetime;
uniform float dampen;

varying vec4 vColor;
varying vec2 vAngle;
varying float nLife;
varying float rLife;

float PI = 3.1415926;

float EaseOutSine(float x) {
    return sin((x * PI) / 2.0);
}

void main() {
    // normlised lifetime; 0 = born, 1 - died
    nLife = life / maxLifetime;

    // reverse lifetime; 1 = born, 0 = died
    rLife = 1.0 - nLife;

    // dampen
    float dampenedLife = nLife;
    if(dampen > 0.0) {
        dampenedLife = EaseOutSine(nLife);
    }

    // velocity
    vec3 newPosition = position + (velocity * dampenedLife);

    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // todo work out orthagraphic zoom
    //no attenuate
    //gl_PointSize = size ;
    // attenuate
    gl_PointSize = size * (100.0 / length(mvPosition.xyz));

    // set varyings for fragment shader
    vAngle = vec2(cos(life * angle), sin(life * angle));
    vColor = particleColor;
}