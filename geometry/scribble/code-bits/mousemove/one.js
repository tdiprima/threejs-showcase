renderer.domElement.addEventListener('mousemove', () => {
  pmouseX = mouseX;
  pmouseY = mouseY;
  mouseX = event.clientX;
  mouseY = event.clientY;
  if (mouseIsPressed) {
    // if (typeof mouseDragged !== 'undefined') mouseDragged();
  }
  // if (typeof mouseMoved !== 'undefined') mouseMoved();
});
