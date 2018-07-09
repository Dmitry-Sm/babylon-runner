import {
    FreeCamera,
    Vector3,
    HemisphericLight,
    Mesh
} from 'babylonjs'


const createCamera = (scene, position) => {
    let v0 = BABYLON.Vector3.Zero()
    let radius = 6
    // let camera = new BABYLON.FreeCamera("camera1", position, scene);
    // camera.setTarget(v0)

    var camera = new BABYLON.ArcRotateCamera("Camera",  -Math.PI/2, Math.PI/8, radius, v0, scene, true)
    // var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI * 1.25, Math.PI/2, radius, v0, scene)

    camera.lowerRadiusLimit = 0.4;
    camera.upperRadiusLimit = 160;
    camera.wheelDeltaPercentage = 0.05;

    // camera.attachControl(document.getElementById("render-canvas"), false)
    return camera
}


const addLight = (scene, position) => {
    // var light = new BABYLON.PointLight("light1", position, scene);
    var light = new BABYLON.SpotLight("spotLight1", position, new BABYLON.Vector3(0, -20, 20), Math.PI / 2, 50, scene);
    light.position = position
    // light.intensity = 1.2;
    // light.range = 30
//  var light = new BABYLON.DirectionalLight("direct", new BABYLON.Vector3(-1, -2, 2).normalize(), scene);
// light.position = new BABYLON.Vector3(10, 30, -15);

    return light
}


const addGodRay = (scene, position, scale, camera, engine) => {
	var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1, camera, null, 120, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, engine, false);

	godrays.mesh.material.diffuseTexture = new BABYLON.Texture('assets/textures/sun2.png', scene, true, false, BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
	godrays.mesh.material.diffuseTexture.hasAlpha = true;
	godrays.mesh.position =  position
	godrays.mesh.scaling = scale

    return godrays
}


const addShadows = (light) => {
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.forceBackFacesOnly = true
    shadowGenerator.bias = 0.0002
    shadowGenerator.usePercentageCloserFiltering = true

    shadowGenerator.setDarkness(0.0);
    return shadowGenerator
}


const createBox = (scene, options) => { 
    var box = BABYLON.MeshBuilder.CreateBox('box', options, scene, false);
    setOptions(box, options)
  
    return box
}

const createSphere = (scene, options) => {
    var sphere = BABYLON.MeshBuilder.CreateSphere('sphere', options, scene);
    setOptions(sphere, options)
  
    return sphere
}


const createCylinder = (scene, options) => {
  var cylinder = BABYLON.MeshBuilder.CreateCylinder('cylinder', options, scene);
  setOptions(cylinder, options)

  return cylinder
}

const setOptions = (object, options) => {
    if (options.pivot) {
        object.setPivotPoint(new BABYLON.Vector3(
            options.pivot.x ? options.pivot.x : 0, 
            options.pivot.y ? options.pivot.y : 0, 
            options.pivot.z ? options.pivot.z : 0
        ))
    }
    if (options.position) {
        object.position.x = options.position.x ? options.position.x : object.position.x
        object.position.y = options.position.y ? options.position.y : object.position.y
        object.position.z = options.position.z ? options.position.z : object.position.z
    }
    if (options.rotation) {
        object.rotation.x = options.rotation.x ? options.rotation.x : object.rotation.x
        object.rotation.y = options.rotation.y ? options.rotation.y : object.rotation.y
        object.rotation.z = options.rotation.z ? options.rotation.z : object.rotation.z
    }
    object.parent = options.parent ? options.parent : object.parent
    object.material = options.material ? options.material : object.material
}

const createRibbon = (scene) => {
	var exponentialPath = function (p) {
		var path = [];
		for (var i = -1; i < 1; i++) {
			path.push(new BABYLON.Vector3(i, 0, p/20));
		}
		return path;
    }
    
	var arrayOfPaths = [];
	for (var p = 0; p < 20; p++) {
		arrayOfPaths[p] = exponentialPath(p);
    }
    
    var ribbon = BABYLON.Mesh.CreateRibbon("ribbon", arrayOfPaths, false, false, 0, scene, true, BABYLON.Mesh.DOUBLESIDE);

    return ribbon
}



const ImportMesh = (scene, fileName, onSuccess, onError, onProgress) => {
    let assetsManager = new BABYLON.AssetsManager(scene);

    let meshTask = assetsManager.addMeshTask(fileName, '', './assets/3d/', fileName)
    
    meshTask.onSuccess = onSuccess
    assetsManager.onTaskError = onError
    assetsManager.useDefaultLoadingScreen = false;


    assetsManager.load();
    return meshTask
}


const particleSistem = (scene) => {
    var particleSystem = new BABYLON.GPUParticleSystem("particles", 25000, scene);

    //Texture of each particle
    let txtr = new BABYLON.Texture("assets/textures/flare.png", scene);
    txtr.uScale = 0.1;
    txtr.vScale = 16;
    particleSystem.particleTexture = txtr

    // Where the particles come from
    // particleSystem.emitter = emitter.position
    particleSystem.emitter = new BABYLON.Vector3(0, 0, -10)
    particleSystem.minEmitBox = new BABYLON.Vector3(30, -20, 10); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(-30, -20, 10); // To...

    // Colors of all particles
    // particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    // particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    // particleSystem.colorDead = new BABYLON.Color4(0.1, 0, 0, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.4;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.1;
    particleSystem.maxLifeTime = 2;

    // Emission rate
    particleSystem.emitRate = 24500;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, 40, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(0, 5, 25);
    particleSystem.direction2 = new BABYLON.Vector3(0, 5, 25);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = 0;

    // Speed
    particleSystem.minEmitPower = 1.8;
    particleSystem.maxEmitPower = 2;
    particleSystem.updateSpeed = 0.004;

    // Start the particle system
    particleSystem.start();

    return particleSystem
}


const solidParticleSistem = (scene, material, camera, engine) => {
    var sps = new BABYLON.SolidParticleSystem("sps", scene);
    var model = createRibbon(scene)
    sps.addShape(model, 30);
    sps.buildMesh();
    var particles = sps.mesh
    particles.material = material
    // new BABYLON.VolumetricLightScatteringPostProcess("vl", 2, camera, particles, 75, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
    

    var particleHeight = 4;

    // sps.computeParticleTexture = false

    var areaSize = 2.0;
    
    var initParticle = function(particle) {
        
        particle.position.x = 40 * areaSize * (Math.random() - 0.5);
        particle.position.y = -10;
        particle.position.z = 0;
            
        particle.pivot.y = 10;
        particle.rotation.x = Math.random() * Math.PI * 2;
        particle.material = material

        particle.scale.z = particleHeight; 
    }

    var updateParticle = function(particle) {
        // particle.velocity--;
        particle.rotation.x -= 0.014;

        if (particle.velocity < 0) {
          particle.alive = false;
          SPS.recycleParticle(particle);    // call to your own recycle function
        }
    }
    model.dispose()

    sps.updateParticle = initParticle;
    sps.setParticles();
    // sps.computeParticleColor = false

    sps.updateParticle = updateParticle;

    return sps
}


const addFog = (scene) => {
    let particleSystem
    var fogTexture = new BABYLON.Texture("./assets/textures/smoke.png", scene);

    if (particleSystem) {
        particleSystem.dispose();
    }

    if (BABYLON.GPUParticleSystem.IsSupported) {
        // particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity: 10000 }, scene);
        // particleSystem.activeParticleCount = 5000;
        // particleSystem.manualEmitCount = particleSystem.activeParticleCount;
        // particleSystem.minEmitBox = new BABYLON.Vector3(-50, 2, -50); // Starting all from
        // particleSystem.maxEmitBox = new BABYLON.Vector3(50, 2, 50); // To..

        particleSystem = new BABYLON.ParticleSystem("particles", 800 , scene);
        particleSystem.manualEmitCount = particleSystem.getCapacity();
        particleSystem.minEmitBox = new BABYLON.Vector3(-25, 2, -25); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(25, 2, 25); // To...
    }

    particleSystem.particleTexture = fogTexture.clone();
    particleSystem.emitter = new BABYLON.Vector3(0, -5, 0)
    particleSystem.minEmitBox = new BABYLON.Vector3(40, 30, 40)
    particleSystem.maxEmitBox = new BABYLON.Vector3(-40, -20, 0)

    particleSystem.color1 = new BABYLON.Color4(0.8, 0.8, 0.8, 0.1);
    particleSystem.color2 = new BABYLON.Color4(.95, .95, .95, 0.25);
    // particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.1);
    particleSystem.minSize = 5;
    particleSystem.maxSize = 15;
    particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
    particleSystem.emitRate = 200;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction1 = new BABYLON.Vector3(0, 0.2, 0);
    particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);
    particleSystem.minAngularSpeed = -2;
    particleSystem.maxAngularSpeed = 2;
    particleSystem.minEmitPower = .5;
    particleSystem.maxEmitPower = 1;
    particleSystem.updateSpeed = 0.005;

    particleSystem.start();
}


export {
    createCamera,
    addLight,
    addGodRay,
    addShadows,
    createSphere,
    createCylinder,
    createBox,
    createRibbon,
    ImportMesh,
    particleSistem,
    solidParticleSistem,
    addFog
}