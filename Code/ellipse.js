// Ellipse Drawing with Raycasting
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create an ellipse
let ellipse;
let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
let segments = 64; // Number of line segments used to approximate the ellipse
let geometry = new THREE.BufferGeometry();
let vertices = new Float32Array((segments + 1) * 3); // (segments + 1) vertices * 3 coordinates (x, y, z)
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
ellipse = new THREE.LineLoop(geometry, material);
scene.add(ellipse);

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
    updateEllipse();
  }
}

function onMouseUp(event) {
  event.preventDefault();
  isDrawing = false;
  endPoint = getMousePosition(event.clientX, event.clientY);
  updateEllipse();
}

function getMousePosition(clientX, clientY) {
  let rect = renderer.domElement.getBoundingClientRect();

  // Before raycasting
  // return new THREE.Vector3(
  //   ((clientX - rect.left) / rect.width) * 2 - 1,
  //   -((clientY - rect.top) / rect.height) * 2 + 1,
  //   0
  // );

  // Using raycasting
  let mouse = new THREE.Vector2();
  mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  let intersectionPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1)), intersectionPoint);

  return intersectionPoint;
}

function updateEllipse() {
  let positions = ellipse.geometry.attributes.position.array;
  let center = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
  let radiusX = Math.abs(startPoint.x - endPoint.x) * 0.5;
  let radiusY = Math.abs(startPoint.y - endPoint.y) * 0.5;

  for (let i = 0; i <= segments; i++) {
    let theta = (i / segments) * Math.PI * 2;
    let x = center.x + Math.cos(theta) * radiusX;
    let y = center.y + Math.sin(theta) * radiusY;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = 0;
  }

  ellipse.geometry.attributes.position.needsUpdate = true;
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
