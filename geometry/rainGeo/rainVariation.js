let rain = new THREE.Points();
let vertex = new THREE.Vector3();

function rainVariation() {
  const positionAttribute = rain.geometry.getAttribute("position");

  for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i);

    vertex.y -= 1;

    if (vertex.y < -60) {
      vertex.y = 90;
    }

    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  positionAttribute.needsUpdate = true;
}

// CALL RAIN VARIATION
function animate() {
  requestAnimationFrame(animate);
  rainVariation();
  renderer.render(scene, camera);
}

animate();
