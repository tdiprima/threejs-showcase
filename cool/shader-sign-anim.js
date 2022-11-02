import * as THREE from "https://cdn.rawgit.com/mrdoob/three.js/r124/build/three.module.js";
import Stats from "https://cdn.rawgit.com/mrdoob/three.js/r124/examples/jsm/libs/stats.module.js";
// import { Reflector } from "https://cdn.rawgit.com/mrdoob/three.js/r124/examples/jsm/objects/Reflector.js";
// import { GPUComputationRenderer } from "https://cdn.rawgit.com/mrdoob/three.js/r124/examples/jsm/misc/GPUComputationRenderer.js";
import { GUI } from "https://cdn.rawgit.com/mrdoob/three.js/r124/examples/jsm/libs/dat.gui.module.js";

console.log(`%cREV: ${THREE.REVISION}`, "color: #ff00cc;");

MY3D.preInit(THREE);

let stats = new Stats();
document.body.appendChild(stats.dom);

let params = {
  init: init,

  camY: 1,
  testColor: 0xff00ff, // "#ff00ff"

  FOG: {
    skyCol: 0x010808, // "#010808"
    fogCol: 0x11ffff, // "#11ffff"
    fogDensity: 0.3
  },

  SKY: {
    cloudAlpha: 0.33,
    cloudSize: 180,
    _cloudNb: 800
  },

  RAIN: {
    pointRatio: 0.01,
    rainSize: 60,
    rainAlpha: 0.45
  }
};

let rainVars = params.RAIN;
let fogVars = params.FOG;
let skyVars = params.SKY;

let gui = new GUI();
MY3D.addGuiParams(gui, params);

const RAIN_AOE = 0.004;
const RAIN_SPEED = 0.08;
const SKY_SIZE = 9000;

// https://raw.githubusercontent.com/chrismcg61/TechDemos/master/Media/CloudParticle.jpg
let pointTexture = new THREE.TextureLoader().load("CloudParticle.jpg");

let skyParticles, cloudParticles, rainParticles, rainFloorParticles;
function init() {
  shaderUniformList = [];

  MY3D.onWindowResize();

  camera.position.set(0, 1, 2);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  document.body.onkeydown = myKeyPress;

  scene = new THREE.Scene();
  scene.add(camera);

  init2();
}

function init2() {
  let floorGeometry = new THREE.PlaneBufferGeometry(900, 900, 30, 30);
  floorGeometry.rotateX(-Math.PI / 2);
  let vertices = floorGeometry.attributes.position.array;

  for (let i = 0, l = vertices.length; i < l; i += 3) {
    let xx = Math.abs(vertices[i]);
    let zz = Math.abs(vertices[i + 2]);
    if (xx > 50) vertices[i + 1] = zz * zz * 0.0005 * Math.random();
  }

  let floorMesh = new THREE.Mesh(floorGeometry, new THREE.MeshPhongMaterial({ color: 0xcc8866 }));
  scene.add(floorMesh);

  /* Stars-Sky */
  skyParticles = initGpuParticlesSky(
    1, // bNormalize
    500 * 1000, // pointNb
    SKY_SIZE, // size
    1, // aoeRatio
    1, // pointSize
    0.02, // speed
    new THREE.Color(0.3, 0.5, 0.9), // color
    { r: 1, g: 0, b: 0 }, // _colorA
    vShaderSky, // vertex shader
    fShaderSky // fragment shader
  );
  scene.add(skyParticles);

  /* Clouds-Sky */
  cloudParticles = initGpuParticlesSky(
    1, // bNormalize
    skyVars._cloudNb, // pointNb
    SKY_SIZE * 0.03, // size
    1, // aoeRatio
    skyVars.cloudSize, // pointSize
    0.005, // speed
    new THREE.Color(0.4, 0.8, 0.8), // color
    { r: 0.6, g: 0.1, b: 0.1 }, // _colorA
    vShaderSky, // vertex shader
    fShaderSky // fragment shader
  );

  cloudParticles.material.uniforms.pointTexture.value = pointTexture;
  scene.add(cloudParticles);

  /* Rain Fall */
  rainParticles = initGpuParticlesSky(
    0, // bNormalize
    100 * 1000, // pointNb
    SKY_SIZE, // size
    RAIN_AOE, // aoeRatio
    rainVars.rainSize, // pointSize
    RAIN_SPEED, // speed
    new THREE.Color(0.1, 0.1, 0.1), // color
    new THREE.Color(0), // _colorA
    vShaderRain, // vertex shader
    fShaderRain // fragment shader
  );

  scene.add(rainParticles);

  /* Rain Floor */
  rainFloorParticles = initGpuParticlesSky(
    0, // bNormalize
    30 * 1000, // pointNb
    SKY_SIZE, // size
    RAIN_AOE, // aoeRatio
    1, // pointSize
    RAIN_SPEED, // speed
    new THREE.Color(0.1, 0.1, 0.1), // color
    new THREE.Color(0), // _colorA
    vShaderRain, // vertex shader
    fShaderRain // fragment shader
  );
  scene.add(rainFloorParticles);

  /*** Text Panels ***/
  let textPanel0 = txtPanel_Init();
  scene.add(textPanel0);

  let textPanel1 = txtPanel_Init();
  scene.add(textPanel1);
  textPanel1.position.set(0, 1, 0);
  txtPanel_Custom(textPanel1.material);
}

function txtPanel_Init() {
  let textTexture = addTexture(1024);
  let textShaderMaterial = initTextShaderMaterial(textTexture);
  return new THREE.Mesh(new THREE.PlaneGeometry(1, 1), textShaderMaterial);
}

function txtPanel_Custom(textShaderMaterial) {
  initTexture_Text(textShaderMaterial.uniforms.tex0.value, 84, "TITLE_0", [
    "Skill1",
    "Skill2",
    "Skill3",
    "Skill_Abcdef_ghijkl",
    "E",
    "F",
    "g",
    "H",
    "I",
    "j"
  ]);

  textShaderMaterial.uniforms.uColor.value = new THREE.Vector4(1, 0, 1, 0.95);
  textShaderMaterial.uniforms.speed.value = 0.1;
  textShaderMaterial.transparent = true;
}

function animate() {
  camera.position.y = params.camY;
  {
    scene.background = new THREE.Color(fogVars.skyCol);
    scene.fog = new THREE.FogExp2(fogVars.fogCol, fogVars.fogDensity * 0.01);
  }

  if (cloudParticles) {
    cloudParticles.material.uniforms.alpha.value = skyVars.cloudAlpha;
    cloudParticles.material.uniforms.pointSize.value = skyVars.cloudSize;
  }

  if (rainParticles) {
    rainFloorParticles.material.uniforms.alpha.value = rainVars.rainAlpha;
    rainParticles.material.uniforms.alpha.value = rainVars.rainAlpha;
    rainParticles.material.uniforms.pointSize.value = rainVars.rainSize;
    rainParticles.material.uniforms.pointRatio.value = rainVars.pointRatio;
  }

  for (let i = 0; i < shaderUniformList.length; i++) {
    shaderUniformList[i].time.value += 1.0;
    shaderUniformList[i].camPos = { value: camera.position };
  }

  /* Test LightMesh */
  rainParticles.material.uniforms.lightMeshes = {
    value: [{ pos: new THREE.Vector3(), color: new THREE.Color(params.testColor) }]
  };

  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

let camSpeed = 1;
function myKeyPress(event) {
  let key = event.which || event.keyCode;
  // 224 = Apple command key on Firefox; in Chrome it's 91.
  // The left command key is 91 and the right command key 93.
  // So in your code please check for both.
  console.log(key);

  // if (key === 16) spawnLight(1); // SHIFT
  // if (key === 17) spawnBlocks(); // CTRL
  if (key === 35) camera.rotation.x -= 0.1; // END
  if (key === 36) camera.rotation.x += 0.1; // HOME

  if (key === 38) camera.position.z -= camSpeed; // UP
  if (key === 40) camera.position.z += camSpeed; // DOWN
  if (key === 37) camera.position.x -= camSpeed; // LEFT
  if (key === 39) camera.position.x += camSpeed; // R
}

init();
animate();
