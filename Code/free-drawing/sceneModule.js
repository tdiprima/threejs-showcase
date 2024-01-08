// sceneModule.js
import * as THREE from 'three';
import { OrbitControls } from "/jsm/controls/OrbitControls.js";

export function createScene() {
  // Initialize scene, camera, and renderer
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  let renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let controls = new OrbitControls(camera, renderer.domElement);
  // Set up scene (add lights, static objects, etc.)
  // let geometry = new THREE.BoxGeometry(1, 1, 1);
  // let material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  // let cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  // Return relevant objects for further manipulation
  return { scene, camera, renderer, controls };
}
