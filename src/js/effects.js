const initColorCurve = (options) => {
  var curve = new BABYLON.ColorCurves();
  curve.globalHue = 200;
  curve.globalDensity = 80;
  curve.globalSaturation = 80;
  curve.highlightsHue = 20;
  curve.highlightsDensity = 80;
  curve.highlightsSaturation = -80;
  curve.shadowsHue = 2;
  curve.shadowsDensity = 80;
  curve.shadowsSaturation = 40;
}

const initPipeLine = (scene, camera, color_curve, options) => {
  var pipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);

  pipeline.imageProcessing.colorCurves = color_curve
  pipeline.depthOfField.focalLength = 150

  // Multisample Anti-Aliasing
  // pipeline.samples = 1

  // Fast Approximate Anti-Aliasing
  pipeline.fxaaEnabled = true

  
  pipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Medium;
  pipeline.depthOfFieldEnabled = true;
  pipeline.depthOfField.focalLength = 300;
  pipeline.depthOfField.fStop = 5;
  pipeline.depthOfField.focusDistance = 4000;

  pipeline.bloomEnabled = true
  pipeline.bloomKernel = 100
  pipeline.bloomWeight = 0.2
  pipeline.bloomThreshold = 0.01
  pipeline.bloomScale = 0.4

  pipeline.chromaticAberrationEnabled = true
  pipeline.chromaticAberration.aberrationAmount = 4

  pipeline.grainEnabled = true
  pipeline.grain.intensity = 16
  pipeline.grain.animated = true
  

  return pipeline
}

export {
  initColorCurve,
  initPipeLine
}