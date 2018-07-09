precision mediump float;

// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;
uniform vec3 mousePosition;

// Varying
varying vec4 vPosition;
varying vec3 vNormal;

void main() {

    // vec4 p = vec4( position, 1. );
    vec3 p = position;

    // if (pow(pow(p.x  - mousePosition.x * 26., 2.) + pow(p.y  - mousePosition.y * 26., 2.), 0.5) < 10.) {
    //     p.z = 0.;
    // }


    vPosition = vec4( p, 1. );
    vNormal = normal;

    gl_Position = worldViewProjection * vec4( p, 1. );
}