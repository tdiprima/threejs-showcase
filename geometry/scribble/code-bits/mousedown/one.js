renderer.domElement.addEventListener('mousedown', () => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  mouseIsPressed = true;
  if (typeof mousePressed !== 'undefined') mousePressed();
});
