precision mediump float;

// Varying
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;

uniform float time;
// Uniforms
uniform mat4 world;
uniform vec2 resolution;
uniform float width;
uniform float height;


// Refs
uniform vec3 cameraPosition;
uniform sampler2D textureSampler;



float pattern(vec2 uv) {
	return sin(3. * time  + 10. * length(uv));
}

mat2 rotate(float a) {
	return mat2(cos(a), -sin(a),
		   sin(a), cos(a));
}


void main(void) {
    vec3 vLightPosition = vec3(0,20, -10);
    // vec2 resolution = vec2(width, height);
    
    // World values
    vec3 vPositionW = vec3(world * vec4(vPosition, 1.0));
    vec3 vNormalW = normalize(vec3(world * vec4(vNormal, 0.0)));
    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
    
    // Light
    vec3 lightVectorW = normalize(vLightPosition - vPositionW);
    vec3 color = texture2D(textureSampler, vUV).rgb;
    
    // diffuse
    float ndl = max(0., dot(vNormalW, lightVectorW));
    
    // Specular
    vec3 angleW = normalize(viewDirectionW + lightVectorW);
    float specComp = max(0., dot(vNormalW, angleW));
    specComp = pow(specComp, max(1., 64.)) * 2.;
    
    vec2 uv = rotate(time / 5.) *
      ((2. * gl_FragCoord.xy - resolution.xy) 
      / resolution.y / 2.);
    
    float l = length(uv);
    
    float inv = 1. / l;
    vec2 uvp = mod(
      uv * inv - vec2(inv * 2. + sin(time) / 2., 0.) + 1.,
      vec2(2.)) - 1.;

    vec3 image = vec3(
      pattern(uvp * 2.) * l / 2.,
      pattern(uvp * 2.) * l / 2.,
      pattern(uvp * 2.) * l / 2.);
          
    

    
    gl_FragColor = vec4(image * ndl, 2.);
}