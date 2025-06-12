// 🌌 Setup Scene, Camera, Renderer
let isDarkTheme = true;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Dark by default

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("solarCanvas"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ☀️ Lighting
const light = new THREE.PointLight(0xffffff, 2, 1000);
light.position.set(0, 0, 0);
scene.add(light);

// ☀️ Sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xfdb813 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// ✨ Stars (dynamic theme compatible)
let starField;
function addStars(color = 0xffffff) {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 1000;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 200;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const starMaterial = new THREE.PointsMaterial({ color: color, size: 0.5 });
  starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
}
addStars();

// 🪐 Planet Data
const planetData = [
  { name: "Mercury", color: 0xaaaaaa, size: 0.3, distance: 5, speed: 0.02 },
  { name: "Venus", color: 0xffc04d, size: 0.5, distance: 7, speed: 0.015 },
  { name: "Earth", color: 0x3399ff, size: 0.55, distance: 9, speed: 0.012 },
  { name: "Mars", color: 0xff3300, size: 0.4, distance: 11, speed: 0.010 },
  { name: "Jupiter", color: 0xffcc99, size: 1.2, distance: 14, speed: 0.007 },
  { name: "Saturn", color: 0xffe066, size: 1.0, distance: 17, speed: 0.005 },
  { name: "Uranus", color: 0x66ffff, size: 0.8, distance: 20, speed: 0.003 },
  { name: "Neptune", color: 0x3366ff, size: 0.8, distance: 23, speed: 0.002 },
];

// 🌍 Create Planets + Orbits
const planets = [];

planetData.forEach((planet) => {
  const orbit = new THREE.Object3D();
  scene.add(orbit);

  const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: planet.color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = planet.distance;
  orbit.add(mesh);

  const controlPanel = document.getElementById("controls");

  const label = document.createElement("label");
  label.textContent = `${planet.name} Speed`;

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 0;
  slider.max = 0.05;
  slider.step = 0.001;
  slider.value = planet.speed;

  const planetObj = { orbit, mesh, speed: planet.speed };
  planets.push(planetObj);

  slider.addEventListener("input", () => {
    planetObj.speed = parseFloat(slider.value);
  });

  controlPanel.appendChild(label);
  controlPanel.appendChild(slider);
});

// 🎥 Camera Position
camera.position.z = 30;

// 🔄 Animate Planets
function animate() {
  requestAnimationFrame(animate);

  planets.forEach((planet) => {
    planet.orbit.rotation.y += planet.speed;
  });

  renderer.render(scene, camera);
}
animate();

// 🌗 Theme Toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  isDarkTheme = !isDarkTheme;
  scene.background = new THREE.Color(isDarkTheme ? 0x000000 : 0xffffff);

  // Remove and re-add stars with new color
  scene.remove(starField);
  addStars(isDarkTheme ? 0xffffff : 0x000000);

  // Optional: Adjust sun color too?
  sun.material.color.setHex(isDarkTheme ? 0xfdb813 : 0xffcc00);
});
