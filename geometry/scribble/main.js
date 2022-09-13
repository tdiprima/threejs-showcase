//
// Global variables
//
let scene,
width,
height,
camera,
renderer;

let mouseIsPressed,
mouseX,
mouseY,
pmouseX,
pmouseY;

//
// Initialization of global objects and set up callbacks for mouse and resize
//
function init() {
  // Scene object
  scene = new THREE.Scene();

  // Will use the whole window for the webgl canvas
  width = window.innerWidth;
  height = window.innerHeight;

  // Orthogonal camera for 2D drawing
  camera = new THREE.OrthographicCamera(0, width, 0, height, -height, height);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Renderer will use a canvas taking the whole window
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.sortObjects = false;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // Append camera to the page
  document.body.appendChild(renderer.domElement);

  // Set resize (reshape) callback
  window.addEventListener('resize', resize);

  // Set up mouse callbacks.
  // Call mousePressed, mouseDragged and mouseReleased functions if defined.
  // Arrange for global mouse variables to be set before calling user callbacks.
  mouseIsPressed = false;
  mouseX = 0;
  mouseY = 0;
  pmouseX = 0;
  pmouseY = 0;
  const setMouse = function() {
    mouseX = event.clientX;
    mouseY = event.clientY;
  };

  renderer.domElement.addEventListener('mousedown', () => {
    setMouse();
    mouseIsPressed = true;
    if (typeof mousePressed !== 'undefined') mousePressed();
  });

  renderer.domElement.addEventListener('mousemove', () => {
    pmouseX = mouseX;
    pmouseY = mouseY;
    setMouse();
    if (mouseIsPressed) {
      // if (typeof mouseDragged !== 'undefined') mouseDragged();
    }
    // if (typeof mouseMoved !== 'undefined') mouseMoved();
  });

  renderer.domElement.addEventListener('mouseup', () => {
    mouseIsPressed = false;
    if (typeof mouseReleased !== 'undefined') mouseReleased();
  });

  // If a setup function is defined, call it
  if (typeof setup !== 'undefined') setup();

  // First render
  render();
}

//
// Reshape callback
//
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.right = width;
  camera.bottom = height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  render();
}

//
// The render callback
//
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

//------------------------------------------------------------
//
// User code from here on
//
//------------------------------------------------------------

let material; // A line material
let selected; // Object that was picked

function setup() {
  // console.log("%csetup", "color: deeppink");
  material = new THREE.LineBasicMaterial({ color: 0xffffff, depthWrite: false, linewidth: 4 });
}

function mousePressed() {
  // console.log("%cmousePressed", "color: #ccff00;");
  const point = new THREE.Vector3(mouseX, mouseY, 0);
  // const geometry = new THREE.Geometry();
  // geometry.vertices.push(point);
  let points = [];
  points.push(point);
  // points.push(new THREE.Vector3(0, 10, 0));
  // points.push(new THREE.Vector3(10, 0, 0));

  let geometry = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.Line(geometry, material);
  // console.log("line", line);
  scene.add(line);
  selected = line;
}

function mouseDragged() {
  console.log("%cmouseDragged", "color: #ccff00;");
  const line = selected;
  const point = new THREE.Vector3(mouseX, mouseY, 0);
  const oldgeometry = line.geometry;

  // const newgeometry = new THREE.Geometry();
  // newgeometry.vertices = oldgeometry.vertices;
  // newgeometry.vertices.push(point);

  let newgeometry = new THREE.BufferGeometry();

  let positions = oldgeometry.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    const v = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    positions[i] = v.x;
    positions[i + 1] = v.y;
    positions[i + 2] = v.z;
  }
  positions.push(point);
  newgeometry.attributes.position.needsUpdate = true;

  line.geometry = newgeometry;

  scene.add(line);
  selected = line;
}

function mouseReleased() {
  // console.log("%cmouseReleased", "color: #ccff00;");
}

init();
