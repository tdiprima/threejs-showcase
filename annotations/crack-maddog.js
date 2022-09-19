import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import Stats from "three/examples/jsm/libs/stats.module";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

let annotations = [];
let annotationMarkers = [];

// LEFT LIGHTING
let light = new THREE.DirectionalLight();
light.position.set(-30, 30, 30);

let scene = new THREE.Scene();
scene.add(light);

// LIGHTING
let light2 = new THREE.DirectionalLight();
light2.position.set(30, 30, -30);
scene.add(light2);

// Position camera so we can see the house nicely
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 10;
camera.position.y = 5;
camera.position.z = 8;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LABELS - the numbers inside the circles
let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

// ORBIT CONTROLS - allow the camera to orbit around a target.
let controls = new OrbitControls(camera, renderer.domElement);
controls.dampingFactor = 0.2;
controls.enableDamping = true;
controls.target.set(8, 3, 4);

// RAYCASTING - allows you to create a vector from a 3D point in the scene & detect which objects the vector intersects.
let raycaster = new THREE.Raycaster();
let sceneMeshes = [];

const obj_url = "/extra_html/models/house_water.obj";
const mtl_url = "/extra_html/models/house_water.mtl";
const anno_url = "/data/annotations.json";
const circle_url = "/extra_html/img/circle.png";

// CIRCLE
let circleTexture = new THREE.TextureLoader().load(circle_url);

// MTL = Material Template Library format.
new MTLLoader().load(
  mtl_url,
  materials => {
    materials.preload();
    let progressBar = document.getElementById("progressBar");

    let objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(
      obj_url,
      object => {
        object.scale.set(0.01, 0.01, 0.01);
        scene.add(object);
        sceneMeshes.push(object);

        let annotationsDownload = new XMLHttpRequest();
        annotationsDownload.open("GET", anno_url);

        annotationsDownload.onreadystatechange = function() {
          if (annotationsDownload.readyState === 4) {
            annotations = JSON.parse(annotationsDownload.responseText);
            let annotationsPanel = document.getElementById("annotationsPanel");
            let ul = document.createElement("UL");
            let ulElem = annotationsPanel.appendChild(ul);

            Object.keys(annotations).forEach(a => {
              let li = document.createElement("UL");
              let liElem = ulElem.appendChild(li);
              let button = document.createElement("BUTTON");
              button.innerHTML = `${a} : ${annotations[a].title}`;
              button.className = "annotationButton";
              button.addEventListener("click", () => {
                gotoAnnotation(annotations[a]);
              });
              liElem.appendChild(button);

              let annotationSpriteMaterial = new THREE.SpriteMaterial({
                map: circleTexture,
                depthTest: false,
                depthWrite: false,
                sizeAttenuation: false
              });

              let annotationSprite = new THREE.Sprite(annotationSpriteMaterial);
              annotationSprite.scale.set(0.1, 0.1, 0.1);
              annotationSprite.position.copy(annotations[a].lookAt);
              annotationSprite.userData.id = a;
              scene.add(annotationSprite);
              annotationMarkers.push(annotationSprite);

              let annotationDiv = document.createElement("div");
              annotationDiv.className = "annotationLabel";
              annotationDiv.innerHTML = a;

              let annotationLabel = new CSS2DObject(annotationDiv);
              annotationLabel.position.copy(annotations[a].lookAt);
              scene.add(annotationLabel);

              if (annotations[a].description) {
                let annotationDescriptionDiv = document.createElement("div");
                annotationDescriptionDiv.className = "annotationDescription";
                annotationDescriptionDiv.innerHTML = annotations[a].description;
                annotationDiv.appendChild(annotationDescriptionDiv);
                annotations[a].descriptionDomElement = annotationDescriptionDiv;
              }
            });
            progressBar.style.display = "none";
          }
        };
        annotationsDownload.send();
      },
      xhr => {
        if (xhr.lengthComputable) {
          let percentComplete = (xhr.loaded / xhr.total) * 100;
          // console.log(`%c${percentComplete}`, "color: lime");
          progressBar.value = percentComplete;
          progressBar.style.display = "block";
        }
      },
      error => {
        console.log(`%c${error.message}`, "color: #ff6a5a;");
      }
    );
  },
  xhr => {
    console.log(`%c${(xhr.loaded / xhr.total) * 100}% loaded`, "color: lime");
  },
  error => {
    console.log(`%c${error.message}`, "color: #ff6a5a;");
  }
);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

renderer.domElement.addEventListener("pointerdown", onClick, false);
function onClick(event) {
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    },
    camera
  );

  let intersects = raycaster.intersectObjects(annotationMarkers, true);
  if (intersects.length > 0 && intersects[0].object.userData && intersects[0].object.userData.id) {
    gotoAnnotation(annotations[intersects[0].object.userData.id]);
  }
}

renderer.domElement.addEventListener("dblclick", onDoubleClick, false);
function onDoubleClick(event) {
  raycaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    },
    camera
  );

  let intersects = raycaster.intersectObjects(sceneMeshes, true);
  if (intersects.length > 0) {
    let p = intersects[0].point;
    new TWEEN.Tween(controls.target)
      .to(
        {
          x: p.x,
          y: p.y,
          z: p.z
        },
        500
      )
      .easing(TWEEN.Easing.Cubic.Out)
      .start()
      .onComplete(() => {
        console.log("camera position", camera.position);
        console.log("controls target", controls.target);
      });
  }
}

function gotoAnnotation(a) {
  new TWEEN.Tween(camera.position)
    .to(
      {
        x: a.camPos.x,
        y: a.camPos.y,
        z: a.camPos.z
      },
      500
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .start();

  new TWEEN.Tween(controls.target)
    .to(
      {
        x: a.lookAt.x,
        y: a.lookAt.y,
        z: a.lookAt.z
      },
      500
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .start();

  Object.keys(annotations).forEach(annotation => {
    if (annotations[annotation].descriptionDomElement) {
      annotations[annotation].descriptionDomElement.style.display = "none";
    }
  });

  if (a.descriptionDomElement) {
    console.log(a.descriptionDomElement.style.display);
    a.descriptionDomElement.style.display = "block";
  }
}

let stats = Stats();
document.body.appendChild(stats.dom);

let animate = function() {
  requestAnimationFrame(animate);
  controls.update();
  TWEEN.update();
  render();
  stats.update();
};

function render() {
  labelRenderer.render(scene, camera);
  renderer.render(scene, camera);
}
animate();
