
const createShaderMaterial = (scene, camera, type = 'basic', mainTexture, refTexture, light) => {
  var shaderMaterial = new BABYLON.ShaderMaterial('shader', scene, {
      vertex: './' + type,
      fragment: './' + type,
  },
  {
      attributes: ["position", "normal", "uv"],
      uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
  });

  if (refTexture)
    shaderMaterial.setTexture("refSampler", refTexture);
  if (mainTexture)
    shaderMaterial.setTexture("textureSampler", mainTexture);
  if (light)
    shaderMaterial.setVector3("lightPosition", light.position);
  shaderMaterial.setFloat("time", 0.1);
  shaderMaterial.setVector3("cameraPosition", camera.position);
  shaderMaterial.backFaceCulling = false;

  console.log('sh', shaderMaterial);
  // shaderMaterial.setFloat("width", 500)
  // shaderMaterial.setFloat("height", 500)

  return shaderMaterial
}



export {
  createShaderMaterial
}