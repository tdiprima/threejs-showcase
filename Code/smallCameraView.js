import * as THREE from 'three';

export function addSmallCameraView(scene, mainCamera, renderer, controls) {
  // Create a smaller camera that mirrors the main camera
  const smallCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Animation loop for rendering both views
  function animate() {
    requestAnimationFrame(animate);

    // Update controls and render the main scene
    controls.update();
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight); // Full-screen viewport
    renderer.setScissorTest(false); // Disable scissor test for main camera
    renderer.render(scene, mainCamera); // Render main camera

    // Synchronize small camera's position and orientation with the main camera
    smallCamera.position.copy(mainCamera.position);
    smallCamera.rotation.copy(mainCamera.rotation);
    smallCamera.updateProjectionMatrix();

    // Render small camera view in the lower-left corner
    const insetWidth = window.innerWidth / 3; // 1/3rd of the screen width
    const insetHeight = window.innerHeight / 3; // 1/3rd of the screen height
    renderer.setViewport(10, 10, insetWidth, insetHeight); // Bottom-left corner
    renderer.setScissor(10, 10, insetWidth, insetHeight); // Define scissor area for the small view
    renderer.setScissorTest(true); // Enable scissor test to limit rendering to the smaller viewport
    renderer.render(scene, smallCamera); // Render small camera
  }
  animate();

  // Adjust both cameras on window resize
  window.addEventListener('resize', () => {
    mainCamera.aspect = window.innerWidth / window.innerHeight;
    mainCamera.updateProjectionMatrix();

    smallCamera.aspect = window.innerWidth / window.innerHeight;
    smallCamera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
