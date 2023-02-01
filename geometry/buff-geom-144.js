let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let geometry;
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
 * Use r144
 * /js/three.js
 * THREE.BufferGeometry
 */
function createLine1() {
  geometry = new THREE.BufferGeometry().setFromPoints(points);

  // Electric Lime
  scene.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0xccff00})));

  const positionAttribute = geometry.getAttribute("position");
  // console.log("%cposition attribute", "color: #ff00cc;", positionAttribute);

  // TODO: See points-plotter-1.png
  // Float32Array, like canvas data
  console.log("%cpositions", "color: #00ff00;", positionAttribute.array);

  // [
  //   -5, 0, 0,
  //    5, 0, 0
  // ]

  // Actual vertex count (convenient)
  console.log("%cvertexCount", "color: #ffff00;", positionAttribute.count);
}

/**
 * Make it bigger
 */
function explodePoints1() {
  let positions = geometry.attributes.position.array; // another way to say it.
  // console.log("%cpositions", "color: #00ff00;", positions);
  for (let i = 0; i < positions.length; i += 3) {
    // console.log(positions[i]);
    let v = new THREE.Vector3(
      positions[i],
      positions[i + 1],
      positions[i + 2]
    ).multiplyScalar(2);

    positions[i] = v.x;
    positions[i + 1] = v.y;
    positions[i + 2] = v.z;
  }
  geometry.attributes.position.needsUpdate = true;
}

/**
 * Make tetrahedron
 */
function tetrahedron1() {
  let material = new THREE.MeshNormalMaterial();
  geometry = new THREE.BufferGeometry();

  let points1 = [
    new THREE.Vector3(-1, 1, -1), // c
    new THREE.Vector3(-1, -1, 1), // b
    new THREE.Vector3(1, 1, 1),   // a

    new THREE.Vector3(1, 1, 1),   // a
    new THREE.Vector3(1, -1, -1), // d
    new THREE.Vector3(-1, 1, -1), // c

    new THREE.Vector3(-1, -1, 1), // b
    new THREE.Vector3(1, -1, -1), // d
    new THREE.Vector3(1, 1, 1),   // a

    new THREE.Vector3(-1, 1, -1), // c
    new THREE.Vector3(1, -1, -1), // d
    new THREE.Vector3(-1, -1, 1)  // b
  ];

  geometry.setFromPoints(points1);
  geometry.computeVertexNormals();

  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

createLine1();

// TODO: Play.
// explodePoints1();
// tetrahedron1();

renderer.render(scene, camera);
