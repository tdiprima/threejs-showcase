import * as THREE from "/build/three.module.js";

export function hollowBrush(scene, camera, renderer, controls) {
  // let brushButton = createButton({
  //   id: "ellipse",
  //   innerHtml: "<i class=\"fa-regular fa-circle\"></i>",
  //   title: "ellipse"
  // });

  let isDrawing = false; // Flag to check if drawing is active
  let mouseIsPressed = false;
  let brushButton = document.getElementById('imageButton');

  brushButton.addEventListener("click", function () {
    if (isDrawing) {
      isDrawing = false;
      // controls.enabled = true;
      // this.classList.replace('btnOn', 'annotationBtn');
    } else {
      isDrawing = true;
      // controls.enabled = false;
      // this.classList.replace('annotationBtn', 'btnOn');
    }
    this.classList.toggle('brushDark');
  });

  let points = []; // Array to store the points of the line
  let raycaster = new THREE.Raycaster();

  // Function to convert mouse coordinates to Three.js coordinates using raycasting
  function getMousePosition(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const mouse = new THREE.Vector2(mouseX, mouseY);
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object instanceof THREE.Mesh) {
        return intersects[i].point;
      }
    }
    return null;
  }

  // Function to start drawing
  function onMouseDown(event) {
    if (isDrawing) {
      mouseIsPressed = true;
      points = [];
      const mousePos = getMousePosition(event);
      if (mousePos === null) return;
      points.push(new THREE.Vector3(mousePos.x, mousePos.y, 0)); // Start point
    }
  }

  // Function to update the line while drawing
  function onMouseMove(event) {
    if (isDrawing && mouseIsPressed) {
      const mousePos = getMousePosition(event);
      if (mousePos === null) return;
      points.push(new THREE.Vector3(mousePos.x, mousePos.y, 0)); // Add new point
      updateLineLoop();
    }
  }

  // Function to stop drawing
  function onMouseUp() {
    if (isDrawing) {
      mouseIsPressed = false;
    }
  }

  // Function to update or create the line loop
  function updateLineLoop() {
    if (lineLoop) scene.remove(lineLoop); // Remove old line loop if it exists
    const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
    // lineLoop = new THREE.LineLoop(lineGeom, new THREE.LineBasicMaterial({ color: "#82a9c4" }));
    lineLoop = new THREE.LineLoop(lineGeom, new THREE.LineBasicMaterial({ color: 0x0000ff }));
    scene.add(lineLoop);
  }

  let lineLoop; // Global variable to store the line loop

  // Add event listeners for mouse events
  renderer.domElement.addEventListener('mousedown', onMouseDown);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}
