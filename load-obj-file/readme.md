# Here's your blender tutorial 😛

# [Three.js Loading a .OBJ File](https://r105.threejsfundamentals.org/threejs/lessons/threejs-load-obj.html)

One of the most common things people want to do with three.js is to load and display 3D models. A common format is the .OBJ 3D format, so let's try loading one.

I started with the directional lighting example from **[the lights article](https://r105.threejsfundamentals.org/threejs/lessons/threejs-lights.html)** and I combined it with the hemispherical lighting example.

[HemisphereLight](https://threejs.org/docs/#api/en/lights/HemisphereLight)

[DirectionalLight](https://threejs.org/docs/#api/en/lights/DirectionalLight)

Removed the [sphere and cube](https://r105.threejsfundamentals.org/threejs/threejs-lights-ambient.html) being added to the scene.

From that the first thing we need to do is include the [OBJLoader2](https://threejs.org/docs/#examples/loaders/OBJLoader2) loader in our scene. The OBJLoader2 also needs the [LoaderSupport.js](https://threejs.org/docs/#examples/loaders/LoaderSupport.js) file so let's add both.

We need the material on the blades to be double sided, something we went over in [the article on materials](https://r105.threejsfundamentals.org/threejs/lessons/threejs-materials.html).

## [Example of loading a Three JS object with OBJLoader as well as MTLLoader to attach the MTL file](https://observablehq.com/@hellonearthis/this-is-an-example-of-loading-a-three-js-object-with-objloade)
