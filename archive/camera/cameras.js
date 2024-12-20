// https://youtu.be/FwcXultcBl4
const fov = 60;
const aspect = 1920 / 1080;
const near = 1.0;
const far = 1000.0;

const perspectiveCamera = new THREE.PerspectiveCamera(
  fov, aspect, near, far);

const left = -100;
const right = 100;
const top = 100;
const bottom = -100;

const orthographicCamera = new THREE.OrthographicCamera(  left, right, top, bottom, near, far);
  left, right, top, bottom, near, far);

this. camera = perspectiveCamera;
this. camera.position.set(75, 20, 0);

this. scene.add(perspectiveCamera);
