document.addEventListener('DOMContentLoaded', () => {
  const viewer = document.getElementById('viewer');
  if (viewer) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      precision: "highp"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    viewer.appendChild(renderer.domElement);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let object;
    let controls;

    const textureLoader = new THREE.TextureLoader();
    const envMap = textureLoader.load("https://www.bayarings.com/overcast_soil_puresky.jpg");
    scene.environment = envMap;

    new RGBELoader().load(
      "https://www.bayarings.com/overcast_soil_puresky_4k.hdr", function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
        render();
        const loader = new GLTFLoader();
        loader.load(
          `models/silver-ring/scene.gltf`,
          function (gltf) {
            object = gltf.scene;
            object.rotation.x = +Math.PI / 2;
            scene.add(object);
            object.traverse(function (child) {
              if (child.isMesh) {
                child.material.metalness = 1;
                child.material.roughness = 0.4;
                child.material.envMap = envMap;
                child.material.envMapIntensity = 0.7;
                child.material.clearcoat = 0;
                child.material.clearcoatRoughness = 0;
                child.material.reflectivity = 0.5;
                child.material.needsUpdate = true;
              }
            });
          },
          function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          function (error) {
            console.error(error);
          }
        );
      });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    function render() {
      renderer.render(scene, camera);
    }

    scene.background = new THREE.Color(0xf8f4f0);

    camera.position.z = 25;

    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(500, 500, 500);
    topLight.castShadow = true;
    scene.add(topLight);

    const ambientLight = new THREE.AmbientLight(0x333333, 5);
    scene.add(ambientLight);

    if (true) {
      controls = new OrbitControls(camera, renderer.domElement);
    }

    function animate() {
      requestAnimationFrame(animate);
      if (object) {
        object.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    }

    window.addEventListener("resize", function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.onmousemove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    animate();
  } else {
    console.error('Element with id "viewer" not found');
  }
});
