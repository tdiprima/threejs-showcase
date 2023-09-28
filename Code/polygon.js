// Point and click works
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a polygon
let polygon;
let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
let geometry = new THREE.BufferGeometry();
let positions = [];
let vertices = new Float32Array(positions);
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
polygon = new THREE.LineLoop(geometry, material);
scene.add(polygon);

// Handle mouse events
let isDrawing = false;
let points = [];
renderer.domElement.addEventListener("mousedown", onMouseDown, false);
renderer.domElement.addEventListener("mousemove", onMouseMove, false);
renderer.domElement.addEventListener("mouseup", onMouseUp, false);
renderer.domElement.addEventListener("dblclick", onDoubleClick, false);

function onMouseDown(event) {
  event.preventDefault();
  if (!isDrawing) {
    isDrawing = true;
    let point = getMousePosition(event.clientX, event.clientY);
    points.push(point);
    updatePolygon();
  }
}

function onMouseMove(event) {
  event.preventDefault();
  if (isDrawing) {
    points[points.length - 1] = getMousePosition(event.clientX, event.clientY);
    updatePolygon();
  }
}

function onMouseUp(event) {
  event.preventDefault();
  if (isDrawing) {
    let point = getMousePosition(event.clientX, event.clientY);
    points.push(point);
    updatePolygon();
  }
}

function onDoubleClick(event) {
  event.preventDefault();
  if (isDrawing && points.length >= 3) {
    isDrawing = false;
    points.pop(); // Remove the duplicated point from double-click
    updatePolygon();
  }
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

// You need to update the vertices array whenever the points array changes.
function updatePolygon() {
  let numPoints = points.length;
  if (numPoints > 0) {
    positions = new Float32Array(numPoints * 3);
    for (let i = 0; i < numPoints; i++) {
      positions[i * 3] = points[i].x;
      positions[i * 3 + 1] = points[i].y;
      positions[i * 3 + 2] = points[i].z;
    }

    if (isDrawing) {
      positions[numPoints * 3] = points[0].x; // Connect the last point with the first point
      positions[numPoints * 3 + 1] = points[0].y;
      positions[numPoints * 3 + 2] = points[0].z;
    }
  }

  polygon.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  polygon.geometry.attributes.position.needsUpdate = true;
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
