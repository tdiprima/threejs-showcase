//
// https://github.com/esperanc/scribble/blob/master/main.js
//

// Global variables
let scene;
let width;
let height;
let camera;
let renderer;
let mouseIsPressed;
let mouseX;
let mouseY;
let pmouseX;
let pmouseY;

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
    if (typeof mousePressed !== 'undefined') {
      mousePressed();
    }
  });

  renderer.domElement.addEventListener('mousemove', () => {
    pmouseX = mouseX;
    pmouseY = mouseY;
    setMouse();

    if (mouseIsPressed) {
      if (typeof mouseDragged !== 'undefined') {
        mouseDragged();
      }
    }

    if (typeof mouseMoved !== 'undefined') {
      mouseMoved();
    }
  });

  renderer.domElement.addEventListener('mouseup', () => {
    mouseIsPressed = false;
    if (typeof mouseReleased !== 'undefined') {
      mouseReleased();
    }
  });

  // If a setup function is defined, call it
  if (typeof setup !== 'undefined') {
    setup();
  }

  // First render
  render();
}

//
// Resize callback
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
  material = new THREE.LineBasicMaterial({ color: 0xffffff, depthWrite: false, linewidth: 4 });
}

function mousePressed() {
  let point = new THREE.Vector3(mouseX, mouseY, 0);
  let geometry = new THREE.Geometry();
  geometry.vertices.push(point);

  let line = new THREE.Line(geometry, material);
  scene.add(line);
  selected = line;
}

function mouseDragged() {
  let line = selected;
  let point = new THREE.Vector3(mouseX, mouseY, 0);

  let oldGeometry = line.geometry;
  let newGeometry = new THREE.Geometry();

  newGeometry.vertices = oldGeometry.vertices;
  newGeometry.vertices.push(point);
  line.geometry = newGeometry;
}

function mouseReleased() {}

init();
