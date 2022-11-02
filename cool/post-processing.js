console.log(`%cREV: ${THREE.REVISION}`, "color: #997fff;"); // Medium slate blue

function main() {
  let canvas = document.querySelector('#c');
  let renderer = new THREE.WebGLRenderer({ canvas });

  let camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);
  camera.position.z = 2;

  let scene = new THREE.Scene();

  {
    let color = 0xffffff;
    let intensity = 2;
    let light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  let boxWidth = 1;
  let boxHeight = 1;
  let boxDepth = 1;
  let geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, x) {
    let material = new THREE.MeshPhongMaterial({ color });

    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  // Aqua, Purple, and Gold
  // let cubes = [
  //   makeInstance(geometry, 0x00ffff, 0),
  //   makeInstance(geometry, 0xa020f0, -2),
  //   makeInstance(geometry, 0xffd700, 2)
  // ];

  let cubes = [
    makeInstance(geometry, "#fcff00", 0),
    makeInstance(geometry, "#ff0000", -2),
    makeInstance(geometry, "#00c6ff", 2) // Deep sky blue
  ];

  let composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));

  let bloomPass = new THREE.BloomPass(
    1, // strength
    25, // kernel size
    4, // sigma
    256 // blur render target resolution
  );
  composer.addPass(bloomPass);

  let filmPass = new THREE.FilmPass(
    0.35, // noise intensity
    0.025, // scanline intensity
    648, // scanline count
    false // grayscale
  );

  filmPass.renderToScreen = true;
  composer.addPass(filmPass);

  function resizeRendererToDisplaySize(renderer) {
    let canvas = renderer.domElement;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  let then = 0;
  function render(now) {
    now *= 0.001; // convert to seconds
    let deltaTime = now - then;
    then = now;

    if (resizeRendererToDisplaySize(renderer)) {
      let canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      composer.setSize(canvas.width, canvas.height);
    }

    cubes.forEach((cube, ndx) => {
      let speed = 1 + ndx * 0.1;
      let rot = now * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    composer.render(deltaTime);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
