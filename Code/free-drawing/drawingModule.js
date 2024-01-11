// drawingModule.js
import * as THREE from 'three';

export function enableDrawing(scene, camera, renderer, controls) {
  // Add drawing functionality
  // This might include event listeners for mouse interactions
  // and functions to update the scene based on user input
  // let btnDraw = document.getElementById("toggleButton");
  let btnDraw = document.createElement("button");
  btnDraw.id = "toggleButton";
  btnDraw.innerHTML = "drawing toggle";
  let canvas = document.querySelector('canvas');
  document.body.insertBefore(btnDraw, canvas);

  let isDrawing = false;
  let mouseIsPressed = false;
  let color = "#0000ff";

  btnDraw.addEventListener("click", function () {
    if (isDrawing) {
      isDrawing = false;
      controls.enabled = true;

      // Remove the mouse event listeners
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
    } else {
      // Drawing on
      isDrawing = true;
      controls.enabled = false;

      // Set up the mouse event listeners
      renderer.domElement.addEventListener("mousemove", onMouseMove);
      renderer.domElement.addEventListener("mouseup", onMouseUp);
    }
  });

  // Set up geometry to raycast against
  let aspectRatio = 1024 / 768;
  let planeWidth = 10;
  let planeHeight = planeWidth / aspectRatio;

  let planeGeom = new THREE.PlaneGeometry(planeWidth, planeHeight);
  let texture = new THREE.TextureLoader().load("/images/image1.jpg");
  let planeMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  let plane = new THREE.Mesh(planeGeom, planeMat);
  scene.add(plane);

  // Set up the raycaster and mouse vector
  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();

  let lineMaterial = new THREE.LineBasicMaterial({color});

  // Dashed Line Issue Solution
  lineMaterial.polygonOffset = true; // Prevent z-fighting (which causes flicker)
  lineMaterial.polygonOffsetFactor = -1; // Push the polygon further away from the camera
  lineMaterial.depthTest = false;  // Render on top
  lineMaterial.depthWrite = false; // Object won't be occluded
  lineMaterial.transparent = true; // Material transparent
  lineMaterial.alphaTest = 0.5;    // Pixels with less than 50% opacity will not be rendered

  let line;
  let currentPolygonPositions = []; // Store positions for current polygon
  let polygonPositions = []; // Store positions for each polygon
  const distanceThreshold = 0.1;
  let objects = [];

  renderer.domElement.addEventListener('pointerdown', event => {
    if (isDrawing) {
      mouseIsPressed = true;

      // Build the objects array
      objects.push(plane);

      // Create a new BufferAttribute for each line
      line = new THREE.Line(new THREE.BufferGeometry(), lineMaterial);
      scene.add(line);

      currentPolygonPositions = []; // Start a new array for the current polygon's positions
    }
  });

  function onMouseMove(event) {
    if (isDrawing && mouseIsPressed) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // TESTING DIFFERENT INTERSECT OBJECTS
      // let intersects = raycaster.intersectObjects(scene.children, true);
      let intersects = raycaster.intersectObjects(objects, true);

      if (intersects.length > 0) {
        console.log('Intersected!');
        let point = intersects[0].point;

        // Check if it's the first vertex of the current polygon
        const isFirstVertex = currentPolygonPositions.length === 0;

        if (isFirstVertex) {
          currentPolygonPositions.push(point.x, point.y, point.z);
        } else {
          // DISTANCE CHECK
          const lastVertex = new THREE.Vector3().fromArray(currentPolygonPositions.slice(-3));
          const currentVertex = new THREE.Vector3(point.x, point.y, point.z);
          const distance = lastVertex.distanceTo(currentVertex);

          if (distance > distanceThreshold) {
            currentPolygonPositions.push(point.x, point.y, point.z); // Store the position in the current polygon's array
            line.geometry.setAttribute("position", new THREE.Float32BufferAttribute(currentPolygonPositions, 3)); // Use the current polygon's array for the line's position attribute
          }
        }

        if (line.geometry.attributes.position) {
          line.geometry.attributes.position.needsUpdate = true;
        }
      } else {
        console.log("Raycasting didn't work.");
      }
    }
  }

  function decimate(line) {
    if (line.geometry.attributes.position) {
      let originalArray = line.geometry.attributes.position.array;
      let decimatedArray = [];

      for (let i = 0; i < originalArray.length; i += 9) {
        decimatedArray.push(originalArray[i], originalArray[i + 1], originalArray[i + 2]);
      }
      console.log("Position array lengths:\nOriginal:", polygonPositions, "\nDecimated:", decimatedArray);
    }
  }

  function onMouseUp() {
    if (isDrawing) {
      mouseIsPressed = false;

      // Draw the final line
      line.geometry.setDrawRange(0, currentPolygonPositions.length / 3);
      line.geometry.computeBoundingSphere();

      polygonPositions.push(currentPolygonPositions); // Store the current polygon's positions in the polygonPositions array
      currentPolygonPositions = []; // Clear the current polygon's array

      // decimate(line);
    }
  }

  // Return any necessary objects or functions for further use
}
