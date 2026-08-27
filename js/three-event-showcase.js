import * as THREE from 'three';

export function initRaceShowcase(containerId = 'race-visual-stage') {
  const container = document.getElementById(containerId);
  if (!container || container.dataset.threeShowcase === 'ready') return;
  container.dataset.threeShowcase = 'ready';

  const oldCanvas = container.querySelector('#canvas-race-zone');
  oldCanvas?.remove();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.35, 7.2);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.domElement.className = 'race-showcase-canvas';
  container.appendChild(renderer.domElement);

  const cyan = 0x38d9ff;
  const orange = 0xff8a24;
  const purple = 0x9b6cff;
  const dark = 0x0b1017;
  const steel = 0xb9c6d3;

  scene.add(new THREE.HemisphereLight(0xbfd9ff, 0x03060a, 1.8));
  const key = new THREE.DirectionalLight(0xffffff, 3.4); key.position.set(4, 6, 5); scene.add(key);
  const rim = new THREE.PointLight(cyan, 9, 12); rim.position.set(-4, 2, 3); scene.add(rim);
  const warm = new THREE.PointLight(orange, 5, 10); warm.position.set(3, -1, 3); scene.add(warm);
  const violet = new THREE.PointLight(purple, 3, 10); violet.position.set(0, 2, -3); scene.add(violet);

  const stage = new THREE.Group();
  scene.add(stage);
  const robot = new THREE.Group();
  robot.position.set(0, -0.05, 0);
  stage.add(robot);

  const mats = {
    armor: new THREE.MeshStandardMaterial({ color: dark, metalness: 0.9, roughness: 0.22 }),
    steel: new THREE.MeshStandardMaterial({ color: steel, metalness: 0.95, roughness: 0.18 }),
    carbon: new THREE.MeshStandardMaterial({ color: 0x05080d, metalness: 0.55, roughness: 0.42 }),
    cyan: new THREE.MeshBasicMaterial({ color: cyan }),
    orange: new THREE.MeshBasicMaterial({ color: orange }),
    purple: new THREE.MeshBasicMaterial({ color: purple })
  };

  function box(parent, size, pos, mat, bevel = 0.08) {
    const geo = new THREE.BoxGeometry(...size);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    parent.add(mesh);
    return mesh;
  }
  function cyl(parent, r1, r2, h, pos, mat, rot = [0,0,0]) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, 20), mat);
    mesh.position.set(...pos); mesh.rotation.set(...rot); parent.add(mesh); return mesh;
  }
  function torus(parent, r, tube, pos, mat, rot = [Math.PI/2,0,0]) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 12, 32), mat);
    mesh.position.set(...pos); mesh.rotation.set(...rot); parent.add(mesh); return mesh;
  }

  // Chassis: real engineering proportions with a premium silhouette.
  box(robot, [1.75, 0.72, 1.18], [0, 0.35, 0], mats.armor);
  box(robot, [1.48, 0.14, 0.94], [0, 0.72, 0.02], mats.steel);
  box(robot, [1.18, 0.12, 0.82], [0, 0.79, 0.08], mats.carbon);
  box(robot, [0.32, 0.08, 0.92], [0, 0.84, 0.52], mats.cyan);

  // Front bumper and sensor bar.
  box(robot, [1.92, 0.22, 0.22], [0, 0.05, 0.56], mats.steel);
  box(robot, [1.3, 0.1, 0.08], [0, 0.18, 0.69], mats.cyan);
  box(robot, [0.34, 0.08, 0.08], [-0.55, 0.2, 0.71], mats.orange);
  box(robot, [0.34, 0.08, 0.08], [0.55, 0.2, 0.71], mats.orange);

  // Wheels, hubs and visible suspension.
  [-0.95, 0.95].forEach(x => {
    [-0.45, 0.45].forEach(z => {
      const wheel = cyl(robot, 0.38, 0.38, 0.26, [x, -0.02, z], mats.carbon, [Math.PI/2,0,0]);
      torus(robot, 0.29, 0.035, [x, -0.02, z + (z > 0 ? 0.15 : -0.15)], mats.cyan);
      cyl(robot, 0.10, 0.10, 0.29, [x, -0.02, z + (z > 0 ? 0.16 : -0.16)], mats.steel, [Math.PI/2,0,0]);
      box(robot, [0.18, 0.12, 0.55], [x * 0.72, 0.18, z * 0.72], mats.steel);
      return wheel;
    });
  });

  // Rear spoiler and twin drive/boost modules.
  box(robot, [1.65, 0.12, 0.12], [0, 0.58, -0.62], mats.orange);
  [-0.48, 0.48].forEach(x => {
    cyl(robot, 0.14, 0.18, 0.38, [x, 0.35, -0.68], mats.armor, [Math.PI/2,0,0]);
    torus(robot, 0.14, 0.025, [x, 0.35, -0.88], mats.cyan);
  });

  // Small technical mast / camera module.
  cyl(robot, 0.09, 0.09, 0.25, [0, 0.94, -0.02], mats.steel);
  box(robot, [0.36, 0.2, 0.32], [0, 1.08, 0.02], mats.armor);
  box(robot, [0.22, 0.07, 0.07], [0, 1.1, 0.19], mats.cyan);
  torus(robot, 0.18, 0.018, [0, 1.08, 0.02], mats.purple, [Math.PI/2,0,0]);

  // Floating engineering rig around the robot.
  const rig = new THREE.Group(); stage.add(rig);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.012, 8, 96), new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.42 }));
  ring.rotation.x = Math.PI / 2.15; ring.position.y = -0.1; rig.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.008, 8, 96), new THREE.MeshBasicMaterial({ color: purple, transparent: true, opacity: 0.22 }));
  ring2.rotation.x = Math.PI / 2.3; ring2.position.y = 0.25; rig.add(ring2);

  // Ground plane + track lines.
  const ground = new THREE.Mesh(new THREE.CircleGeometry(3.1, 64), new THREE.MeshBasicMaterial({ color: 0x050a10, transparent: true, opacity: 0.82 }));
  ground.rotation.x = -Math.PI/2; ground.position.y = -0.72; stage.add(ground);
  for (let i = -3; i <= 3; i++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.006, 5.2), new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.18 }));
    line.position.set(i * 0.55, -0.71, 0); stage.add(line);
  }

  // Orbiting telemetry nodes.
  const nodes = [];
  for (let i = 0; i < 6; i++) {
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? orange : cyan }));
    const a = (i / 6) * Math.PI * 2; n.userData.angle = a; n.userData.radius = 2.25; n.userData.speed = 0.15 + i * 0.01; rig.add(n); nodes.push(n);
  }

  const pointer = new THREE.Vector2(0, 0);
  const target = new THREE.Vector2(0, 0);
  let hovered = false;
  const onMove = (e) => {
    const r = container.getBoundingClientRect();
    target.x = THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
    target.y = THREE.MathUtils.clamp(-(((e.clientY - r.top) / r.height) * 2 - 1), -1, 1);
    hovered = true;
  };
  const onLeave = () => { target.set(0,0); hovered = false; };
  container.addEventListener('mousemove', onMove);
  container.addEventListener('mouseleave', onLeave);

  function resize() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  resize(); window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    pointer.lerp(target, 0.075);
    robot.rotation.y = pointer.x * 0.42 + Math.sin(t * 0.55) * 0.025;
    robot.rotation.x = -pointer.y * 0.18;
    robot.position.y = -0.05 + Math.sin(t * 1.4) * 0.035;
    stage.rotation.y = pointer.x * 0.08;
    stage.rotation.x = pointer.y * 0.035;
    rig.rotation.z = t * 0.055;
    ring.rotation.z = t * 0.12;
    ring2.rotation.z = -t * 0.07;
    nodes.forEach((n, i) => {
      const a = n.userData.angle + t * n.userData.speed;
      n.position.set(Math.cos(a) * n.userData.radius, 0.15 + Math.sin(a * 1.6) * 0.45, Math.sin(a) * n.userData.radius * 0.42);
    });
    camera.position.x += ((hovered ? pointer.x * 0.55 : 0) - camera.position.x) * 0.035;
    camera.position.y += ((0.35 + (hovered ? pointer.y * 0.28 : 0)) - camera.position.y) * 0.035;
    camera.lookAt(0, 0.25, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
