// todo: make the last points connect
let camera;
let scene;
let renderer;
let line;

let frustumSize = 4;

let index = 0; // number of indices to render
let coords = new THREE.Vector3();

let mouseIsPressed;

init();
render();

function init() {
  console.log("%cinit", "color: yellow");
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

  // Allocate large enough buffer (1000 points)
  let positionAttribute = new THREE.BufferAttribute(new Float32Array(1000 * 3), 3);
  // optimize performance
  positionAttribute.setUsage(THREE.DynamicDrawUsage); // user will set data occasionally
  geometry.setAttribute("position", positionAttribute);

  // A line material
  let material = new THREE.LineBasicMaterial();

  line = new THREE.Line(geometry, material);
  scene.add(line); // todo: do this in mousedown

  // First of all, add 2 points
  addPoint(0, 0, 0); // center
  addPoint(1, 0, 0); // 1 unit to the right

  // Renderer will use a canvas taking the whole window
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add canvas to page
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
  console.log("%cmouseReleased", "color: cyan");
  mouseIsPressed = false;
  // todo: clear last point, but don't erase the drawn object
  // index = 0; <- Nope. this erases it.
  // let position = line.geometry.getAttribute("position");
  // position.setXYZ(index, x, y, z);
  // position.needsUpdate = true;
  // index++;
  // line.geometry.setDrawRange(0, index);
}

/* Add Point */
function addPoint(x, y, z) {
  console.log("%caddPoint", "color: orange");
  let position = line.geometry.getAttribute("position");
  position.setXYZ(index, x, y, z);
  position.needsUpdate = true;

  index++;

  line.geometry.setDrawRange(0, index);
}

function updatePoint(x, y, z) {
  console.log("%cupdatePoint", "color: cyan")
  let position = line.geometry.getAttribute("position");
  position.setXYZ(index - 1, coords.x, coords.y, 0);
  position.needsUpdate = true;
}

/* Mousedown */
function onPointerDown(event) {
  // Add point & render.
  console.log("%conPointerDown", "color: orange")
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
  // Update point & render.
  console.log("%conPointerMove", "color: cyan");
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

/* Resize callback */
function onWindowResize() {
  // Fix size & render
  console.log("%conWindowResize", "color: violet")
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
  console.log("%crender", "color: red")
  renderer.render(scene, camera);
}

function print() {
  console.log("%ccamera", "color: deeppink;", {
      "left": camera.left,
      "right": camera.right,
      "top": camera.top,
      "bottom": camera.bottom
    }
  );
}
