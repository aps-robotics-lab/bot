/**
 * ROBO KRITI 2026 - 3D KRITI-BOT CUTE COMPANION & ARENA MASCOT
 * Cute, Cool, Interactive 3D Robot with Expressive Animated LED Face & Physics
 */
import * as THREE from 'three';

export function initCuteBotScene(canvasId = 'campus-3d-canvas', options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const container = canvas.parentElement || document.body;
  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || 460;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 0.4, 5.2);
  camera.lookAt(0, 0, 0);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (e) {
    console.warn("WebGL not supported for Cute Bot:", e);
    return null;
  }

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // --- Lighting (Warm & Cool Cyber-Studio Lighting) ---
  const ambientLight = new THREE.AmbientLight(0x0f172a, 2.2);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 3.2);
  mainLight.position.set(4, 6, 5);
  scene.add(mainLight);

  const cyanRimLight = new THREE.DirectionalLight(0x38bdf8, 3.8);
  cyanRimLight.position.set(-5, 3, -3);
  scene.add(cyanRimLight);

  const goldAccentLight = new THREE.DirectionalLight(0xf59e0b, 2.5);
  goldAccentLight.position.set(3, -2, -2);
  scene.add(goldAccentLight);

  const bottomHoverLight = new THREE.PointLight(0x38bdf8, 3.0, 8);
  bottomHoverLight.position.set(0, -1.8, 0.5);
  scene.add(bottomHoverLight);

  // --- Materials ---
  const whiteCeramicMat = new THREE.MeshStandardMaterial({
    color: 0xf0f4f8,
    metalness: 0.25,
    roughness: 0.18,
  });

  const gunmetalMat = new THREE.MeshStandardMaterial({
    color: 0x181e29,
    metalness: 0.85,
    roughness: 0.3
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.9,
    roughness: 0.2
  });

  const cyanGlowMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8
  });

  const amberGlowMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b
  });

  const glassVisorMat = new THREE.MeshStandardMaterial({
    color: 0x050811,
    metalness: 0.95,
    roughness: 0.1,
  });

  // --- Dynamic Canvas Texture for Animated Expressive LED Face ---
  const faceCanvas = document.createElement('canvas');
  faceCanvas.width = 1024;
  faceCanvas.height = 512;
  const faceCtx = faceCanvas.getContext('2d');

  let currentMood = 'happy'; // 'happy', 'combat', 'scan', 'star', 'love'
  let blinkProgress = 0;
  let isBlinking = false;
  let nextBlinkTime = Date.now() + 2000;

  function drawFace() {
    if (!faceCtx) return;
    faceCtx.clearRect(0, 0, 1024, 512);

    // Deep Dark Visor Screen with subtle gradient
    const bgGrad = faceCtx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0, '#04070d');
    bgGrad.addColorStop(1, '#080d1a');
    faceCtx.fillStyle = bgGrad;
    faceCtx.fillRect(0, 0, 1024, 512);

    // Tech grid scanlines
    faceCtx.fillStyle = 'rgba(56, 189, 248, 0.06)';
    for (let y = 0; y < 512; y += 6) {
      faceCtx.fillRect(0, y, 1024, 2);
    }

    // Outer HUD frame on visor screen
    faceCtx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    faceCtx.lineWidth = 4;
    faceCtx.strokeRect(30, 30, 964, 452);

    // Top status text on visor
    faceCtx.font = 'bold 20px monospace';
    faceCtx.fillStyle = '#38bdf8';
    faceCtx.fillText('RBK-26 // KRITI-BOT MK-3 // ONLINE', 60, 70);
    faceCtx.fillText('APS LBS MARG', 810, 70);

    const eyeColor = currentMood === 'combat' ? '#f59e0b' : currentMood === 'love' ? '#f43f5e' : '#00f0ff';
    faceCtx.strokeStyle = eyeColor;
    faceCtx.fillStyle = eyeColor;
    faceCtx.lineWidth = 26;
    faceCtx.lineCap = 'round';
    faceCtx.lineJoin = 'round';
    faceCtx.shadowColor = eyeColor;
    faceCtx.shadowBlur = 32;

    // Left and Right Eye Centers
    const leftX = 330;
    const rightX = 694;
    const eyeY = 250;

    if (isBlinking && blinkProgress > 0.5) {
      // Sleek horizontal blink lines
      faceCtx.beginPath();
      faceCtx.moveTo(leftX - 80, eyeY);
      faceCtx.lineTo(leftX + 80, eyeY);
      faceCtx.stroke();

      faceCtx.beginPath();
      faceCtx.moveTo(rightX - 80, eyeY);
      faceCtx.lineTo(rightX + 80, eyeY);
      faceCtx.stroke();
    } else {
      // Large Vibrant Cute Cyber Eyes (◕ ‿ ◕)
      // Left Eye
      faceCtx.beginPath();
      faceCtx.arc(leftX, eyeY, 78, 0, Math.PI * 2);
      faceCtx.fill();

      // Right Eye
      faceCtx.beginPath();
      faceCtx.arc(rightX, eyeY, 78, 0, Math.PI * 2);
      faceCtx.fill();

      // Eye reflections / pupils (Bright White Sparkles)
      faceCtx.shadowBlur = 0;
      faceCtx.fillStyle = '#ffffff';
      faceCtx.beginPath();
      faceCtx.arc(leftX - 25, eyeY - 26, 24, 0, Math.PI * 2);
      faceCtx.fill();
      faceCtx.beginPath();
      faceCtx.arc(leftX + 28, eyeY + 28, 12, 0, Math.PI * 2);
      faceCtx.fill();

      faceCtx.beginPath();
      faceCtx.arc(rightX - 25, eyeY - 26, 24, 0, Math.PI * 2);
      faceCtx.fill();
      faceCtx.beginPath();
      faceCtx.arc(rightX + 28, eyeY + 28, 12, 0, Math.PI * 2);
      faceCtx.fill();

      // Cute Smile Mouth
      faceCtx.strokeStyle = eyeColor;
      faceCtx.lineWidth = 14;
      faceCtx.shadowColor = eyeColor;
      faceCtx.shadowBlur = 24;
      faceCtx.beginPath();
      faceCtx.arc(512, 330, 48, 0.2 * Math.PI, 0.8 * Math.PI, false);
      faceCtx.stroke();

      // Cute Pink/Cyan Blush Cheeks
      faceCtx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      faceCtx.beginPath();
      faceCtx.ellipse(leftX - 95, eyeY + 80, 42, 18, 0, 0, Math.PI * 2);
      faceCtx.fill();
      faceCtx.beginPath();
      faceCtx.ellipse(rightX + 95, eyeY + 80, 42, 18, 0, 0, Math.PI * 2);
      faceCtx.fill();
    }

    faceCtx.shadowBlur = 0;
  }

  const faceTexture = new THREE.CanvasTexture(faceCanvas);
  faceTexture.needsUpdate = true;

  const faceVisorMat = new THREE.MeshBasicMaterial({
    map: faceTexture,
    transparent: false
  });

  // --- Robot Hierarchy ---
  const robotRoot = new THREE.Group();
  scene.add(robotRoot);

  const bobberGroup = new THREE.Group();
  robotRoot.add(bobberGroup);

  // 1. CHASSIS / TORSO (Chubby Cute Capsule)
  const torsoGroup = new THREE.Group();
  bobberGroup.add(torsoGroup);

  // Main Rounded Torso Egg
  const bodyGeo = new THREE.SphereGeometry(0.82, 32, 24);
  bodyGeo.scale(1.0, 1.05, 0.9);
  const bodyMesh = new THREE.Mesh(bodyGeo, whiteCeramicMat);
  bodyMesh.position.set(0, -0.15, 0);
  torsoGroup.add(bodyMesh);

  // Torso Bottom Cap (Dark Gunmetal Hull)
  const hullBottomGeo = new THREE.CylinderGeometry(0.55, 0.42, 0.35, 24);
  const hullBottom = new THREE.Mesh(hullBottomGeo, gunmetalMat);
  hullBottom.position.set(0, -0.8, 0);
  torsoGroup.add(hullBottom);

  // Chest Heart/Arc Core (Pulsing glowing cyber heart)
  const heartCoreGeo = new THREE.TorusGeometry(0.18, 0.04, 16, 32);
  const heartCoreRing = new THREE.Mesh(heartCoreGeo, goldMat);
  heartCoreRing.position.set(0, -0.08, 0.72);
  torsoGroup.add(heartCoreRing);

  const heartCoreInner = new THREE.Mesh(new THREE.CircleGeometry(0.14, 24), cyanGlowMat);
  heartCoreInner.position.set(0, -0.08, 0.73);
  torsoGroup.add(heartCoreInner);

  // Hover Jet Ring at Bottom
  const jetRingGeo = new THREE.TorusGeometry(0.36, 0.05, 16, 32);
  const jetRing = new THREE.Mesh(jetRingGeo, cyanGlowMat);
  jetRing.rotation.x = Math.PI / 2;
  jetRing.position.set(0, -0.98, 0);
  torsoGroup.add(jetRing);

  // Jet Plasma Flame Particle Disc
  const plasmaGeo = new THREE.CylinderGeometry(0.28, 0.02, 0.45, 16, 1, true);
  const plasmaMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide
  });
  const plasmaMesh = new THREE.Mesh(plasmaGeo, plasmaMat);
  plasmaMesh.position.set(0, -1.2, 0);
  torsoGroup.add(plasmaMesh);

  // 2. HEAD ASSEMBLY (Oversized Chibi Head)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.78, 0);
  bobberGroup.add(headGroup);

  // Rounded Main Head Sphere
  const headGeo = new THREE.SphereGeometry(0.95, 32, 28);
  headGeo.scale(1.12, 0.96, 1.05);
  const headMesh = new THREE.Mesh(headGeo, whiteCeramicMat);
  headGroup.add(headMesh);

  // Front Visor Bezel (Dark Glossy Frame)
  const bezelGeo = new THREE.SphereGeometry(0.965, 32, 20, -Math.PI / 3.2, (Math.PI / 3.2) * 2, Math.PI / 4, Math.PI / 2.2);
  bezelGeo.scale(1.12, 0.96, 1.05);
  const bezelMesh = new THREE.Mesh(bezelGeo, gunmetalMat);
  headGroup.add(bezelMesh);

  // High-Resolution OLED Visor Screen Plate (Front surface of head)
  const visorGeo = new THREE.SphereGeometry(0.97, 32, 20, -Math.PI / 3.5, (Math.PI / 3.5) * 2, Math.PI / 3.8, Math.PI / 2.4);
  visorGeo.scale(1.12, 0.96, 1.05);
  const visorMesh = new THREE.Mesh(visorGeo, faceVisorMat);
  headGroup.add(visorMesh);

  // 3D Physical Glowing LED Eyes Assembly (Guarantee 100% visibility & ultra-sharp crispness)
  const eyeAssemblyGroup = new THREE.Group();
  eyeAssemblyGroup.position.set(0, 0.05, 0.99);
  headGroup.add(eyeAssemblyGroup);

  // Left 3D Glowing Eye
  const leftEye3D = new THREE.Group();
  leftEye3D.position.set(-0.34, 0.02, 0);
  eyeAssemblyGroup.add(leftEye3D);

  const eye3DDiscGeo = new THREE.CircleGeometry(0.15, 32);
  const eye3DDiscLeft = new THREE.Mesh(eye3DDiscGeo, cyanGlowMat);
  leftEye3D.add(eye3DDiscLeft);

  const eye3DPupilGeo = new THREE.CircleGeometry(0.045, 16);
  const whitePupilMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const leftPupil = new THREE.Mesh(eye3DPupilGeo, whitePupilMat);
  leftPupil.position.set(-0.04, 0.04, 0.01);
  leftEye3D.add(leftPupil);

  // Right 3D Glowing Eye
  const rightEye3D = new THREE.Group();
  rightEye3D.position.set(0.34, 0.02, 0);
  eyeAssemblyGroup.add(rightEye3D);

  const eye3DDiscRight = new THREE.Mesh(eye3DDiscGeo, cyanGlowMat);
  rightEye3D.add(eye3DDiscRight);

  const rightPupil = new THREE.Mesh(eye3DPupilGeo, whitePupilMat);
  rightPupil.position.set(-0.04, 0.04, 0.01);
  rightEye3D.add(rightPupil);

  // Cute 3D Glowing Smile Mouth Arc
  const smileCurve = new THREE.CylinderGeometry(0.012, 0.012, 0.22, 12);
  smileCurve.rotation.z = Math.PI / 2;
  const smileMesh = new THREE.Mesh(smileCurve, cyanGlowMat);
  smileMesh.position.set(0, -0.16, 0.01);
  eyeAssemblyGroup.add(smileMesh);

  // Cute Cat/Bunny Ear Antennas (Left & Right)
  const earGeo = new THREE.ConeGeometry(0.2, 0.65, 16);
  earGeo.rotateZ(Math.PI);

  const leftEarGroup = new THREE.Group();
  leftEarGroup.position.set(-0.75, 0.8, -0.05);
  leftEarGroup.rotation.set(-0.1, 0, -0.45);
  headGroup.add(leftEarGroup);

  const leftEarMesh = new THREE.Mesh(earGeo, whiteCeramicMat);
  leftEarGroup.add(leftEarMesh);

  const leftEarGlow = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), cyanGlowMat);
  leftEarGlow.position.set(0, -0.38, 0);
  leftEarGroup.add(leftEarGlow);

  const rightEarGroup = new THREE.Group();
  rightEarGroup.position.set(0.75, 0.8, -0.05);
  rightEarGroup.rotation.set(-0.1, 0, 0.45);
  headGroup.add(rightEarGroup);

  const rightEarMesh = new THREE.Mesh(earGeo, whiteCeramicMat);
  rightEarGroup.add(rightEarMesh);

  const rightEarGlow = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), cyanGlowMat);
  rightEarGlow.position.set(0, -0.38, 0);
  rightEarGroup.add(rightEarGlow);

  // Cute Floating Hologram Ring / Halo
  const haloGeo = new THREE.TorusGeometry(0.72, 0.02, 12, 48);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.65
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.rotation.x = Math.PI / 2.2;
  haloMesh.position.set(0, 1.18, -0.1);
  headGroup.add(haloMesh);

  // 3. FLOATING DETACHED MAGNETIC HANDS (Bionic Chibi Paws)
  const leftHandGroup = new THREE.Group();
  leftHandGroup.position.set(-1.25, -0.1, 0.2);
  bobberGroup.add(leftHandGroup);

  const handGeo = new THREE.SphereGeometry(0.24, 20, 16);
  handGeo.scale(1.0, 1.1, 0.9);
  const leftHand = new THREE.Mesh(handGeo, whiteCeramicMat);
  leftHandGroup.add(leftHand);

  // Golden palm repulsor
  const leftPalmRepulsor = new THREE.Mesh(new THREE.CircleGeometry(0.08, 16), goldMat);
  leftPalmRepulsor.position.set(0, 0, 0.22);
  leftHandGroup.add(leftPalmRepulsor);

  const rightHandGroup = new THREE.Group();
  rightHandGroup.position.set(1.25, -0.1, 0.2);
  bobberGroup.add(rightHandGroup);

  const rightHand = new THREE.Mesh(handGeo, whiteCeramicMat);
  rightHandGroup.add(rightHand);

  const rightPalmRepulsor = new THREE.Mesh(new THREE.CircleGeometry(0.08, 16), goldMat);
  rightPalmRepulsor.position.set(0, 0, 0.22);
  rightHandGroup.add(rightPalmRepulsor);

  // 4. FLOATING CUTE COMPANION MINI-ORBS ("Byte" & "Pixel")
  const miniOrbs = [];
  const miniOrbGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const miniOrbMat1 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.1 });
  const miniOrbMat2 = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 });

  const orb1 = new THREE.Mesh(miniOrbGeo, miniOrbMat1);
  const orb2 = new THREE.Mesh(miniOrbGeo, miniOrbMat2);
  robotRoot.add(orb1);
  robotRoot.add(orb2);

  miniOrbs.push({ mesh: orb1, speed: 1.4, radius: 1.9, heightOffset: 0.3, phase: 0 });
  miniOrbs.push({ mesh: orb2, speed: 1.1, radius: 2.2, heightOffset: -0.4, phase: Math.PI });

  // 5. STYLIZED ARENA FLOOR GRID WITH SOFT CYBER GLOW
  const floorGrid = new THREE.GridHelper(10, 20, 0x38bdf8, 0x0f1d30);
  floorGrid.position.y = -1.6;
  scene.add(floorGrid);

  const floorGlowRing = new THREE.Mesh(
    new THREE.RingGeometry(1.8, 1.88, 36),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.4 })
  );
  floorGlowRing.rotation.x = Math.PI / 2;
  floorGlowRing.position.y = -1.58;
  scene.add(floorGlowRing);

  // --- Interaction & Event Handling ---
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotationY = 0;
  let targetRotationX = 0;
  let mouseNormX = 0;
  let mouseNormY = 0;
  let isHovered = false;

  let happyHopTimer = 0;
  let spinAnimation = 0;

  // Change Mood API
  function setMood(mood) {
    currentMood = mood;
    if (mood === 'combat') {
      heartCoreInner.material = amberGlowMat;
      plasmaMesh.material.color.setHex(0xf59e0b);
      jetRing.material.color.setHex(0xf59e0b);
      haloMat.color.setHex(0xf59e0b);
    } else {
      heartCoreInner.material = cyanGlowMat;
      plasmaMesh.material.color.setHex(0x38bdf8);
      jetRing.material.color.setHex(0x38bdf8);
      haloMat.color.setHex(0x38bdf8);
    }
    drawFace();
    faceTexture.needsUpdate = true;
  }

  // Trigger Cute "Boop / Pet" Reaction
  function boopBot() {
    happyHopTimer = 1.0;
    spinAnimation = Math.PI * 2;
    const prevMood = currentMood;
    setMood('love');
    setTimeout(() => {
      setMood(prevMood);
    }, 2400);

    // Audio cue
    if (window.playTechSound) {
      window.playTechSound('success');
    }
  }

  // Mouse move listeners
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const isInside = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
    isHovered = isInside;

    mouseNormX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseNormY = (e.clientY / window.innerHeight - 0.5) * 2;
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
    targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX));

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Click / Tap to pet
  canvas.addEventListener('click', () => {
    boopBot();
  });

  // Touch Support
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
    targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX));

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });

  // Hook UI mood selector buttons
  const moodButtons = document.querySelectorAll('.cute-mood-btn, [data-bot-mood]');
  moodButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      moodButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mood = btn.getAttribute('data-bot-mood') || 'happy';
      setMood(mood);
      if (window.playTechSound) window.playTechSound('click');
    });
  });

  // Initial draw
  drawFace();
  faceTexture.needsUpdate = true;

  // Resize Handler
  const onResize = () => {
    if (!container) return;
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || 460;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  window.addEventListener('resize', onResize);

  // --- Master 60FPS Kinematic Animation Loop ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Natural blinking logic
    const now = Date.now();
    if (now > nextBlinkTime && !isBlinking) {
      isBlinking = true;
      blinkProgress = 0;
    }

    if (isBlinking) {
      blinkProgress += 0.14;
      const eyeScale = Math.max(0.08, 1 - blinkProgress * 1.5);
      leftEye3D.scale.y = eyeScale;
      rightEye3D.scale.y = eyeScale;
      drawFace();
      faceTexture.needsUpdate = true;
      if (blinkProgress >= 1.0) {
        isBlinking = false;
        blinkProgress = 0;
        leftEye3D.scale.y = 1.0;
        rightEye3D.scale.y = 1.0;
        nextBlinkTime = now + 2000 + Math.random() * 3000;
        drawFace();
        faceTexture.needsUpdate = true;
      }
    } else {
      leftEye3D.scale.y = 1.0;
      rightEye3D.scale.y = 1.0;
    }

    // Bouncy cute hover floating physics
    const baseHover = Math.sin(time * 2.2) * 0.12;
    let hopOffset = 0;
    if (happyHopTimer > 0) {
      happyHopTimer -= 0.03;
      hopOffset = Math.abs(Math.sin(happyHopTimer * Math.PI * 3)) * 0.4;
    }
    bobberGroup.position.y = baseHover + hopOffset;

    // Body soft tilt & side wobble
    bobberGroup.rotation.z = Math.sin(time * 1.5) * 0.04;

    // Head smoothly tracks mouse cursor
    const targetHeadYaw = mouseNormX * 0.55;
    const targetHeadPitch = -mouseNormY * 0.35;
    headGroup.rotation.y += (targetHeadYaw - headGroup.rotation.y) * 0.08;
    headGroup.rotation.x += (targetHeadPitch - headGroup.rotation.x) * 0.08;

    // Ears cute twitch
    const earWiggle = Math.sin(time * 4) * 0.08;
    leftEarGroup.rotation.z = -0.45 + earWiggle;
    rightEarGroup.rotation.z = 0.45 - earWiggle;

    // Floating hands playful animations
    if (currentMood === 'love' || happyHopTimer > 0) {
      // Clapping / celebrating hands
      leftHandGroup.position.set(-0.6 + Math.sin(time * 8) * 0.1, 0.2, 0.6);
      rightHandGroup.position.set(0.6 - Math.sin(time * 8) * 0.1, 0.2, 0.6);
      leftHandGroup.rotation.z = 0.6;
      rightHandGroup.rotation.z = -0.6;
    } else if (currentMood === 'combat') {
      // Combat guard pose
      leftHandGroup.position.set(-0.8, -0.05, 0.5);
      rightHandGroup.position.set(0.8, -0.05, 0.5);
      leftHandGroup.rotation.x = -0.4;
      rightHandGroup.rotation.x = -0.4;
    } else {
      // Normal friendly floating & waving
      leftHandGroup.position.set(
        -1.15 + Math.sin(time * 1.8) * 0.06,
        -0.1 + Math.cos(time * 2.2) * 0.08,
        0.2 + Math.sin(time * 1.2) * 0.05
      );
      rightHandGroup.position.set(
        1.15 - Math.sin(time * 1.8) * 0.06,
        -0.1 + Math.cos(time * 2.2 + 0.5) * 0.08 + (isHovered ? Math.sin(time * 6) * 0.2 : 0),
        0.2 + (isHovered ? 0.3 : 0)
      );
      if (isHovered) {
        rightHandGroup.rotation.z = Math.sin(time * 8) * 0.3; // Cute waving hand!
      } else {
        rightHandGroup.rotation.z = 0;
      }
    }

    // Plasma thruster pulsing flame
    const flameScale = 1.0 + Math.sin(time * 14) * 0.18 + (currentMood === 'combat' ? 0.4 : 0);
    plasmaMesh.scale.set(flameScale, flameScale * 1.1, flameScale);
    plasmaMesh.rotation.y = time * 3;

    // Heart core pulse
    const heartPulse = 1.0 + Math.sin(time * 3) * 0.08;
    heartCoreInner.scale.set(heartPulse, heartPulse, heartPulse);

    // Halo gentle floating
    haloMesh.rotation.z = time * 0.5;
    haloMesh.position.y = 1.18 + Math.sin(time * 2.5) * 0.04;

    // Companion mini-orbs orbiting
    miniOrbs.forEach(orb => {
      const angle = time * orb.speed + orb.phase;
      orb.mesh.position.set(
        Math.cos(angle) * orb.radius,
        Math.sin(angle * 2) * 0.3 + orb.heightOffset + baseHover,
        Math.sin(angle) * orb.radius
      );
      orb.mesh.rotation.y = time * 2;
    });

    // Floor glow ring rotating
    floorGlowRing.rotation.z = time * 0.2;

    // Smooth inertia rotation
    if (spinAnimation > 0) {
      spinAnimation -= 0.1;
      targetRotationY += 0.1;
    } else if (!isDragging) {
      targetRotationY += 0.003; // Gentle ambient rotation
    }

    robotRoot.rotation.y += (targetRotationY - robotRoot.rotation.y) * 0.07;
    robotRoot.rotation.x += (targetRotationX - robotRoot.rotation.x) * 0.07;

    renderer.render(scene, camera);
  }

  animate();

  return {
    setMood,
    boopBot
  };
}
