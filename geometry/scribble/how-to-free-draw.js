let camera;
let scene;
let renderer;
let line;

let frustumSize = 4;

let index = 0;
let coords = new THREE.Vector3();

let mouseIsPressed;

let material; // A line material
let selected; // Object that was picked

init();
render();

function init() {
  // Scene object
  scene = new THREE.Scene();

  let aspect = window.innerWidth / window.innerHeight;

  // Orthogonal camera for 2D drawing
  camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    20
  );

  camera.position.z = 5;

  let geometry = new THREE.BufferGeometry();

  // Allocate large enough buffer
  let positionAttribute = new THREE.BufferAttribute(new Float32Array(1000 * 3), 3);
  positionAttribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", positionAttribute);

  material = new THREE.LineBasicMaterial();

  line = new THREE.Line(geometry, material);
  scene.add(line); // todo: do this in mousedown

  // Initial points
  addPoint(0, 0, 0); // start point
  addPoint(1, 0, 0); // current pointer coordinate

  // Renderer will use a canvas taking the whole window
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Append canvas to the page
  document.body.appendChild(renderer.domElement);

  // Event listeners
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("dblclick", mouseReleased);

  window.addEventListener("resize", onWindowResize);
}

// Set up mouse callbacks.
mouseIsPressed = false;

function mouseReleased() {
  mouseIsPressed = false;
}

/* Add Point */
function addPoint(x, y, z) {
  let position = line.geometry.getAttribute("position");
  position.setXYZ(index, x, y, z);
  position.needsUpdate = true;

  index++;

  line.geometry.setDrawRange(0, index);
}

function updatePoint(x, y, z) {
  let position = line.geometry.getAttribute("position");
  position.setXYZ(index - 1, coords.x, coords.y, 0);
  position.needsUpdate = true;
}

/* Mousedown */
function onPointerDown(event) {
  mouseIsPressed = true;

  coords.x = (event.clientX / window.innerWidth) * 2 - 1;
  coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
  coords.z = (camera.near + camera.far) / (camera.near - camera.far);

  coords.unproject(camera);

  addPoint(coords.x, coords.y, 0);

  render();
}

/* Mousemove */
function onPointerMove(event) {
  if (mouseIsPressed) {
    coords.x = (event.clientX / window.innerWidth) * 2 - 1;
    coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
    coords.z = (camera.near + camera.far) / (camera.near - camera.far);

    coords.unproject(camera);

    updatePoint(coords.x, coords.y, 0);

    render();
    // print();
  }
}

function print() {
  console.log("%ccamera", "color: deeppink;", {
    "left": camera.left,
    "right": camera.right,
    "top": camera.top,
    "bottom": camera.bottom}
  );
}

/* Resize callback */
function onWindowResize() {
  let aspect = window.innerWidth / window.innerHeight;

  camera.left = (-frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix(); // Update the camera's frustum

  // Update the size of the renderer and the canvas
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

/* Render callback */
function render() {
  renderer.render(scene, camera);
}
