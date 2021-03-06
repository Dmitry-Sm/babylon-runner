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


  let color_curve = initColorCurve()
  initPipeLine(scene, mainCamera, color_curve)

  


  let lightPos = new V3(0, 4, -4)
  let rayPos = new V3(0, 10, 20)
  let light = addLight(scene, lightPos)
  
  let shadows = addShadows(light)
  // shadows.addShadowCaster(sphere);
  // box.receiveShadows = true





  let ground_radius = 3
  var groundMaterial = new BABYLON.StandardMaterial("ground", scene)

  // var pbr = new BABYLON.PBRMetallicRoughnessMaterial("pbr", scene) // Нет теней
  // pbr.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("assets/textures/environment.dds", scene)
  // let groundMaterial = pbr.clone();
  // groundMaterial.metallic = 0;
  // groundMaterial.roughness = 0.01
  // groundMaterial.baseColor = BABYLON.Color3.White().scale(0.4)

  groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
  groundMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2)
  
	groundMaterial.bumpTexture = new BABYLON.Texture("http://www.synergy-development.fr/equalonyzer/images/grained_uv.png", scene);
  groundMaterial.bumpTexture.uScale = 16
  groundMaterial.bumpTexture.vScale = 16

  groundMaterial.reflectionTexture = new BABYLON.Texture("http://www.synergy-development.fr/equalonyzer/images/spheremap.jpg", scene);
  groundMaterial.reflectionTexture.level = 0.4
  groundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE


  let ground_optioins = {
    position: {
      y: -ground_radius
    },
    rotation: {
      z: Math.PI/2
    },
    diameter: ground_radius*2,
    height: 4,
    tessellation: 32
  }
  let ground = createCylinder(scene, ground_optioins)
  ground.receiveShadows = true
  ground.material = groundMaterial;


  // var red = new BABYLON.StandardMaterial("red", scene)
  // red.diffuseColor.copyFromFloats(0.6, 0.2, 0.2);

  var blue = new BABYLON.StandardMaterial("blue", scene)
  blue.diffuseColor.copyFromFloats(0.1, 0.3, 0.6);
  blue.reflectionTexture = new BABYLON.Texture("http://www.synergy-development.fr/equalonyzer/images/spheremap.jpg", scene);
  blue.reflectionTexture.level = 0.1;
  blue.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;

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
    
  //   // shadows.getShadowMap().renderList.push(box);
  //   return box
  // }
  

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




  const onLoadSuccess = (task) => {
    let head = task.loadedMeshes[0]
    head.position = V3.Zero()
    // head.material = blue
    head.position.y = -2
  }


  const onLoadError = (task) => {
    console.log("error while loading " + task.name);
  }

  ImportMesh(scene, 'untitled.babylon', onLoadSuccess, onLoadError)

  

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

      scene.render()
    }
  })

  
})
