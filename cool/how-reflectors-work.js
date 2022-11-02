// How to make a mirror in three.js
// https://youtu.be/RGA6a9Y70cQ
import * as THREE from "/build/three.module.js";
import {Reflector} from "/jsm/objects/Reflector.js";

// MIRROR OPTIONS
const mirrorOptions = {
  clipBias: 0.000, // default 0, limits reflection
  textureWidth: window.innerWidth * window.devicePixelRatio, // default 512, scales by pixel ratio of device
  textureHeight: window.innerHeight * window.devicePixelRatio, // default 512
  color: 0x808080, // (Gray); default = 7f7f7f (Gray). You can hardly tell the difference.
  multisample: 4 // default 4; type of anti-aliasing (improve image quality)
}

// MIRROR GEOMETRY
const mirrorGeometry = new THREE.PlaneGeometry(2, 5); // width, height

// NEW INSTANCE OF REFLECTOR CLASS
const mirror = new Reflector(mirrorGeometry, mirrorOptions);

mirror.rotateX(-Math.PI / 2);
mirror.position.set(5, 1, 0);

scene.add(mirror);
