import ParkingSpot from "./parks.js";

let scene, camera, renderer, sphereMesh, meshobject, targetCounty;
let frame = 0;
const clock = new THREE.Clock();

async function loadData() {
  const predata = await d3.csv("./2021set.csv");
  targetCounty = predata.filter(d => (d.County = "MN"));
  console.log("targetCounty", targetCounty);
  init();

  animate(targetCounty);
  sphereMesh.geometry.attributes.position.needsUpdate = true;
}

loadData();

function init() {
  scene = new THREE.Scene();
  const canvas = document.querySelector("#myCanvas");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const texture = new THREE.TextureLoader().load(
    "https://raw.githubusercontent.com/jotnajoa/soonkpaik/master/disc.png",
  );

  const rawRad = 2;
  meshobject = new ParkingSpot(rawRad, targetCounty.length, 100, texture, targetCounty);
  sphereMesh = meshobject.createMesh();
  camera.position.z = 5;
  scene.add(sphereMesh);
  console.log("sphereMesh", sphereMesh);
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();
  // elapsedTime;
  frame += 0.1;

  // sphereMesh.rotation.x = frame;

  const { array, originalPosition } = sphereMesh.geometry.attributes.position;

  for (let i = 0; i < targetCounty.length; i++) {
    const i3 = i * 3;
    array[i3] = Math.sin(frame);
    // array[i3 + 1] = originalPosition[i3 + 1] + Math.sin(frame) * 10;
  }

  sphereMesh.geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}
