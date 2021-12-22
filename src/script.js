import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#f4f4f4");

/**
 * Models
 */
// Draco Loader mit Web-Assembly laden und dem gltfLoader zur Verfügung stellen - Draco Loader wird nur geladen, wenn er gebraucht wird
// Draco Loader lohnt sich erst bei großen Dateien
const gltfLoader = new GLTFLoader();

/**
 * Head
 */

const phongMat = new THREE.MeshPhongMaterial({
  color: "#fff",
  shininess: 200,
  specular: "#fff",
});

let gltfScene;

gltfLoader.load("/models/head/head.gltf", (gltf) => {
  gltfScene = gltf.scene;

  gltfScene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.material = phongMat;
    }
  });

  gltf.scene.position.y = 1;
  gltf.scene.position.x = 3;

  scene.add(gltf.scene);
});

/**
 * Floor
 */

const floorMat = new THREE.MeshStandardMaterial({
  color: "#6F989B",
  metalness: 0.2,
  roughness: 0.5,
});

gltfLoader.load("/models/plane/plane.gltf", (gltf) => {
  gltf.scene.children[1].material = floorMat;

  gltf.scene.position.x = 3;
  gltf.scene.position.y = -1;
  gltf.scene.children[1].receiveShadow = true;

  scene.add(gltf.scene);
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1.8, 7.29, 10);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (gltfScene) {
    gltfScene.children[0].rotation.z = -0.2 * elapsedTime;
  }
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
