let camera, scene, renderer, line;
let frustumSize = 4;
let coords = new THREE.Vector3();
let index = 0;

init();
render();

function init() {
  // https://stackoverflow.com/questions/17558085/three-js-orthographic-camera
  // See also: webgl_camera.html
  let aspect = window.innerWidth / window.innerHeight;

  let height = frustumSize;
  // the camera aspect ratio should match the aspect ratio of the renderer's viewport
  let width = frustumSize * aspect; // width of the camera's cuboid-shaped frustum measured in world-space units.
  let near = 0.1; // near and far are the world-space distances to the near and far planes of the frustum.
  let far = 20;

  // Pattern for instantiating an orthographic camera:
  // new OrthographicCamera(left, right, top, bottom, near, far);
  camera = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    near,
    far
  );
  camera.position.z = 5;

  scene = new THREE.Scene();

  let geometry = new THREE.BufferGeometry();

  let positionAttribute = new THREE.BufferAttribute(new Float32Array(1000 * 3), 3); // allocate large enough buffer
  positionAttribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", positionAttribute);

  let material = new THREE.LineBasicMaterial();

  line = new THREE.Line(geometry, material);
  scene.add(line);

  // initial points
  addPoint(0, 0, 0); // start point
  addPoint(1, 0, 0); // current pointer coordinate

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointermove", onPointerMove);

  window.addEventListener("resize", onWindowResize);
}

function addPoint(x, y, z) {
  let positionAttribute = line.geometry.getAttribute("position");
  positionAttribute.setXYZ(index, x, y, z);
  positionAttribute.needsUpdate = true;

  index++;

  line.geometry.setDrawRange(0, index);
}

function updatePoint(x, y, z) {
  let positionAttribute = line.geometry.getAttribute("position");
  positionAttribute.setXYZ(index - 1, coords.x, coords.y, 0);
  positionAttribute.needsUpdate = true;
}

function onPointerDown(event) {
  coords.x = (event.clientX / window.innerWidth) * 2 - 1;
  coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
  coords.z = (camera.near + camera.far) / (camera.near - camera.far);

  coords.unproject(camera);

  addPoint(coords.x, coords.y, 0);

  render();
}

function onPointerMove(event) {
  coords.x = (event.clientX / window.innerWidth) * 2 - 1;
  coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
  coords.z = (camera.near + camera.far) / (camera.near - camera.far);

  coords.unproject(camera);

  updatePoint(coords.x, coords.y, 0);

  render();
}

// See: discoverthreejs-site/static/examples/worlds/inline-scenes/first-steps/animation-loop.js
function onWindowResize() {
  // set the aspect ratio to match the new browser window aspect ratio
  // camera.aspect = container.clientWidth / container.clientHeight;
  let aspect = window.innerWidth / window.innerHeight;

  camera.left = (-frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;

  console.log("%ccamera LRTB", "color: deeppink;", camera.left, camera.right, camera.top, camera.bottom);

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function render() {
  renderer.render(scene, camera);
}
