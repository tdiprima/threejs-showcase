// The code from the resource is highly inefficient since you continously allocate geometry all the time without disposal management which will lead to a memory leak. Try the following approach:

let camera, 
scene, 
renderer, 
line;

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

  //

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

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;

  camera.left = (-frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function render() {
  renderer.render(scene, camera);
}

// body {
//     margin: 0;
// }

// <script src="https://cdn.jsdelivr.net/npm/three@0.144/build/three.min.js"></script>

// The idea is to allocate a single large buffer to store all current and future points of a line. You then use setDrawRange() to define, what parts of the buffer should be rendered.

// https://stackoverflow.com/questions/73705786/how-to-free-draw-a-line-in-three-js-r144-on-mouse-move-and-using-buffergeometry/73713583#73713583
