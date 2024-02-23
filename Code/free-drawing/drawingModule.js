// drawingModule.js
import * as THREE from 'three';
import { objectProperties } from './dumpObject.js';

export function enableDrawing(scene, camera, renderer, controls) {
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

  // TODO: COMMENT OUT IF USING OTHER MODULES
  // Set up geometry to raycast against
  let imageSize = { width: 1024, height: 794 };
  let aspectRatio = imageSize.width / imageSize.height;
  let planeWidth = 10; // You can adjust this value as needed
  let planeHeight = planeWidth / aspectRatio;

  let planeGeom = new THREE.PlaneGeometry(planeWidth, planeHeight);
  let texture = new THREE.TextureLoader().load("/images/image1.jpg");
  let planeMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  let plane = new THREE.Mesh(planeGeom, planeMat);
  plane.name = "plane";
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
      objects = [];
      scene.traverse(function (object) {
        if (object instanceof THREE.Mesh && object.visible) {
          objects.push(object);
        }
      });

      console.log("Objects:", objects);
      objectProperties(objects);

      // Create a new BufferAttribute for each line
      line = new THREE.Line(new THREE.BufferGeometry(), lineMaterial);
      scene.add(line);

      currentPolygonPositions = []; // Start a new array for the current polygon's positions
    }
  });

  function onMouseMove(event) {
    if (isDrawing && mouseIsPressed) {
      // Get the bounding rectangle of the renderer's DOM element
      const rect = renderer.domElement.getBoundingClientRect();

      // Adjust the mouse coordinates
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

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

  // TEST CONVERSION
  function convertToImageCoordinates(worldCoordinates, planeWidth, planeHeight, imageWidth, imageHeight) {
    // Normalize the 3D coordinates to the plane's scale
    const normalizedX = (worldCoordinates.x / planeWidth) + 0.5; // Assuming plane is centered
    const normalizedY = (worldCoordinates.y / planeHeight) + 0.5; // Assuming plane is centered

    // Convert to image coordinates
    const imageX = Math.round(normalizedX * imageWidth);
    const imageY = Math.round((1 - normalizedY) * imageHeight); // Flip Y-axis

    return { x: imageX, y: imageY };
  }

  function logImageCoords(polygonPositions, imageWidth, imageHeight) {
    // Convert and log image coordinates
    const imageCoordinates = polygonPositions.map(pos => {
      const worldPoint = new THREE.Vector3(pos[0], pos[1], pos[2]);
      return convertToImageCoordinates(worldPoint, planeGeom.parameters.width, planeGeom.parameters.height, imageWidth, imageHeight);
    });

    console.log("Image Coordinates: ", imageCoordinates);
  }

  function onMouseUp() {
    if (isDrawing && mouseIsPressed) {
      mouseIsPressed = false;

      // Ensure there are at least 3 points to form a closed polygon
      if (currentPolygonPositions.length >= 9) { // 3 points * 3 coordinates (x, y, z)
        // Close the polygon by adding the first point to the end
        const firstPoint = currentPolygonPositions.slice(0, 3);
        currentPolygonPositions.push(...firstPoint);

        // Create a new geometry with the closed polygon positions
        const closedPolygonGeometry = new THREE.BufferGeometry();
        closedPolygonGeometry.setAttribute('position', new THREE.Float32BufferAttribute(currentPolygonPositions, 3));
        line.geometry = closedPolygonGeometry;
        line.geometry.setDrawRange(0, currentPolygonPositions.length / 3);
        line.geometry.computeBoundingSphere();
      }

      polygonPositions.push(currentPolygonPositions); // Store the current polygon's positions
      currentPolygonPositions = []; // Clear the current polygon's array for the next drawing

      console.log("polygonPositions:", polygonPositions);

      // decimate(line);
      logImageCoords(polygonPositions, imageSize.width, imageSize.height);
    }
  }

}
