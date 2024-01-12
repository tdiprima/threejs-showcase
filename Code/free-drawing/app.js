// app.js
import { createScene } from './sceneModule.js';
import { CreateImageViewer } from './squareModule.js';
// import { addPlane } from './planeModule.js';
import { enableDrawing } from './drawingModule.js';

// Create the scene
const { scene, camera, renderer, controls } = createScene();

// Create square with image
CreateImageViewer(scene, 0, 0, 10, 7.5, "/images/image2.jpg");

// Add plane
// addPlane(scene, camera, renderer);

// Enable drawing on the scene
enableDrawing(scene, camera, renderer, controls);

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});
