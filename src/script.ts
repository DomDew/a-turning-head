import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import stretchText from "./stretchText";
import cursorHover from "./cursorHover";
import cycleSkills from "./cycleSkills";
import perlinNoiseInjectionVertexShader from "./shaders/perlinNoiseInjectionVertexShader";
import isTouchDevice from "./checkTouchDevice";

stretchText();
cursorHover();
cycleSkills();

// Queries
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingBar = document.getElementById("loadingArrow");
const loadingWrapper = document.getElementById("loadingWrapper");

// Canvas
const canvas: HTMLCanvasElement = document.querySelector(
  "canvas.webgl"
) as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#f4f4f4");

/**
 * Loaders
 */
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    loadingWrapper?.classList.add("loaded");

    window.setTimeout(() => {
      loadingOverlay?.classList.add("loaded");
    }, 400);
  },

  // Progress
  (_itemUrl, itemsLoaded, itemsTotal) => {
    const progressRatio = itemsLoaded / itemsTotal;
    loadingBar && (loadingBar.style.transform = `scaleX(${progressRatio})`);
  }
);
const gltfLoader = new GLTFLoader(loadingManager);

/**
 * Head
 */
const phongMat = new THREE.MeshPhongMaterial({
  color: "#fff",
  shininess: 200,
  specular: "#fff",
});

const customUniforms = {
  uTime: { value: 0 },
  uFrequency: { value: 30.0 },
  uHeight: { value: 0.05 },
};

// Vertex Shader Injection - Outside of void_main
phongMat.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime;
  shader.uniforms.uFrequency = customUniforms.uFrequency;
  shader.uniforms.uHeight = customUniforms.uHeight;

  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    perlinNoiseInjectionVertexShader
  );

  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>

    float elevation = cnoise(vec3(transformed.xz * uFrequency, uTime)) * uHeight;
    transformed.xyz += elevation * 0.2;
    `
  );
};

let gltfScene: THREE.Group;

// Shadow
const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});

depthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime;
  shader.uniforms.uFrequency = customUniforms.uFrequency;
  shader.uniforms.uHeight = customUniforms.uHeight;

  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    perlinNoiseInjectionVertexShader
  );

  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>

    float elevation = cnoise(vec3(transformed.xz * uFrequency, uTime)) * uHeight;
    transformed.xyz += elevation * 0.2;
    `
  );
};

// Load Head and applay custom materials
gltfLoader.load("/models/head/head.gltf", (gltf) => {
  gltfScene = gltf.scene;

  gltfScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.material = phongMat;
      child.customDepthMaterial = depthMaterial;
    }
  });

  gltf.scene.position.y = -2;
  gltf.scene.position.x = 1;

  scene.add(gltf.scene);
});

/**
 * Floor
 */
const floorMat = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  metalness: 0.3,
  roughness: 0.65,
});

const floorGeometry = new THREE.PlaneBufferGeometry(200, 67);
const floor = new THREE.Mesh(floorGeometry, floorMat);

floor.rotation.x = -0.57;
floor.position.x = -3;
floor.rotation.y = 0.71;
floor.position.y = -0.24;
floor.rotation.z = 0.19;
floor.position.z = -3.97;

floor.receiveShadow = true;

scene.add(floor);

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

  // Update text stretch
  stretchText();
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1.8, 7.29, 10);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.dispose();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
});
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Cursor
 */
// customUniforms.uHeight manipulieren
const cursor = document.getElementById("cursor") as HTMLElement;

window.addEventListener("mousemove", (event) => {
  cursor.style.top = event.pageY + "px";
  cursor.style.left = event.pageX + "px";

  // Calculate Distortion Level
  if (!isTouchDevice) {
    const distY = (1.5 / sizes.height) * event.pageY;
    const distX = (1.5 / sizes.width) * event.pageX;
    customUniforms.uHeight.value = distY + distX;
  }
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  previousTime = elapsedTime;

  // Update material
  customUniforms.uTime.value = elapsedTime;

  // Rotation
  if (gltfScene) {
    gltfScene.children[0].rotation.z = Math.sin(elapsedTime * 0.3);
  }

  if (isTouchDevice) {
    customUniforms.uHeight.value = Math.sin(elapsedTime * 0.3) * 2;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
