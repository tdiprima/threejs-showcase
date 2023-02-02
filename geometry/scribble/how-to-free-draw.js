// todo: make the last points connect
let camera;
let scene;
let renderer;
let line;

const frustumSize = 4;
const varTop = frustumSize / 2; // Because it always wigs out if you declare a "top"
const varBottom = frustumSize / -2; // It's fine with "bottom", but idc

let index = 0; // number of indices to render
let coords = new THREE.Vector3(); // keep track of current mouse position

let mouseIsPressed = false;

init();
render();

function init() {
  // console.log("%cinit", "color: yellow");
  scene = new THREE.Scene();

  let aspect = window.innerWidth / window.innerHeight;

  // Orthogonal camera for 2D drawing
  camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2, // left
    frustumSize * aspect / 2,  // right
    varTop,                    // top
    varBottom,                 // bottom
    0.1,                       // near
    20                         // far
  );

  camera.position.z = 5;

  let geometry = new THREE.BufferGeometry();

  // Set a BufferAttribute, allocate some stuff, then give it to our geometry
  let positionAttribute = new THREE.BufferAttribute(new Float32Array(1000 * 3), 3);
  positionAttribute.setUsage(THREE.DynamicDrawUsage);
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

//------------------------------------------------------------
// Set up mouse callbacks.
//------------------------------------------------------------

/**
 * Mouseup
 * onPointerDown is still called.
 */
function mouseReleased() {
  // console.log("%cmouseReleased", "color: cyan");
  mouseIsPressed = false;
  // todo: clear last point, but don't erase the drawn object
}

/**
 * Add Point
 * Happens onPointerDown.
 */
function addPoint(x, y, z) {
  // console.log("%caddPoint", "color: orange");
  // Get current position, and set the next 3 array elements
  let position = line.geometry.getAttribute("position");
  position.setXYZ(index, x, y, z);

  // Change the position data values
  position.needsUpdate = true;

  index++;

  // Change the number of points rendered
  line.geometry.setDrawRange(0, index);
}

/**
 * Update Point
 * Happens onPointerMove.
 */
function updatePoint(x, y, z) {
  // console.log("%cupdatePoint", "color: cyan");
  let position = line.geometry.getAttribute("position");
  position.setXYZ(index - 1, coords.x, coords.y, 0); // we're just updating the same point
  position.needsUpdate = true;
}

/**
 * Mousedown
 * Add point & render.
 */
function onPointerDown(event) {
  // console.log("%conPointerDown", "color: orange");
  mouseIsPressed = true;

  // Convert the mouse coordinates to (-1, 1)
  coords.x = (event.clientX / window.innerWidth) * 2 - 1;
  coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
  coords.z = (camera.near + camera.far) / (camera.near - camera.far);
  // print("coords", coords);

  // You do not project. You un-project. The position into world space.
  coords.unproject(camera);

  addPoint(coords.x, coords.y, 0);

  render();
}

/**
 * Mousemove
 * Update point & render.
 */
function onPointerMove(event) {
  // console.log("%conPointerMove", "color: cyan");
  if (mouseIsPressed) {
    // Convert the mouse coordinates to (-1, 1)
    coords.x = (event.clientX / window.innerWidth) * 2 - 1;
    coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
    coords.z = (camera.near + camera.far) / (camera.near - camera.far);
    // print("coords", coords);

    // un-project to world space
    coords.unproject(camera);

    updatePoint(coords.x, coords.y, 0);

    render();
  }
}

/**
 * Resize callback
 * Fix size & render.
 */
function onWindowResize() {
  // console.log("%conWindowResize", "color: violet");
  let aspect = window.innerWidth / window.innerHeight;

  camera.left = (-frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = varTop;
  camera.bottom = varBottom;
  camera.updateProjectionMatrix(); // Update the camera's frustum
  // print("camera", camera);

  // Update the size of the renderer and the canvas
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

/**
 * Render callback
 */
function render() {
  // console.log("%crender", "color: red");
  renderer.render(scene, camera);
}

/**
 * Print camera attributes
 */
function print(type, object) {
  if (type === "camera") {
    // Print camera attributes
    console.log(`%c${type}`, "color: deeppink;", {
        "left": camera.left,
        "right": camera.right,
        "top": camera.top,
        "bottom": camera.bottom
      }
    );
  }

  if (type === "coords") {
    // Print coordinates
    console.log(`%c${type}`, "color: #ff00cc;", {
      x: parseFloat(coords.x.toFixed(2)),
      y: parseFloat(coords.y.toFixed(2)),
      z: parseFloat(coords.x.toFixed(2))
    });
  }
}
