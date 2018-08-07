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
  var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);

  defaultPipeline.imageProcessing.colorCurves = color_curve
  defaultPipeline.depthOfField.focalLength = 150

  // Multisample Anti-Aliasing
  // defaultPipeline.samples = 1

  // Fast Approximate Anti-Aliasing
  defaultPipeline.fxaaEnabled = true

  defaultPipeline.bloomEnabled = true
  defaultPipeline.bloomKernel = 100
  defaultPipeline.bloomWeight = 0.2
  defaultPipeline.bloomThreshold = 0.01
  defaultPipeline.bloomScale = 0.4

  defaultPipeline.chromaticAberrationEnabled = true
  defaultPipeline.chromaticAberration.aberrationAmount = 4

  defaultPipeline.grainEnabled = true
  defaultPipeline.grain.intensity = 16
  defaultPipeline.grain.animated = true
  

  return defaultPipeline
}

export {
  initColorCurve,
  initPipeLine
}