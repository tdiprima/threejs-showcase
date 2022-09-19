function init() {
  scene = new THREE.Scene();

  const aspect = window.innerWidth / window.innerHeight;

  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    20
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);

  const setMouse = function () {
    coords.x = (event.clientX / window.innerWidth) * 2 - 1;
    coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
    coords.z = (camera.near + camera.far) / (camera.near - camera.far);
  };

  renderer.domElement.addEventListener('mousedown', () => {
    setMouse();

    coords.unproject(camera);

    addPoint(coords.x, coords.y, 0);

    render();
  });

  renderer.domElement.addEventListener('mousemove', () => {
    setMouse();

    coords.unproject(camera);

    updatePoint(coords.x, coords.y, 0);

    render();
  });

  const geometry = new THREE.BufferGeometry();

  const positionAttribute = new THREE.BufferAttribute(new Float32Array(1000 * 3), 3); // allocate large enough buffer
  positionAttribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', positionAttribute);

  const material = new THREE.LineBasicMaterial();

  line = new THREE.Line(geometry, material);
  scene.add(line);

  // initial points
  addPoint(0, 0, 0); // start point
  addPoint(1, 0, 0); // current pointer coordinate
}
