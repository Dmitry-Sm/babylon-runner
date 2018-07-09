precision mediump float;

// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;

// Varying
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;

// Refs
// uniform vec3 mousePosition;

void main(void) {
    vec4 outPosition = worldViewProjection * vec4(position, 1.0);
    vec3 v = position;
    v.y = sin( atan( position.y, position.z) * 1.) * 300. + 275.;
    v.z = cos( atan( position.y, position.z) * 1.) * 300. + 50.;
    gl_Position = worldViewProjection * vec4(v, 1.0);
    
    vUV = uv;
    vPosition = position;
    vNormal = normal;
}