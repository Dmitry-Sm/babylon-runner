import {Engine, Scene, SceneLoader} from 'babylonjs'

const initEngine = () => {
  
  var canvas = document.getElementById("render-canvas", true);
  var engine = new Engine(canvas, true);  
  engine.isFullscreen = true
  var scene = new Scene(engine);   
  scene.clearColor = new BABYLON.Color3(0, 0, 0);


  window.addEventListener("resize", function () {
    engine.resize()
  })



  return [engine, scene]
}


export {initEngine}