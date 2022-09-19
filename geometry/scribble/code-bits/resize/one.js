function resize() {

  camera.right = window.innerWidth;
  camera.bottom = window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}
