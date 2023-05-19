# GPU Computation Renderer

The shader sign guy was gonna use `GPUComputationRenderer`, so I wanted to see what it's about.

How do I know:

```js
import { GPUComputationRenderer } from "https://cdn.rawgit.com/mrdoob/three.js/r124/examples/jsm/misc/GPUComputationRenderer.js";

// bNormalize, pointNb, size, aoeRatio, pointSize, speed, color, _colorA, vertex shader, fragment shader
skyParticles = initGpuParticlesSky(1, 500 * 1000, SKY_SIZE, 1, 1, 0.02, new THREE.Color(0.3, 0.5, 0.9), {
  r: 1,
  g: 0,
  b: 0
}, vShaderSky, fShaderSky);

// He removed the initialization of "gpuCompute"
gpuCompute.compute();
```

**[See it in action](https://threejs.org/examples/?q=gpgpu)**

[IDK why this didn't work](https://threejs.org/examples/webgpu_compute.html)

[This **repo** is a lot of fun to play with](https://github.com/yomboprime/GPGPU-threejs-demos)

[Get started with GPU Compute](https://web.dev/gpu-comp)

**[How to use three.js for GPGPU?](https://discourse.threejs.org/t/how-to-use-three-js-for-gpgpu/2388)**

[fluid dynamics simulation based on the classic GPU Gems chapter](https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu)
