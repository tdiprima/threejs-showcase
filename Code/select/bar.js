import * as THREE from "three";
import { TransformControls } from "/jsm/controls/TransformControls.js";

export function bar(scene, camera, renderer) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const controls = new TransformControls(camera, renderer.domElement);
  console.log("controls", controls);
  scene.add(controls);

  // Enhanced function to handle mesh deletion
  function setupDeletionButton(mesh) {
    const button = document.createElement('button');
    button.textContent = 'Delete';
    document.body.appendChild(button);
    button.style.position = 'absolute';
    button.style.zIndex = '1';

    const vector = new THREE.Vector3();
    mesh.getWorldPosition(vector);
    vector.project(camera);

    const x = (vector.x *  .5 + .5) * renderer.domElement.clientWidth;
    const y = (vector.y * -.5 + .5) * renderer.domElement.clientHeight;

    button.style.left = `${x}px`;
    button.style.top = `${y}px`;

    // Delete mesh and remove button on click
    button.addEventListener('click', () => {
      controls.detach(); // Detach controls if attached
      scene.remove(mesh); // Remove mesh from scene
      renderer.render(scene, camera); // Re-render the scene
      document.body.removeChild(button); // Remove the button
    });
  }

  function onMouseClick(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    // if (intersects.length > 0) {
    //   const selectedMesh = intersects[0].object;
    //   console.log("selectedMesh", selectedMesh);
    //
    //   // Setup deletion button
    //   setupDeletionButton(selectedMesh);
    //
    //   // Attach transform controls to the selected object
    //   controls.attach(selectedMesh);
    // }

    for (let i = 0; i < intersects.length; i++) {
      const intersect = intersects[i];
      // Filter out objects that are part of TransformControls or not your target
      if (intersect.object.name !== 'Z' && intersect.object !== controls.object) {
        // Found a valid mesh that's not part of the controls
        const selectedMesh = intersect.object;
        console.log("selectedMesh", selectedMesh);

        // Setup deletion button
        setupDeletionButton(selectedMesh);

        // Attach transform controls to the selected object
        controls.attach(selectedMesh);
        break; // Stop the loop once the first valid mesh is found and processed
      }
    }
  }

  renderer.domElement.addEventListener('click', onMouseClick, false);
}
