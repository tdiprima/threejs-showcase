The code from [the resource](https://github.com/esperanc/scribble/blob/master/main.js) is highly inefficient; since you continuously allocate geometry all the time, without disposal management, which will lead to a memory leak.

Try the following approach:

The idea is to allocate a single large buffer to store all current and future points of a line. You then use `setDrawRange()` to define, what parts of the buffer should be rendered.

You can set `frustumSize` to whatever value you need. It just defines the size of the orthographic projection. The `frustumSize * aspect / -2` stuff just computes the side planes of the view frustum. You have to honor the desired size as well as the aspect ratio.

Might be helpful:

[Orthogonal camera for 2D drawing](https://stackoverflow.com/questions/17558085/three-js-orthographic-camera)

`webgl_camera.html`

<!-- discoverthreejs-site/static/examples/worlds/inline-scenes/first-steps/animation-loop.js -->
[animation-loop](https://discoverthreejs.com/static/examples/worlds/inline-scenes/first-steps/animation-loop.js) try to find.

```js
// Camera that uses perspective projection.
camera = new THREE.PerspectiveCamera( 45, aspect, 1, 1000 );
```

```js
// set the aspect ratio to match the new browser window aspect ratio
camera.aspect = container.clientWidth / container.clientHeight;
```
