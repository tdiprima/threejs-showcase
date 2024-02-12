import * as THREE from "three";
import { DragControls } from "/jsm/controls/DragControls.js";

export function baz(scene, camera, renderer) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const intersectableObjects = [];

  function removal(mesh) {
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      // If the material is an array (multi-materials), dispose each one
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(material => material.dispose());
      } else {
        mesh.material.dispose();
      }
    }

    // Remove the mesh from the scene
    scene.remove(mesh);

    // Find the index of the mesh in the array
    const index = intersectableObjects.findIndex(object => object === mesh);

    // If the mesh is found, remove it from the array
    if (index > -1) {
      intersectableObjects.splice(index, 1);
    }
  }

  // Enhanced function to handle mesh deletion
  function setupDeletionButton(mesh, handles) {
    // Assuming mesh, camera, and renderer are already defined
    const vertex = new THREE.Vector3();
    // Extract the first vertex position from the geometry
    vertex.fromBufferAttribute(mesh.geometry.attributes.position, 0); // For the first vertex

    // Convert the vertex position to world space
    vertex.applyMatrix4(mesh.matrixWorld);

    // Project this world space position to normalized device coordinates (NDC)
    vertex.project(camera);

    // Convert NDC to screen space
    const xOffset = 10; // 10 pixels right
    const yOffset = -10; // 10 pixels up (screen coordinates are y-down)
    const x = (vertex.x *  .5 + .5) * renderer.domElement.clientWidth + xOffset;
    const y = (vertex.y * -.5 + .5) * renderer.domElement.clientHeight + yOffset;

    // Create and position the button
    const button = document.createElement('div');
    button.innerHTML = '<i class="fa fa-trash"></i>';
    document.body.appendChild(button);
    button.style.position = 'absolute';
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.style.transform = 'translate(-50%, -50%)'; // Center the button over the vertex

    // Add event listener for the button
    button.addEventListener('click', () => {
      removal(mesh);
      handles.forEach(function (element) {
        removal(element);
      });

      // Remove the div from the DOM
      document.body.removeChild(button);
    });
  }

  scene.traverse((object) => {
    // Check if the object's name contains "annotation"
    if (object.name.includes("annotation")) {
      intersectableObjects.push(object);
    }
  });

  function onMouseClick(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(intersectableObjects, true);

    if (intersects.length > 0) {
      const selectedMesh = intersects[0].object;
      console.log("selectedMesh", selectedMesh);

      // Setup deletion button & edit handles
      setupDeletionButton(selectedMesh, addEditHandles(selectedMesh));
    }
  }

  renderer.domElement.addEventListener('click', onMouseClick, false);

  function addEditHandles(mesh) {
    let vertices = mesh.geometry.attributes.position.array;

    // Create handles for each vertex
    const handles = [];
    for (let i = 0; i < vertices.length; i += 3) {
      const handleGeometry = new THREE.SphereGeometry(0.1);
      const handleMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
      const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
      handleMesh.position.fromArray(vertices.slice(i, i + 3));
      handles.push(handleMesh);
      // console.log(i, i + 3, vertices.slice(i, i + 3));
    }

    // Add handles to the scene
    handles.forEach(element => scene.add(element));

    // Create DragControls
    const dragControls = new DragControls(handles, camera, renderer.domElement);

    dragControls.addEventListener("dragstart", function (event) {
      // Set color of handle when dragging starts
      event.object.material.color.set(0x00ffff);
    });

    dragControls.addEventListener("dragend", function (event) {
      // Set color of handle when dragging ends
      event.object.material.color.set(0x0000ff);
    });

    dragControls.addEventListener("drag", function (event) {
      const position = event.object.position;
      const index = handles.indexOf(event.object);

      // When a handle is dragged, update the position of the corresponding vertex in the buffer attribute
      mesh.geometry.attributes.position.setXYZ(index, position.x, position.y, position.z);

      // Notify Three.js to update the geometry
      mesh.geometry.attributes.position.needsUpdate = true;
    });

    return handles;
  }
}
