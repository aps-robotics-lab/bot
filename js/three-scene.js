/**
 * ROBO KRITI 2026 - 3D MECH ROBOT CONTROLLER
 * High-Aesthetic Interactive 3D Combat Mech
 */
import * as THREE from 'three';

export function initRoboticScene(canvasId = 'hero-3d-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const container = canvas.parentElement || document.body;
  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0.5, 6.4);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (e) {
    console.warn("WebGL not supported:", e);
    return;
  }

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  // --- Lighting (Crisp Studio Lighting for Metal & Carbon Fiber) ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 3.5);
  mainLight.position.set(6, 8, 7);
  scene.add(mainLight);

  const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 4.0);
  blueRimLight.position.set(-6, 2, -4);
  scene.add(blueRimLight);

  const cyanUnderGlow = new THREE.PointLight(0x06b6d4, 3, 10);
  cyanUnderGlow.position.set(0, -2, 2);
  scene.add(cyanUnderGlow);

  const cursorFollowLight = new THREE.PointLight(0xffffff, 2.5, 8);
  cursorFollowLight.position.set(0, 1, 4);
  scene.add(cursorFollowLight);

  // --- Master Robot Assembly ---
  const robotRoot = new THREE.Group();
  robotRoot.position.set(0.7, -0.2, 0); // Positioned nicely on the right half of the hero
  scene.add(robotRoot);

  // Responsive position adjustment for smaller screens
  function updateLayout() {
    if (window.innerWidth < 900) {
      robotRoot.position.set(0, -0.4, 0);
      camera.position.set(0, 0.4, 7.6);
    } else {
      robotRoot.position.set(1.0, -0.2, 0);
      camera.position.set(0, 0.5, 6.2);
    }
  }
  updateLayout();

  // --- Aesthetic Materials ---
  const matteGunmetal = new THREE.MeshStandardMaterial({
    color: 0x161922,
    metalness: 0.85,
    roughness: 0.28
  });

  const brushedTitanium = new THREE.MeshStandardMaterial({
    color: 0xd8e0ea,
    metalness: 0.95,
    roughness: 0.15
  });

  const carbonFiber = new THREE.MeshStandardMaterial({
    color: 0x0b0d13,
    metalness: 0.5,
    roughness: 0.5
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.9,
    roughness: 0.2
  });

  const visorGlowMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8
  });

  const coreGlowMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4
  });

  const coreAuraMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });

  // ==========================================
  // 1. CHEST & TORSO ASSEMBLY
  // ==========================================
  const torsoGroup = new THREE.Group();
  robotRoot.add(torsoGroup);

  // Main Chest Armor Core
  const chestBaseGeo = new THREE.BoxGeometry(1.2, 1.1, 0.8);
  const chestBase = new THREE.Mesh(chestBaseGeo, matteGunmetal);
  torsoGroup.add(chestBase);

  // Angled Pectoral Plates (Left & Right)
  const pecGeo = new THREE.ConeGeometry(0.55, 0.85, 4);
  pecGeo.rotateY(Math.PI / 4);

  const leftPec = new THREE.Mesh(pecGeo, brushedTitanium);
  leftPec.position.set(-0.35, 0.15, 0.45);
  leftPec.rotation.set(-0.2, 0.1, -0.1);
  leftPec.scale.set(0.9, 1, 0.4);
  torsoGroup.add(leftPec);

  const rightPec = new THREE.Mesh(pecGeo, brushedTitanium);
  rightPec.position.set(0.35, 0.15, 0.45);
  rightPec.rotation.set(-0.2, -0.1, 0.1);
  rightPec.scale.set(0.9, 1, 0.4);
  torsoGroup.add(rightPec);

  // Central Reactor Core (Arc Core)
  const coreOuterRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 16, 32), goldAccentMat);
  coreOuterRing.position.set(0, 0.12, 0.45);
  torsoGroup.add(coreOuterRing);

  const coreInnerMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 24), coreGlowMat);
  coreInnerMesh.position.set(0, 0.12, 0.45);
  coreInnerMesh.rotation.x = Math.PI / 2;
  torsoGroup.add(coreInnerMesh);

  const coreAuraMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 1), coreAuraMat);
  coreAuraMesh.position.set(0, 0.12, 0.45);
  torsoGroup.add(coreAuraMesh);

  // Abdominal Segment Plates
  const absGeo = new THREE.BoxGeometry(0.8, 0.18, 0.65);
  for (let i = 0; i < 3; i++) {
    const absPlate = new THREE.Mesh(absGeo, carbonFiber);
    absPlate.position.set(0, -0.42 - i * 0.2, 0.08);
    absPlate.scale.set(1 - i * 0.08, 1, 1 - i * 0.05);
    torsoGroup.add(absPlate);
  }

  // Spine & Back Hydraulic Thruster Vents
  const spineGeo = new THREE.BoxGeometry(0.25, 1.2, 0.3);
  const spine = new THREE.Mesh(spineGeo, brushedTitanium);
  spine.position.set(0, 0, -0.45);
  torsoGroup.add(spine);

  const thrusterGeo = new THREE.CylinderGeometry(0.16, 0.22, 0.5, 16);
  const leftThruster = new THREE.Mesh(thrusterGeo, matteGunmetal);
  leftThruster.position.set(-0.45, 0.2, -0.5);
  leftThruster.rotation.x = 0.3;
  torsoGroup.add(leftThruster);

  const rightThruster = new THREE.Mesh(thrusterGeo, matteGunmetal);
  rightThruster.position.set(0.45, 0.2, -0.5);
  rightThruster.rotation.x = 0.3;
  torsoGroup.add(rightThruster);

  // Thruster Glow Rings
  const flameRingGeo = new THREE.TorusGeometry(0.15, 0.03, 16, 24);
  const leftFlame = new THREE.Mesh(flameRingGeo, visorGlowMat);
  leftFlame.position.set(-0.45, -0.05, -0.58);
  leftFlame.rotation.x = Math.PI / 2 + 0.3;
  torsoGroup.add(leftFlame);

  const rightFlame = new THREE.Mesh(flameRingGeo, visorGlowMat);
  rightFlame.position.set(0.45, -0.05, -0.58);
  rightFlame.rotation.x = Math.PI / 2 + 0.3;
  torsoGroup.add(rightFlame);

  // ==========================================
  // 2. MECH HEAD & VISOR ASSEMBLY
  // ==========================================
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.85, 0);
  torsoGroup.add(headGroup);

  // Neck Hydraulic Pillar
  const neckGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.25, 16);
  const neck = new THREE.Mesh(neckGeo, brushedTitanium);
  neck.position.set(0, -0.15, 0);
  headGroup.add(neck);

  // Main Helmet Cranium
  const helmetGeo = new THREE.BoxGeometry(0.65, 0.52, 0.65);
  const helmet = new THREE.Mesh(helmetGeo, matteGunmetal);
  headGroup.add(helmet);

  // Top Forehead Crest Armor
  const crestGeo = new THREE.BoxGeometry(0.24, 0.2, 0.7);
  const crest = new THREE.Mesh(crestGeo, brushedTitanium);
  crest.position.set(0, 0.3, -0.02);
  crest.rotation.x = -0.15;
  headGroup.add(crest);

  // Aerodynamic Ear Antennas (Left & Right)
  const antGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.6, 8);
  const leftAnt = new THREE.Mesh(antGeo, goldAccentMat);
  leftAnt.position.set(-0.38, 0.25, -0.1);
  leftAnt.rotation.set(-0.3, 0, 0.4);
  headGroup.add(leftAnt);

  const rightAnt = new THREE.Mesh(antGeo, goldAccentMat);
  rightAnt.position.set(0.38, 0.25, -0.1);
  rightAnt.rotation.set(-0.3, 0, -0.4);
  headGroup.add(rightAnt);

  // Kinetic Visor / Optical Sensor Strip (Cyber Eyebar)
  const visorGeo = new THREE.BoxGeometry(0.54, 0.12, 0.18);
  const visor = new THREE.Mesh(visorGeo, visorGlowMat);
  visor.position.set(0, 0.05, 0.3);
  headGroup.add(visor);

  // Visor Guard Frame
  const visorFrameGeo = new THREE.BoxGeometry(0.6, 0.04, 0.2);
  const visorTopFrame = new THREE.Mesh(visorFrameGeo, brushedTitanium);
  visorTopFrame.position.set(0, 0.13, 0.3);
  headGroup.add(visorTopFrame);

  // Chin Armor Bevel
  const chinGeo = new THREE.ConeGeometry(0.25, 0.3, 4);
  chinGeo.rotateY(Math.PI / 4);
  const chin = new THREE.Mesh(chinGeo, brushedTitanium);
  chin.position.set(0, -0.22, 0.28);
  chin.rotation.x = 0.4;
  chin.scale.set(0.8, 0.6, 0.6);
  headGroup.add(chin);

  // ==========================================
  // 3. ARTICULATED SHOULDERS & BIONIC ARMS
  // ==========================================
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.85, 0.45, 0);
  torsoGroup.add(leftArmGroup);

  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.85, 0.45, 0);
  torsoGroup.add(rightArmGroup);

  // Pauldron Shoulder Armor
  const pauldronGeo = new THREE.BoxGeometry(0.5, 0.35, 0.55);
  
  const leftPauldron = new THREE.Mesh(pauldronGeo, brushedTitanium);
  leftPauldron.rotation.z = -0.25;
  leftArmGroup.add(leftPauldron);

  const rightPauldron = new THREE.Mesh(pauldronGeo, brushedTitanium);
  rightPauldron.rotation.z = 0.25;
  rightArmGroup.add(rightPauldron);

  // Upper Arms
  const bicepGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.6, 16);
  const leftBicep = new THREE.Mesh(bicepGeo, matteGunmetal);
  leftBicep.position.set(0, -0.4, 0);
  leftArmGroup.add(leftBicep);

  const rightBicep = new THREE.Mesh(bicepGeo, matteGunmetal);
  rightBicep.position.set(0, -0.4, 0);
  rightArmGroup.add(rightBicep);

  // Forearm Weapon & Shield Pods
  const forearmGeo = new THREE.BoxGeometry(0.26, 0.65, 0.28);

  const leftForearmGroup = new THREE.Group();
  leftForearmGroup.position.set(0, -0.7, 0);
  leftArmGroup.add(leftForearmGroup);

  const leftForearm = new THREE.Mesh(forearmGeo, brushedTitanium);
  leftForearm.position.set(0, -0.25, 0.1);
  leftForearmGroup.add(leftForearm);

  const rightForearmGroup = new THREE.Group();
  rightForearmGroup.position.set(0, -0.7, 0);
  rightArmGroup.add(rightForearmGroup);

  const rightForearm = new THREE.Mesh(forearmGeo, brushedTitanium);
  rightForearm.position.set(0, -0.25, 0.1);
  rightForearmGroup.add(rightForearm);

  // Claw / Fist Hands
  const handGeo = new THREE.BoxGeometry(0.18, 0.22, 0.2);
  const leftHand = new THREE.Mesh(handGeo, matteGunmetal);
  leftHand.position.set(0, -0.65, 0.1);
  leftForearmGroup.add(leftHand);

  const rightHand = new THREE.Mesh(handGeo, matteGunmetal);
  rightHand.position.set(0, -0.65, 0.1);
  rightForearmGroup.add(rightHand);

  // Tactical Laser Barrels on right forearm
  const barrelGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
  const barrel1 = new THREE.Mesh(barrelGeo, goldAccentMat);
  barrel1.position.set(0.12, -0.35, 0.25);
  barrel1.rotation.x = Math.PI / 2;
  rightForearmGroup.add(barrel1);

  const barrel2 = new THREE.Mesh(barrelGeo, goldAccentMat);
  barrel2.position.set(-0.12, -0.35, 0.25);
  barrel2.rotation.x = Math.PI / 2;
  rightForearmGroup.add(barrel2);

  // ==========================================
  // 4. FLOATING COMBAT TELEMETRY RINGS
  // ==========================================
  const orbitalRingGroup = new THREE.Group();
  robotRoot.add(orbitalRingGroup);

  const ringGeo = new THREE.TorusGeometry(1.85, 0.02, 16, 80);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.35
  });
  const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
  orbitalRing.rotation.x = Math.PI / 2.3;
  orbitalRingGroup.add(orbitalRing);

  // Floating Micro Target Reticles
  const droneGeo = new THREE.OctahedronGeometry(0.1, 0);
  const droneMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.1 });
  const drones = [];
  for (let i = 0; i < 3; i++) {
    const drone = new THREE.Mesh(droneGeo, droneMat);
    orbitalRingGroup.add(drone);
    drones.push({
      mesh: drone,
      radius: 1.85,
      speed: 0.8 + i * 0.4,
      offset: (i * Math.PI * 2) / 3
    });
  }

  // --- Mouse & Drag Interactivity ---
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotationY = 0;
  let targetRotationX = 0;
  let mouseNormX = 0;
  let mouseNormY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseNormX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseNormY = (e.clientY / window.innerHeight - 0.5) * 2;

    cursorFollowLight.position.x = robotRoot.position.x + mouseNormX * 3;
    cursorFollowLight.position.y = robotRoot.position.y - mouseNormY * 3;
  });

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    targetRotationY += deltaX * 0.008;
    targetRotationX += deltaY * 0.008;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Touch handlers
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    targetRotationY += deltaX * 0.01;
    targetRotationX += deltaY * 0.01;

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });

  // Mode Buttons Switcher (Combat Stances)
  let currentStance = 'scan';
  const modeButtons = document.querySelectorAll('.mode-btn');
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-mode');
      currentStance = mode;

      if (mode === 'core' || mode === 'overdrive') {
        coreGlowMat.color.setHex(0xf59e0b); // Gold Overdrive
        visorGlowMat.color.setHex(0xf59e0b);
      } else {
        coreGlowMat.color.setHex(0x06b6d4); // Cyan Blue Standard
        visorGlowMat.color.setHex(0x38bdf8);
      }
    });
  });

  // Resize Handler
  const onResize = () => {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    updateLayout();
  };
  window.addEventListener('resize', onResize);

  // --- Master 60FPS Kinematic Animation Loop ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Natural idle breathing hover
    const idleHover = Math.sin(time * 1.5) * 0.08;
    torsoGroup.position.y = idleHover;

    // Head follows mouse cursor dynamically with natural limits
    const targetHeadYaw = mouseNormX * 0.45;
    const targetHeadPitch = -mouseNormY * 0.35;
    headGroup.rotation.y += (targetHeadYaw - headGroup.rotation.y) * 0.08;
    headGroup.rotation.x += (targetHeadPitch - headGroup.rotation.x) * 0.08;

    // Torso subtle posture reaction
    torsoGroup.rotation.y += (mouseNormX * 0.15 - torsoGroup.rotation.y) * 0.05;
    torsoGroup.rotation.z = Math.sin(time * 1.2) * 0.02;

    // Dynamic Arm Kinematics based on stance
    if (currentStance === 'core' || currentStance === 'overdrive') {
      leftArmGroup.rotation.x = -0.4 + Math.sin(time * 3) * 0.05;
      rightArmGroup.rotation.x = -0.4 + Math.cos(time * 3) * 0.05;
      leftArmGroup.rotation.z = -0.4;
      rightArmGroup.rotation.z = 0.4;
      coreAuraMesh.rotation.y = time * 3.0;
      coreAuraMesh.rotation.x = time * 2.0;
    } else {
      // Standard Scanning Stance
      leftArmGroup.rotation.x = Math.sin(time * 1.2) * 0.1;
      rightArmGroup.rotation.x = -Math.sin(time * 1.2) * 0.1;
      leftArmGroup.rotation.z = -0.15 + Math.sin(time) * 0.03;
      rightArmGroup.rotation.z = 0.15 - Math.sin(time) * 0.03;
      coreAuraMesh.rotation.y = time * 0.8;
    }

    // Arc Core Pulsing
    const corePulse = 1 + Math.sin(time * 4) * 0.12;
    coreInnerMesh.scale.set(corePulse, 1, corePulse);

    // Orbital ring & drones rotation
    orbitalRingGroup.rotation.y = time * 0.3;
    drones.forEach((d) => {
      const angle = time * d.speed + d.offset;
      d.mesh.position.set(
        Math.cos(angle) * d.radius,
        Math.sin(angle * 2) * 0.25,
        Math.sin(angle) * d.radius
      );
      d.mesh.rotation.y = time * 2;
    });

    // Inertial manual rotation lerping
    if (!isDragging) {
      targetRotationY += 0.0015; // Slow ambient orbit
    }
    robotRoot.rotation.y += (targetRotationY - robotRoot.rotation.y) * 0.06;
    robotRoot.rotation.x += (targetRotationX - robotRoot.rotation.x) * 0.06;

    renderer.render(scene, camera);
  }

  animate();
}
