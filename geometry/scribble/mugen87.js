let camera, scene, renderer, line;

const frustumSize = 4;

let index = 0;
const coords = new THREE.Vector3();

init();
render();

function init() {
  const aspect = window.innerWidth / window.innerHeight;

  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    20
  );
  camera.position.z = 5;

  scene = new THREE.Scene();

  const geometry = new THREE.BufferGeometry();

  const positionAttribute = new THREE.BufferAttribute(new Float32Array(1000 * 3), 3); // allocate large enough buffer
  positionAttribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', positionAttribute);

  const material = new THREE.LineBasicMaterial();

  line = new THREE.Line(geometry, material);
  scene.add(line);

  // initial points

  addPoint(0, 0, 0); // start point
  addPoint(1, 0, 0); // current pointer coordinate

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);

  window.addEventListener('resize', onWindowResize);
}

function addPoint(x, y, z) {
  const positionAttribute = line.geometry.getAttribute('position');
  positionAttribute.setXYZ(index, x, y, z);
  positionAttribute.needsUpdate = true;

  index++;

  line.geometry.setDrawRange(0, index);
}

function updatePoint(x, y, z) {
  const positionAttribute = line.geometry.getAttribute('position');
  positionAttribute.setXYZ(index - 1, coords.x, coords.y, 0);
  positionAttribute.needsUpdate = true;
}

function onPointerDown(event) {
  coords.x = (event.clientX / window.innerWidth) * 2 - 1;
  coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
  coords.z = (camera.near + camera.far) / (camera.near - camera.far);

  coords.unproject(camera);

  addPoint(coords.x, coords.y, 0);

  render();
}

function onPointerMove(event) {
  coords.x = (event.clientX / window.innerWidth) * 2 - 1;
  coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
  coords.z = (camera.near + camera.far) / (camera.near - camera.far);

  coords.unproject(camera);

  updatePoint(coords.x, coords.y, 0);

  render();
}

// See: discoverthreejs-site/static/examples/worlds/inline-scenes/first-steps/animation-loop.js
function onWindowResize() {
  // set the aspect ratio to match the new browser window aspect ratio
  // camera.aspect = container.clientWidth / container.clientHeight;
  const aspect = window.innerWidth / window.innerHeight;

  camera.left = (-frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  console.log("camera LRTB", camera.left, camera.right, camera.top, camera.bottom);

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function render() {
  renderer.render(scene, camera);
}
