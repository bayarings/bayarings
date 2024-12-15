import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js"; // Import the THREE.js library
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js"; // To allow for the camera to move around the scene
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js"; // To allow for importing the .gltf file
import { RGBELoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js"; // To allow for importing environment

let camera, scene, renderer;

// Create a Three.JS Scene
const scene = new THREE.Scene();
// create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Keep the 3D object on a global variable so we can access it later
let object;

// OrbitControls allow the camera to move around the scene
let controls;

// Set which object to render
let objToRender = 'diamond-ring';


// Load environment map for reflections
const textureLoader = new THREE.TextureLoader();
const envMap = textureLoader.load("https://www.bayarings.com/overcast_soil_puresky.jpg");  // Set the environment texture

// Set up the environment map for reflections
scene.environment = envMap;



// Load the file
new RGBELoader()
	.load( "https://www.bayarings.com/overcast_soil_puresky_4k.hdr", function ( texture ) {

		texture.mapping = THREE.EquirectangularReflectionMapping;

		scene.background = texture;
		scene.environment = texture;

		render();

		// model

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    // If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);

    // Make the ring metallic
    object.traverse(function(child) {
      if (child.isMesh) {
		child.material.metalness = 1;  // Fully metallic
		child.material.roughness = 0;  // Smooth surface
		child.material.emissive = new THREE.Color(0x0); // No emissive (glowing)
		child.material.envMap = envMap; // Apply environment map for reflections
		child.material.envMapIntensity = 1.5; // Reflection intensity
		child.material.clearcoat = 1; // Extra shine
		child.material.clearcoatRoughness = 0; // Smooth clearcoat
		child.material.reflectivity = 1;  // Maximum reflectivity
		child.material.needsUpdate = true;
      }
    });
  },
  function (xhr) {
    // While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    // If there is an error, log it
    console.error(error);
  }
);

	} );



renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 1;
				container.appendChild( renderer.domElement );



			function render() {

				renderer.render( scene, camera );

			}




// Set background color
scene.background = new THREE.Color(0xf8f4f0);  // Background color #f8f4f0


// Set how far the camera will be from the 3D model
camera.position.z = (objToRender === "dino" || objToRender === "diamond-ring") ? 25 : 500;

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); // top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, (objToRender === "dino" || objToRender === "diamond-ring") ? 5 : 1);
scene.add(ambientLight);

// This adds controls to the camera, so we can rotate/zoom it with the mouse
if ((objToRender === "dino" || objToRender === "diamond-ring")) {
  controls = new OrbitControls(camera, renderer.domElement);
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  // Here we could add some code to update the scene, adding some automatic movement

  // Make the eye move
  if (object && objToRender === "eye") {
    // I've played with the constants here until it looked good 
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }
  renderer.render(scene, camera);
}

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

// Start the 3D rendering
animate();
