let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let geometry = new THREE.Geometry();
let points = [];

// Line
points.push(new THREE.Vector3(-5, 0, 0));
points.push(new THREE.Vector3(5, 0, 0));

// Triangle
// points.push(new THREE.Vector3(-3, 3, 0));
// points.push(new THREE.Vector3(3, 3, 0));
// points.push(new THREE.Vector3(0, -3, 0));
// points.push(new THREE.Vector3(-3, 3, 0));

/**
 * Use r124
 * https://cdn.jsdelivr.net/npm/three@0.124/build/three.js
 * THREE.Geometry
 */
function createLine() {
  points.forEach(p => geometry.vertices.push(p));

  // Electric Lime
  scene.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0xff00cc})));

  console.log("%cpositions", "color: #00ff00;", geometry.vertices); // JSON.stringify(geometry.vertices)
  // [
  //   -5, 0, 0,
  //    5, 0, 0
  // ]

  // Actual vertex count (convenient)
  console.log("%cvertexCount", "color: #ffff00;", geometry.vertices.length);
}

/**
 * Make it bigger
 */
function explodePoints() {
  let vertices = geometry.vertices;
  for (let i = 0; i < vertices.length; i++) {
    vertices[i].multiplyScalar(2);
  }
  geometry.verticesNeedUpdate = true;
}

/**
 * Make tetrahedron
 */
function tetrahedron() {
  let material = new THREE.MeshNormalMaterial();
  geometry = new THREE.Geometry();

  geometry.vertices.push(
    new THREE.Vector3(1, 1, 1),   // a
    new THREE.Vector3(-1, -1, 1), // b
    new THREE.Vector3(-1, 1, -1), // c
    new THREE.Vector3(1, -1, -1)  // d
  );

  geometry.faces.push(
    new THREE.Face3(2, 1, 0),
    new THREE.Face3(0, 3, 2),
    new THREE.Face3(1, 3, 0),
    new THREE.Face3(2, 3, 1)
  );

  geometry.computeFlatVertexNormals();
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

createLine();

// TODO: Play.
// explodePoints();
// tetrahedron();

renderer.render(scene, camera);
