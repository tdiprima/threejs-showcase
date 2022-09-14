/**
 * Global variables
 */
let scene, width, height, camera, renderer;

let mouseIsPressed, mouseX, mouseY, pmouseX, pmouseY;

/**
 * Initialization of global objects and set up callbacks for mouse and resize
 */
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

  /**
   * Set up mouse callbacks.
   * Call mousePressed, mouseDragged and mouseReleased functions if defined.
   * Arrange for global mouse variables to be set before calling user callbacks.
   * @type {boolean}
   */
  mouseIsPressed = false;
  mouseX = 0;
  mouseY = 0;
  pmouseX = 0; // TODO: set but not used?
  pmouseY = 0;

  /**
   * setMouse
   */
  const setMouse = function() {
    mouseX = event.clientX;
    mouseY = event.clientY;
  };

  /**
   * mousedown
   */
  renderer.domElement.addEventListener('mousedown', () => {
    setMouse();
    // console.log("%cmousedown", "color: lime", mouseX, mouseY);
    mouseIsPressed = true;
    if (typeof mousePressed !== 'undefined') mousePressed();
  });

  /**
   * mousemove
   */
  renderer.domElement.addEventListener('mousemove', () => {
    pmouseX = mouseX;
    pmouseY = mouseY;
    setMouse();
    // console.log("%cmousemove", "color: deeppink", mouseX, mouseY);
    if (mouseIsPressed) {
      if (typeof mouseDragged !== 'undefined') mouseDragged();
    }
    // TODO: if (typeof mouseMoved !== 'undefined') mouseMoved();
  });

  /**
   * mouseup
   */
  renderer.domElement.addEventListener('mouseup', () => {
    // console.log("%cmouseup", "color: yellow", mouseX, mouseY);
    // TODO: no care x,y on mouseup?
    mouseIsPressed = false;
    if (typeof mouseReleased !== 'undefined') mouseReleased();
  });

  // If a setup function is defined, call it
  if (typeof setup !== 'undefined') setup();

  // First render
  render();
}

/**
 * Reshape (resize) callback
 */
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.right = width;
  camera.bottom = height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  render();
}

/**
 * The render callback
 */
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

/**
 * setup
 */
function setup() {
  material = new THREE.LineBasicMaterial({ color: 0xffffff, depthWrite: false, linewidth: 4 });
}

/**
 * mousePressed
 */
function mousePressed() {
  const point = new THREE.Vector3(mouseX, mouseY, 0);
  let points = [];
  points.push(point);

  // just testing to see if the darn thing works at all
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));

  let geometry = new THREE.BufferGeometry().setFromPoints( points );
  let line = new THREE.Line(geometry, material);
  // console.log("line", line);

  scene.add(line);
  selected = line;
}

/**
 * mouseDragged
 */
function mouseDragged() {
  const line = selected;

  const point = new THREE.Vector3(mouseX, mouseY, 0);
  let points = [];
  points.push(point);

  const oldgeometry = line.geometry;

  // console.log("%coldgeometry", "color: #ccff00;", oldgeometry.type);
  // console.log("%coldgeometry", "color: #ccff00;", oldgeometry.attributes.position.array);
  // console.log("%coldgeometry", "color: #ccff00;", JSON.stringify(oldgeometry));

  let positions = oldgeometry.attributes.position.array; // 3 vertices per point
  // let newgeometry = new THREE.BufferGeometry().setFromPoints( points );
  let newgeometry = new THREE.BufferGeometry();
  newgeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  newgeometry.attributes.position.needsUpdate = true;

  line.geometry = newgeometry;
}

/**
 * IDK :/
 */
function mouseDragged2() {
  const line = selected;

  const point = new THREE.Vector3(mouseX, mouseY, 0);
  let points = [];
  points.push(point);

  const oldgeometry = line.geometry;

  let positions = oldgeometry.attributes.position.array; // 3 vertices per point
  let newgeometry = new THREE.BufferGeometry();

  for (let i = 0; i < positions.length; i += 3) {
    const v = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    positions[i] = v.x;
    positions[i + 1] = v.y;
    positions[i + 2] = v.z;
  }
  positions.push(point);
  newgeometry.attributes.position.needsUpdate = true;

  line.geometry = newgeometry;

  // scene.add(line);
  // selected = line;
}

function mouseReleased() {
  // console.log("%cmouseReleased", "color: #ccff00;");
}

init();
