import * as THREE from "three";
import { TransformControls } from "/jsm/controls/TransformControls.js";

export function foo(scene, camera, renderer) {
  // Raycaster setup
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // TransformControls
  const controls = new TransformControls(camera, renderer.domElement);
  scene.add(controls);

  // Function to add a button near the mesh
  function addButtonNearMesh(mesh) {
    const button = document.createElement('button');
    button.innerText = 'Delete Mesh';
    button.style.position = 'absolute';
    // Convert mesh position to screen coordinates here
    const vector = new THREE.Vector3();
    mesh.getWorldPosition(vector);
    vector.project(camera);
    vector.x = Math.round((0.5 + vector.x / 2) * (window.innerWidth / window.devicePixelRatio));
    vector.y = Math.round((0.5 - vector.y / 2) * (window.innerHeight / window.devicePixelRatio));

    button.style.left = `${vector.x}px`;
    button.style.top = `${vector.y}px`;

    button.onclick = function() {
      scene.remove(mesh);
      document.body.removeChild(button); // Remove the button after deletion
    };

    document.body.appendChild(button);
  }

  function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const selectedMesh = intersects[0].object;

      // Add button for deletion
      addButtonNearMesh(selectedMesh);

      // Attach transform controls to the selected mesh
      controls.attach(selectedMesh);
    }
  }

  renderer.domElement.addEventListener('click', onMouseClick, false);
}
