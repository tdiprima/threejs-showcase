import * as THREE from 'three';

export function addSmallCameraView(scene, mainCamera, renderer, controls) {
  // Create a smaller camera that mirrors the main camera
  const smallCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Variables to manage the small camera view state
  let isMinimized = false;
  const defaultSize = { width: window.innerWidth / 3, height: window.innerHeight / 3 }; // Normal size
  const minimizedSize = { width: 50, height: 50 }; // Minimized size

  // Function to get current size based on minimized state
  function getCurrentSize() {
    return isMinimized ? minimizedSize : defaultSize;
  }

  // Function to handle minify/maximize toggle on click
  renderer.domElement.addEventListener('click', (event) => {
    const mouseX = event.clientX;
    const mouseY = window.innerHeight - event.clientY; // Flip Y since canvas Y starts at top

    const { width, height } = getCurrentSize();

    // Check if the click is within the small camera viewport
    if (mouseX < width && mouseY < height) {
      isMinimized = !isMinimized; // Toggle minimized state
    }
  });

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

    // Get current size of the small camera view
    const { width, height } = getCurrentSize();

    // Render small camera view in the lower-left corner
    renderer.setViewport(10, 10, width, height); // Adjusted based on current size
    renderer.setScissor(10, 10, width, height); // Define scissor area for the small view
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
