// Here is an example program in Three.js that allows the user to free draw:
// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Line material and geometry
const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
const geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(-1, 0, 0));
geometry.vertices.push(new THREE.Vector3(0, 1, 0));
geometry.vertices.push(new THREE.Vector3(1, 0, 0));
const line = new THREE.Line(geometry, material);
scene.add(line);

// Mouse control variables
let isDrawing = false;
let previousMousePosition = new THREE.Vector2();

// Mouse event listeners
renderer.domElement.addEventListener('mousedown', onMouseDown);
renderer.domElement.addEventListener('mouseup', onMouseUp);
renderer.domElement.addEventListener('mousemove', onMouseMove);

function onMouseDown(event) {
  isDrawing = true;
  previousMousePosition.set(event.clientX, event.clientY);
}

function onMouseUp(event) {
  isDrawing = false;
}

function onMouseMove(event) {
  if (!isDrawing) {
    return;
  }

  // Get current mouse position
  const currentMousePosition = new THREE.Vector2(event.clientX, event.clientY);

  // Create a new line segment
  const newGeometry = new THREE.Geometry();
  newGeometry.vertices.push(
    new THREE.Vector3(previousMousePosition.x, previousMousePosition.y, 0),
    new THREE.Vector3(currentMousePosition.x, currentMousePosition.y, 0)
  );

  // Create a new line from the new segment
  const newLine = new THREE.Line(newGeometry, material);
  scene.add(newLine);

  // Update previous mouse position
  previousMousePosition.copy(currentMousePosition);

  // Render the scene
  renderer.render(scene, camera);
}

// This code sets up a basic Three.js scene with a camera and a renderer,
// and creates a line segment to display in the scene. The mouse event listeners
// allow the user to draw by creating new line segments between the previous and
// current mouse positions whenever the mouse is being moved while the left mouse
// button is pressed.
