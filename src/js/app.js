import $ from 'jquery'

import {
  createCamera, 
  addLight, 
  addGodRay, 
  addShadows, 
  createSphere, 
  createCylinder,
  createBox, 
  createRibbon,
  ImportMesh
} from './mod'

import {
  particleSistem, 
  solidParticleSistem, 
  addFog
} from './particleSistems'

import {
  createShaderMaterial, createMaterial
} from './materials'

import {
  Player
} from './player'

import {
  initColorCurve,
  initPipeLine
} from './effects'

import{initEngine} from './initEngine'
import { Vector2, float } from 'babylonjs';
 


$(document).ready(()=>{
  let V3 = BABYLON.Vector3

  BABYLON.Animation.AllowMatricesInterpolation = true;

  let [engine, scene] = initEngine()
  let heads = []
  let selectedHead = 1
  let headWidth = 12
  let range = 0

  let cameraPos = new V3(0, 10, -5)
  let mainCamera = createCamera(scene, cameraPos)


  let color_curve = initColorCurve()
  let pipeLine = initPipeLine(scene, mainCamera, color_curve)

  


  let lightPos = new V3(0, 5, -8)
  let rayPos = new V3(0, 10, 20)
  let light = addLight(scene, lightPos)
  
  let shadows = addShadows(light)
  // shadows.addShadowCaster(sphere);
  // box.receiveShadows = true




  let ground_radius = 32
  let groundMaterial = createMaterial(scene, {
    // diffuseTexture: new BABYLON.Texture('./assets/textures/grass_texture.png', scene),
    ambientTexture: new BABYLON.Texture('./assets/textures/grass_texture.png', scene),
    // emissiveTexture: new BABYLON.Texture('./assets/textures/grass_texture.png', scene),
    // specularTexture: new BABYLON.Texture('./assets/textures/grass_texture.png', scene),
    specularPower: 1,
    // reflectionTexture: new BABYLON.Texture('./assets/textures/grass_texture.png', scene),
    // reflectionTextureLevel: 2,
    bumpTexture: new BABYLON.Texture('./assets/textures/grass_bump.png', scene),
    bumpTextureLevel: 1,
    uScale: 128,
    vScale: 2,
    // cameraExposure: 1,
    // cameraContrast: 1
  })


  let ground_optioins = {
    position: {
      y: -ground_radius
    },
    rotation: {
      z: Math.PI/2
    },
    diameter: ground_radius*2,
    height: 4,
    tessellation: 128
  }
  let ground = createCylinder(scene, ground_optioins)
  ground.receiveShadows = true

  ground.material = groundMaterial;


  var red = new BABYLON.StandardMaterial("red", scene)
  red.diffuseColor.copyFromFloats(0.6, 0.2, 0.2);

  let blue = createMaterial(scene, {
    diffuseTexture: new BABYLON.Texture('./assets/textures/stone_texture.png', scene),
    ambientTexture: new BABYLON.Texture('./assets/textures/stone_ambient.png', scene),
    // emissiveTexture: new BABYLON.Texture('./assets/textures/grass_texture.png', scene),
    // specularTexture: new BABYLON.Texture('./assets/textures/grass_texture.png', scene),
    specularPower: 1,
    // reflectionTexture: new BABYLON.Texture('./assets/textures/grass_texture.png', scene),
    // reflectionTextureLevel: 2,
    bumpTexture: new BABYLON.Texture('./assets/textures/stone_normal.png', scene),
    bumpTextureLevel: 1,
    uScale: 1,
    vScale: 1,
    // cameraExposure: 1,
    // cameraContrast: 1
  })
  let wood = createMaterial(scene, {
    diffuseTexture: new BABYLON.Texture('./assets/textures/wood_texture.png', scene),
    ambientTexture: new BABYLON.Texture('./assets/textures/wood_ambient.png', scene),
    // emissiveTexture: new BABYLON.Texture('./assets/textures/grass_texture.png', scene),
    // specularTexture: new BABYLON.Texture('./assets/textures/grass_texture.png', scene),
    specularPower: 0.1,
    // reflectionTexture: new BABYLON.Texture('./assets/textures/grass_texture.png', scene),
    // reflectionTextureLevel: 2,
    bumpTexture: new BABYLON.Texture('./assets/textures/wood_normal.png', scene),
    bumpTextureLevel: 2,
    uScale: 1,
    vScale: 2,
    // cameraExposure: 1,
    // cameraContrast: 1
  })


  let player_sphere_options = {
    position: {
      x: 0,
      y: 0.3,
      z: 0
    },
    diameter: 0.6,
    material: blue
  }
  let sphere = createSphere(scene, player_sphere_options)
  shadows.addShadowCaster(sphere);

  let playaer_options = {

  }
  let player = new Player(scene, sphere, mainCamera, playaer_options)


  let boxes = []

  const newBox = (i, x) => {
    let box_options = {
      parent: ground,
      scaling: {
        width: 0.1,
        height: 1,
        depth: 0.8
      },
      position: {
        x: 0,
        y: x // x in Global
      },
      rotation: {
        y: -i
      },
      pivot: {
        x: -ground_radius
      },
      material: wood
    }
    let box = createBox(scene, box_options)
    shadows.addShadowCaster(box);
    
    // shadows.getShadowMap().renderList.push(box);
    return box
  }
  

  let box_num = 24
  let x = 0
  for (let i = 0; i < box_num; i++) {
    let new_x = -ground_radius + Math.ceil(Math.random()*3 - 2) * 1.4
    while (x == new_x) {
      new_x = -ground_radius + Math.ceil(Math.random()*3 - 2) * 1.4
    }
    x = new_x
    let y = Math.PI*2/(box_num + 1)*(i+1)
    boxes.push(newBox(y, x))
  }

  for(let b of boxes) {
    b.scaling = new V3(1, 1.2, 0.1)
  }







  const key_pressed = (event) => {
    switch (event.direction) {
      case 'right':
        if (player.position < 1) {
          player.right()
        }
        break;
      case 'left':
        if (player.position > -1) {
          player.left()
        }
        break;
      case 'up':
        player.jump()
        break;
    }
  }

  window.addEventListener('press', key_pressed, false)
  window.addEventListener('swipe', key_pressed, false)


  let line = BABYLON.Mesh.CreateLines("line", [], scene, true);

  const updateLinePath = (line, path) => {
    line = BABYLON.Mesh.CreateLines("line", path, scene, null, line);
  }
  


  //////////////
  let fpsLable = document.getElementById('fps')
  let time = 0
  let delta = 0.4
  //////////////
  engine.runRenderLoop(function () {
    // pipeLine.depthOfField.focusDistance = 6000 + (6000 * (Math.sin((new Date).getTime()/400)+1)/2)

    fpsLable.innerHTML = Math.ceil(engine.getFps())


    if (scene) {
      time += 0.0004;

      player.object.material = blue
      for(let b of boxes) {
        if (player.object.intersectsMesh(b, true)) {
          player.object.material = red
          delta = -0.7
        } 
      }
      if (delta < 4) {
        delta += 0.01
      }
      ground.rotation.x -= 0.0002 * delta
      player.animation(delta)


      // updateLinePath(line, [player.object.position, boxes[0].getAbsolutePosition()])

      scene.render();
    }
  })

  
})
