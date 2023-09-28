// todo: raycaster (coordinates off)
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a rectangle
let rect;
let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

// let geometry = new THREE.Geometry();
// geometry.vertices.push(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());

let geometry = new THREE.BufferGeometry();
let vertices = new Float32Array(12); // 4 vertices * 3 coordinates (x, y, z)
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

rect = new THREE.LineLoop(geometry, material);
scene.add(rect);

// Handle mouse events
let isDrawing = false;
let startPoint;
let endPoint;
renderer.domElement.addEventListener("mousedown", onMouseDown, false);
renderer.domElement.addEventListener("mousemove", onMouseMove, false);
renderer.domElement.addEventListener("mouseup", onMouseUp, false);

function onMouseDown(event) {
  event.preventDefault();
  isDrawing = true;
  startPoint = getMousePosition(event.clientX, event.clientY);
}

function onMouseMove(event) {
  event.preventDefault();
  if (isDrawing) {
    endPoint = getMousePosition(event.clientX, event.clientY);
    updateRectangle();
  }
}

function onMouseUp(event) {
  event.preventDefault();
  isDrawing = false;
  endPoint = getMousePosition(event.clientX, event.clientY);
  updateRectangle();
}

function getMousePosition(clientX, clientY) {
  let rect = renderer.domElement.getBoundingClientRect();

  let mouse = new THREE.Vector2();
  mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  let intersectionPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1)), intersectionPoint);

  return intersectionPoint;
}

// function updateRectangle() {
//   rect.geometry.vertices[0].copy(startPoint);
//   rect.geometry.vertices[1].set(endPoint.x, startPoint.y, 0);
//   rect.geometry.vertices[2].copy(endPoint);
//   rect.geometry.vertices[3].set(startPoint.x, endPoint.y, 0);
//   rect.geometry.verticesNeedUpdate = true;
// }

function updateRectangle() {
  let positions = rect.geometry.attributes.position.array;
  positions[0] = startPoint.x;
  positions[1] = startPoint.y;
  positions[2] = startPoint.z;
  positions[3] = endPoint.x;
  positions[4] = startPoint.y;
  positions[5] = startPoint.z;
  positions[6] = endPoint.x;
  positions[7] = endPoint.y;
  positions[8] = startPoint.z;
  positions[9] = startPoint.x;
  positions[10] = endPoint.y;
  positions[11] = startPoint.z;
  rect.geometry.attributes.position.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
