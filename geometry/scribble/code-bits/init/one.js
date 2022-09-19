function init() {
  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(
    0,
    window.innerWidth,
    0,
    window.innerHeight,
    -window.innerHeight,
    window.innerHeight
  );
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.sortObjects = false;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', resize);

  mouseIsPressed = false;
  mouseX = 0;
  mouseY = 0;
  pmouseX = 0;
  pmouseY = 0;
  const setMouse = function () {
    mouseX = event.clientX;
    mouseY = event.clientY;
  };

  renderer.domElement.addEventListener('mousedown', () => {
    setMouse();
    mouseIsPressed = true;

    const point = new THREE.Vector3(mouseX, mouseY, 0);
    let points = [];
    points.push(point);
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    selected = line;
  });

  renderer.domElement.addEventListener('mousemove', () => {
    pmouseX = mouseX;
    pmouseY = mouseY;
    setMouse();

    if (mouseIsPressed) {
      if (typeof mouseDragged !== 'undefined') mouseDragged();
    }
    if (typeof mouseMoved !== 'undefined') mouseMoved();
  });

  renderer.domElement.addEventListener('mouseup', () => {
    mouseIsPressed = false;
    if (typeof mouseReleased !== 'undefined') mouseReleased();
  });

  if (typeof setup !== 'undefined') setup();

  render();
}

