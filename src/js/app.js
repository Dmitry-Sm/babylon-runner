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
  createShaderMaterial
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


//   var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
//     edge_blur: 5.0,
//     chromatic_aberration: 1.0,
//     // distortion: 1.0,
//     dof_focus_distance: 0,
//     dof_aperture: 0.30,			// set this very high for tilt-shift effect
//     grain_amount: 1.0,
//     dof_pentagon: true,
//     blur_noise: true,
//     // dof_gain: 2.0,
//     // // dof_threshold: 102.0,
//     // dof_darken: 0.25
// }, scene, 1.0, mainCamera);

let color_curve = initColorCurve()
initPipeLine(scene, mainCamera, color_curve)


var pbr = new BABYLON.PBRMetallicRoughnessMaterial("pbr", scene);
pbr.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("assets/textures/environment.dds", scene);
    



  let lightPos = new V3(0, 4, -4)
  let rayPos = new V3(0, 10, 20)
  let light = addLight(scene, lightPos)
  
  let shadows = addShadows(light)
  // shadows.addShadowCaster(sphere);
  // box.receiveShadows = true




  let ground_radius = 3
  var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
  // let groundMaterial = pbr.clone();

  // groundMaterial.metallic = 0;
  // groundMaterial.roughness = 0.01
  // groundMaterial.baseColor = BABYLON.Color3.White().scale(0.4)

  groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  groundMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
  
	groundMaterial.bumpTexture = new BABYLON.Texture("http://www.synergy-development.fr/equalonyzer/images/grained_uv.png", scene);
  groundMaterial.bumpTexture.uScale = 4;
  groundMaterial.bumpTexture.vScale = 4;

  groundMaterial.reflectionTexture = new BABYLON.Texture("http://www.synergy-development.fr/equalonyzer/images/spheremap.jpg", scene);
  groundMaterial.reflectionTexture.level = 0.4;
  groundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;


  let ground_optioins = {
    position: {
      y: -ground_radius
    },
    rotation: {
      z: Math.PI/2
    },
    diameter: ground_radius*2,
    height: 4,
    tessellation: 24
  }
  let ground = createCylinder(scene, ground_optioins)
  ground.receiveShadows = true
  ground.material = groundMaterial;


  var red = new BABYLON.StandardMaterial("red", scene)
  red.diffuseColor.copyFromFloats(0.6, 0.2, 0.2);

  var blue = new BABYLON.StandardMaterial("blue", scene)
  blue.diffuseColor.copyFromFloats(0.1, 0.3, 0.6);
  blue.reflectionTexture = new BABYLON.Texture("http://www.synergy-development.fr/equalonyzer/images/spheremap.jpg", scene);
  blue.reflectionTexture.level = 0.1;
  blue.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;

  // let blue = pbr.clone();

  blue.metallic = 0;
  blue.roughness = 0.01
  blue.baseColor = BABYLON.Color3.White().scale(0.4)


  let player_sphere_options = {
    position: {
      x: 0,
      y: 0.2,
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
      material: blue
    }
    let box = createBox(scene, box_options)
    shadows.addShadowCaster(box);
    
    // shadows.getShadowMap().renderList.push(box);
    return box
  }
  

  let box_num = 10
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
      ground.rotation.x -= 0.01 * delta
      player.animation()


      // updateLinePath(line, [player.object.position, boxes[0].getAbsolutePosition()])

      scene.render();
    }
  })

  
})
