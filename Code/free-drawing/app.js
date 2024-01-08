// app.js
import { createScene } from './sceneModule.js';
import { enableDrawing } from './drawingModule.js';

// Create the scene
const { scene, camera, renderer, controls } = createScene();

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
