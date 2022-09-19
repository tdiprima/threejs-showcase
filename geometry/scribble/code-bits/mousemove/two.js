function onPointerMove(event) {
  coords.x = (event.clientX / window.innerWidth) * 2 - 1;
  coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
  coords.z = (camera.near + camera.far) / (camera.near - camera.far);

  coords.unproject(camera);

  updatePoint(coords.x, coords.y, 0);

  render();
}
