import * as THREE from 'three';

function Square(x, y, w, h, texture) {
  const square = new THREE.Shape();
  square.moveTo(0, 0);
  square.lineTo(0, 1);
  square.lineTo(1, 1);
  square.lineTo(1, 0);
  const geometry = new THREE.ShapeGeometry(square);
  geometry.center();
  const material = new THREE.MeshBasicMaterial({map: texture, depthWrite: false, side: THREE.DoubleSide});
  const X = new THREE.Mesh(geometry, material);
  X.scale.set(w, h, 1);
  X.position.set(x, y, 0);
  X.frustumCulled = false;
  return X;
}

function CreateImageViewer(scene, x, y, w, h, imageURL) {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(imageURL, function(texture) {
    const square = Square(x, y, w, h, texture);
    square.name = "Square";
    scene.add(square);
  });
}

export {Square, CreateImageViewer};
