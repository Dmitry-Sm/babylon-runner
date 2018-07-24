import { Material } from "babylonjs";

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







const createMaterial = (scene, options) => {
  var material = new BABYLON.StandardMaterial("material", scene);

  if (options.diffuseTexture) {
    material.diffuseTexture = options.diffuseTexture
    material.diffuseTexture.uScale = options.uScale || 1
    material.diffuseTexture.vScale = options.vScale || 1
  }

  if (options.diffuseTexture) {
    material.emissiveTexture = options.diffuseTexture
    material.emissiveTexture.uScale = options.uScale || 1
    material.emissiveTexture.vScale = options.vScale || 1
  }

  if (options.ambientTexture) {
    material.ambientTexture = options.ambientTexture
    material.ambientTexture.uScale = options.uScale || 1
    material.ambientTexture.vScale = options.vScale || 1
  } 

  if (options.specularTexture) {
    material.specularTexture = options.specularTexture
    material.specularTexture.uScale = options.uScale || 1
    material.specularTexture.vScale = options.vScale || 1
    // material.specularPower = 1
  }

  if (options.reflectionTexture) {
    material.reflectionTexture = options.reflectionTexture
    material.reflectionTexture.uScale = options.uScale || 1
    material.reflectionTexture.vScale = options.vScale || 1
    material.reflectionTexture.level = 1 || options.reflectionTextureLevel
  }

  if (options.bumpTexture) {
    material.bumpTexture = options.bumpTexture
    material.bumpTexture.uScale = options.uScale || 1
    material.bumpTexture.vScale = options.vScale || 1
    material.bumpTexture.level = options.bumpTextureLevel || 1
  }

  // material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.2) // отражаемый цвет
  // material.specularColor = new BABYLON.Color3(0.8, 0.2, 0.2) // отражаемый блик
  // material.emissiveColor = new BABYLON.Color3(0.1, 0.2, 0.1) // независимый от источника света цвет
  // material.albedoColor = new BABYLON.Color3(0.8, 0.2, 0.2) // -
  // material.ambientColor = new BABYLON.Color3(0.8, 0.2, 0.2) // -

  // material.cameraExposure = 2  // освещенность
  // material.cameraContrast = 1



  return material
}


const crPBR = (scene) => {
  var metal = new BABYLON.PBRMaterial("metal", scene);
  metal.reflectionTexture =  new BABYLON.Texture('./assets/textures/grass_texture.png', scene);
  metal.reflectionTexture.uScale = 128
  metal.reflectionTexture.vScale = 2
  metal.directIntensity = 0.3;
  metal.environmentIntensity = 0.7;
  metal.cameraExposure = 0.55;
  metal.cameraContrast = 1.6;
  metal.microSurface = 0.96;
  metal.reflectivityColor = new BABYLON.Color3(0.9, 0.9, 0.9);
  metal.albedoColor = new BABYLON.Color3(1, 1, 1);

  return metal
}




export {
  createShaderMaterial,
  createMaterial,
}