uniform sampler2D diffuseTexture;
uniform vec4 stops;
uniform mat4 colors;

varying vec2 vAngle;
varying float nLife;
varying vec4 vColor;

void main() {
    // rotate
    vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;

    // build up color and alpha gradient
    vec4 gradient = mix(colors[0], colors[1], smoothstep(stops.x, stops.y, nLife));
    gradient = mix(gradient, colors[2], smoothstep(stops.y, stops.z, nLife));
    gradient = mix(gradient, colors[3], smoothstep(stops.z, stops.w, nLife));

    // make sure particle is not visible before it is born
    if(nLife < 0.0) {
        gradient.a = 0.0;
    }

    gl_FragColor = texture2D(diffuseTexture, coords) * gradient;
}