# Space 🛸👾

In three.js there are only the terms local and world space.

Object space is used as a synonym for local space.

World space is the coordinate system for the entire scene.
#
One way to understand local space is to imagine an object sitting within a box.

All of the points on the object's surface are then given with respect to one corner of the box.

If you pick up the entire box and move it around the room,
the coordinates of the object &ndash; with respect to the box &ndash; do not change:

the coordinates of the box with respect to the room are changing.

Focus on the two different descriptions:

the object with respect to the box (the object's position in local space),

and the box with respect to the room (the position of the object in world space).

# Geometry attr position

```c
array: Float32Array(3000) [ 0, 0, 0, ... ]

count: 1000

isBufferAttribute: true

itemSize: 3

name: "Lulu"

normalized: false

updateRange: Object { offset: 0, count: -1 }

usage: 35048

version: 2
```

```js
// Set name
line.geometry.name = "Deedee";
line.geometry.getAttribute("position").name = "Lulu";
```

# Convert coordinates

```js
// Convert the mouse coordinates
// (which go from 0 to containerWidth, and from 0 to containerHeight)
// to (-1, 1) in both axes.
coords.x = (event.clientX / window.innerWidth) * 2 - 1;
coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
```

# Buffer Geometry

**"Square"**

```json
{
  "metadata": {
    "version": 4.5,
    "type": "BufferGeometry",
    "generator": "BufferGeometry.toJSON"
  },
  "uuid": "17d69f73-b9db-45e0-90c9-755f941df660",
  "type": "BufferGeometry",
  "data": {
    "attributes": {
      "position": {
        "itemSize": 3,
        "type": "Float32Array",
        "array": [
          -1, -1, 1,
           1, -1, 1,
           1,  1, 1,

           1,  1, 1,
          -1,  1, 1,
          -1, -1, 1
        ],
        "normalized": false
      }
    },
    "boundingSphere": {
      "center": [
        0, 0, 1
      ],
      "radius": 1.4142135623730951
    }
  }
}
```

# Scribble

The code from [the resource](https://github.com/esperanc/scribble/blob/master/main.js) is highly inefficient; since you continuously allocate geometry all the time, without disposal management, which will lead to a memory leak.

Try the following approach:

The idea is to allocate a single large buffer to store all current and future points of a line. You then use `setDrawRange()` to define, what parts of the buffer should be rendered.

You can set `frustumSize` to whatever value you need. It just defines the size of the orthographic projection. The `frustumSize * aspect / -2` stuff just computes the side planes of the view frustum. You have to honor the desired size as well as the aspect ratio.

Might be helpful:

[Orthogonal camera for 2D drawing](https://stackoverflow.com/questions/17558085/three-js-orthographic-camera)

`webgl_camera.html`

[animation-loop.js](https://github.com/looeee/discoverthreejs-site/blob/main/static/examples/worlds/inline-scenes/first-steps/animation-loop.js)

[animation-loop tutorial](https://discoverthreejs.com/book/first-steps/animation-loop/)

<!-- https://discoverthreejs.com/book/first-steps/animation-system/ -->

```js
// Camera that uses perspective projection.
camera = new THREE.PerspectiveCamera( 45, aspect, 1, 1000 );
```

```js
// set the aspect ratio to match the new browser window aspect ratio
camera.aspect = container.clientWidth / container.clientHeight;
```
