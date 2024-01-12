// app.js
import { createScene } from './sceneModule.js';
// import { enableDrawing } from './drawingModule.js';
// import { enableDrawing } from './planeModule.js';
import { CreateImageViewer } from './squareModule.js';

// Create the scene
const { scene, camera, renderer, controls } = createScene();

// Enable drawing on the scene
// enableDrawing(scene, camera, renderer, controls);

// Call the function
CreateImageViewer(scene, 0, 0, 10, 10, "/images/image1.jpg");

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
