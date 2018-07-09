precision highp float;

// Attributes
attribute vec3 position;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;
uniform vec3 mousePosition;

// Normal
varying vec2 vUV;

void main(void) {
  gl_Position = worldViewProjection * vec4(position, 0.90);

  vUV = uv;
}