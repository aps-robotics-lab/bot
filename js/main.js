/**
 * ROBO KRITI 2026 - MASTER MAIN JAVASCRIPT
 * Modern Tech Festival Dynamics • 3D Tilt • Interactive Particles • Precision Audio
 */
import { initCampusScene } from '.three-campus.js';
import { initRaceShowcase } from '.three-event-showcase.js';

// --- Web Audio Micro-Feedback Synthesizer ---
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
}

export function playTechSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx?.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.03);
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.05);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    }
  } catch (e) {}
}

// --- Interactive 3D Card Tilt Engine ---
function init3DTilt() {
  const tiltElements = document.querySelectorAll('.tilt-card, .event-card, .editorial-quote-block, .contact-info-card, .contact-form-card, .reg-form-card, .tech-bracket-container');

  tiltElements.forEach((el) => {
    // Add glare element if missing
    if (!el.querySelector('.tilt-glare')) {
      const glare = document.createElement('div');
      glare.className = 'tilt-glare';
      el.appendChild(glare);
    }

    const glareEl = el.querySelector('.tilt-glare');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7; // Max tilt 7deg
      const rotateY = ((x - centerX) / centerX) * 7;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;

      if (glareEl) {
        glareEl.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      el.style.transition = 'transform 0.4s var(--ease-smooth), box-shadow 0.3s ease';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
    });
  });
}

// --- Interactive Ambient Circuit / Particle Visualizer Canvas ---
function initParticleField() {
  const canvas = document.getElementById('ambient-particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let mouse = { x: width / 2, y: height / 2, radius: 120 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 55);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 1.8 + 0.8;
      this.baseAlpha = Math.random() * 0.3 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse repulsion
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 1.5;
        this.y -= (dy / dist) * force * 1.5;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// --- Custom Precision Cursor Tracking ---
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const follower = document.getElementById('cursorFollower');
  if (!dot || !follower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function renderCursor() {
    followerX += (mouseX - followerX) * 0.2;
    followerY += (mouseY - followerY) * 0.2;
    follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .arena-zone-section, .tilt-card, .tech-bracket-container');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

// --- Navigation Controller ---
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const trigger = document.getElementById('mobileMenuTrigger');
  const overlay = document.getElementById('mobileNavOverlay');
  const soundBtn = document.getElementById('soundToggleBtn');

  // Scroll listener for nav glass state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle (Compact Dropdown, NOT Fullscreen blocker)
  if (trigger && overlay) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = overlay.classList.toggle('open');
      trigger.classList.toggle('open', isOpen);
      playTechSound('click');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (overlay.classList.contains('open') && !overlay.contains(e.target) && !trigger.contains(e.target)) {
        overlay.classList.remove('open');
        trigger.classList.remove('open');
      }
    });

    const mobileLinks = overlay.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        trigger.classList.remove('open');
        overlay.classList.remove('open');
      });
    });
  }

  // Sound toggle button
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
      if (soundEnabled) playTechSound('click');
    });
  }

  // Highlight active nav links
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (href === '/' && (currentPath === '/' || currentPath.endsWith('index.html'))))) {
      link.classList.add('active');
    }
  });

  // Sound listeners
  const buttons = document.querySelectorAll('button, a, input, select');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => playTechSound('hover'));
    btn.addEventListener('click', () => playTechSound('click'));
  });
}

// --- Discipline Arena Visualizers (Ultra-Cool Cybernetic 3D Dynamic Simulators) ---
function initArenaVisualizers() {
  // 1. Race Track Visualizer - High-Speed Turbo Rover & Holographic Circuit
  const raceCanvas = document.getElementById('canvas-race-zone');
  if (raceCanvas) {
    const ctx = raceCanvas.getContext('2d');
    let t = 0;
    const trails = [];
    const particles = [];
    let speedKmh = 68.4;
    let lapTime = 14.12;

    function drawRace() {
      const w = raceCanvas.width = raceCanvas.parentElement.clientWidth || 420;
      const h = raceCanvas.height = raceCanvas.parentElement.clientHeight || 420;
      ctx.clearRect(0, 0, w, h);

      // Deep Cyber Grid with Perspective
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const cx = w / 2;
      const cy = h / 2;
      const rx = w * 0.38;
      const ry = h * 0.28;

      // Track Outer Barrier Glow
      ctx.shadowColor = 'rgba(56, 189, 248, 0.25)';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx + 24, ry + 24, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Track Inner Barrier Glow
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx - 24, ry - 24, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Track Surface Asphalt Gradient
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx + 22, ry + 22, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.lineWidth = 44;
      ctx.stroke();

      // Apex Kerb Striping (Red & White Neon)
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
        const kx1 = cx + Math.cos(a) * (rx + 22);
        const ky1 = cy + Math.sin(a) * (ry + 22);
        const kx2 = cx + Math.cos(a) * (rx + 26);
        const ky2 = cy + Math.sin(a) * (ry + 26);
        ctx.beginPath();
        ctx.moveTo(kx1, ky1);
        ctx.lineTo(kx2, ky2);
        ctx.strokeStyle = (Math.floor(a * 10) % 2 === 0) ? '#f43f5e' : '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Track Center Line (Dashed Cyan Racing Line)
      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Start/Finish Line Transponder Gate
      const startX = cx + rx;
      const startY = cy;
      ctx.beginPath();
      ctx.moveTo(startX - 22, startY);
      ctx.lineTo(startX + 22, startY);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Vehicle Movement with variable speed
      t += 0.028;
      const carX = cx + Math.cos(t) * rx;
      const carY = cy + Math.sin(t) * ry;
      const angle = t + Math.PI / 2;

      speedKmh = 72.0 + Math.sin(t * 2) * 14.5;
      lapTime = (14.28 + (t % (Math.PI * 2)) * 1.5).toFixed(2);

      // Add exhaust particles & nitro trails
      trails.push({ x: carX, y: carY, angle, alpha: 1.0 });
      if (trails.length > 28) trails.shift();

      if (Math.random() > 0.3) {
        particles.push({
          x: carX - Math.cos(angle) * 16,
          y: carY - Math.sin(angle) * 16,
          vx: (Math.random() - 0.5) * 2 - Math.cos(angle) * 3,
          vy: (Math.random() - 0.5) * 2 - Math.sin(angle) * 3,
          life: 1.0,
          color: Math.random() > 0.4 ? '#38bdf8' : '#f59e0b'
        });
      }

      // Draw particle sparks
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.life, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Glowing Cyan Nitro Trails
      for (let i = 0; i < trails.length; i++) {
        trails[i].alpha *= 0.93;
        ctx.beginPath();
        ctx.arc(trails[i].x, trails[i].y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${trails[i].alpha * 0.5})`;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw "Apex-Predator" Cyber Race Rover
      ctx.save();
      ctx.translate(carX, carY);
      ctx.rotate(angle);

      // Twin Plasma Boosters
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(-7, -16);
      ctx.lineTo(-2, -16);
      ctx.lineTo(-4.5, -16 - Math.random() * 14 - 8);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(2, -16);
      ctx.lineTo(7, -16);
      ctx.lineTo(4.5, -16 - Math.random() * 14 - 8);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Carbon Fiber Rear Wing Spoiler
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-15, -16, 30, 4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-16, -18, 3, 6);
      ctx.fillRect(13, -18, 3, 6);

      // Aerodynamic Cyber Chassis Body
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-11, -12);
      ctx.lineTo(11, -12);
      ctx.lineTo(13, 8);
      ctx.lineTo(7, 18);
      ctx.lineTo(-7, 18);
      ctx.lineTo(-13, 8);
      ctx.closePath();
      ctx.fill();

      // Cyber Titanium Striping
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-4, -10, 8, 20);

      // High-Gloss Dark Blue Cockpit Visor
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.roundRect(-8, -4, 16, 12, 4);
      ctx.fill();

      // Front Laser Headlight Beams
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-10, 14, 4, 3);
      ctx.fillRect(6, 14, 4, 3);
      ctx.shadowBlur = 0;

      // Light Cones from Headlights
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.beginPath();
      ctx.moveTo(-8, 16);
      ctx.lineTo(-24, 60);
      ctx.lineTo(24, 60);
      ctx.lineTo(8, 16);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // HUD Dynamic Live Telemetry Bar
      ctx.fillStyle = 'rgba(10, 14, 24, 0.9)';
      ctx.fillRect(16, h - 38, w - 32, 26);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.strokeRect(16, h - 38, w - 32, 26);

      ctx.font = '11px IBM Plex Mono, monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`🏎️ SPEED: ${speedKmh.toFixed(1)} KM/H   ⏱️ LAP: ${lapTime}s   📍 G-FORCE: 2.3G`, 24, h - 21);

      requestAnimationFrame(drawRace);
    }
    requestAnimationFrame(drawRace);
  }

  // 2. War Arena Combat Visualizer - Armored Combat Octagon & Clash FX
  const warCanvas = document.getElementById('canvas-war-zone');
  if (warCanvas) {
    const ctx = warCanvas.getContext('2d');
    let angle = 0;
    const sparks = [];
    const shockwaves = [];
    let bot1Hp = 94;
    let bot2Hp = 88;

    function drawWar() {
      const w = warCanvas.width = warCanvas.parentElement.clientWidth || 420;
      const h = warCanvas.height = warCanvas.parentElement.clientHeight || 420;
      ctx.clearRect(0, 0, w, h);

      angle += 0.032;
      const cx = w / 2;
      const cy = h / 2;

      // Combat Octagon Arena Boundary
      const arenaR = Math.min(w, h) * 0.38;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI * 2) / 8;
        const x = cx + Math.cos(a) * arenaR;
        const y = cy + Math.sin(a) * arenaR;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(248, 113, 113, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Steel Floor Grate Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = cx - arenaR; x < cx + arenaR; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, cy - arenaR);
        ctx.lineTo(x, cy + arenaR);
        ctx.stroke();
      }

      // Danger Hazard Pit Center Ring
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Dynamic Combat Orbit Positioning
      const b1x = cx + Math.cos(angle) * (arenaR * 0.52);
      const b1y = cy + Math.sin(angle * 1.6) * (arenaR * 0.42);

      const b2x = cx - Math.cos(angle) * (arenaR * 0.52);
      const b2y = cy - Math.sin(angle * 1.6) * (arenaR * 0.42);

      // Distance & Collision Trigger
      const dist = Math.hypot(b1x - b2x, b1y - b2y);
      if (dist < 46 && Math.random() > 0.3) {
        // Trigger Shockwave
        shockwaves.push({
          x: (b1x + b2x) / 2,
          y: (b1y + b2y) / 2,
          r: 6,
          alpha: 1.0
        });

        // Spawn explosive kinetic sparks
        for (let i = 0; i < 6; i++) {
          sparks.push({
            x: (b1x + b2x) / 2,
            y: (b1y + b2y) / 2,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1.0,
            color: Math.random() > 0.5 ? '#38bdf8' : '#f59e0b'
          });
        }

        bot1Hp = Math.max(70, bot1Hp - 0.1);
        bot2Hp = Math.max(65, bot2Hp - 0.15);
      }

      // Draw Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.r += 2.5;
        sw.alpha -= 0.05;
        if (sw.alpha <= 0) {
          shockwaves.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(248, 113, 113, ${sw.alpha * 0.8})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.04;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5 * s.life, 0, Math.PI * 2);
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Bot 1: Cyan Kinetic Spinner ("VALKYRIE-01")
      ctx.save();
      ctx.translate(b1x, b1y);
      ctx.rotate(angle * 2.5);

      // Chassis
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-16, -16, 32, 32, 6);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Spinning High-RPM Kinetic Blade
      const bladeAngle = angle * 14;
      ctx.save();
      ctx.rotate(bladeAngle);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.fillRect(-22, -4, 44, 8);
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(-20, 0, 5, 0, Math.PI * 2);
      ctx.arc(20, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Core Glowing Arc Reactor
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw Bot 2: Armored Titanium Wedge ("TITAN-RAM")
      ctx.save();
      ctx.translate(b2x, b2y);
      ctx.rotate(-angle * 1.8);

      // Heavy Tank Treads
      ctx.fillStyle = '#334155';
      ctx.fillRect(-18, -18, 8, 36);
      ctx.fillRect(10, -18, 8, 36);

      // Armored Chassis
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-10, -14);
      ctx.lineTo(10, -14);
      ctx.lineTo(14, 14);
      ctx.lineTo(-14, 14);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Forward Steel Kinetic Wedge
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(-12, 14);
      ctx.lineTo(12, 14);
      ctx.lineTo(0, 24);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // HUD Dynamic Live Telemetry Bar
      ctx.fillStyle = 'rgba(10, 14, 24, 0.9)';
      ctx.fillRect(16, h - 38, w - 32, 26);
      ctx.strokeStyle = 'rgba(248, 113, 113, 0.3)';
      ctx.strokeRect(16, h - 38, w - 32, 26);

      ctx.font = '11px IBM Plex Mono, monospace';
      ctx.fillStyle = '#f87171';
      ctx.fillText(`⚔️ SPINNER: 8,400 RPM   ⚡ IMPACT: 19.4G   🛡️ ARMOR: ${bot1Hp.toFixed(0)}% vs ${bot2Hp.toFixed(0)}%`, 24, h - 21);

      requestAnimationFrame(drawWar);
    }
    requestAnimationFrame(drawWar);
  }

  // 3. Tug of War Tension Visualizer - Heavy Torque Crawlers & Crackling Energy Cable
  const tugCanvas = document.getElementById('canvas-tug-zone');
  if (tugCanvas) {
    const ctx = tugCanvas.getContext('2d');
    let phase = 0;
    const lightningArcs = [];

    function drawTug() {
      const w = tugCanvas.width = tugCanvas.parentElement.clientWidth || 420;
      const h = tugCanvas.height = tugCanvas.parentElement.clientHeight || 420;
      ctx.clearRect(0, 0, w, h);

      phase += 0.038;
      const offset = Math.sin(phase) * 28;
      const cy = h / 2;

      // Platform Grid & Tension Deck
      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      ctx.fillRect(20, cy - 60, w - 40, 120);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, cy - 60, w - 40, 120);

      // Center High-Tension Threshold Line
      ctx.beginPath();
      ctx.moveTo(w / 2, cy - 60);
      ctx.lineTo(w / 2, cy + 60);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      const bot1X = 64 + offset * 0.35;
      const bot2X = w - 64 + offset * 0.35;

      // Draw Supercharged Glowing Tension Cable
      ctx.beginPath();
      ctx.moveTo(bot1X + 22, cy);
      const sagY = cy + Math.sin(phase * 3) * 4;
      ctx.quadraticCurveTo(w / 2 + offset, sagY, bot2X - 22, cy);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Center Knot & Digital Strain Marker
      const knotX = w / 2 + offset;
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(knotX, sagY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Electrical Plasma Arcs Crackling along cable
      if (Math.random() > 0.4) {
        lightningArcs.push({
          x: knotX + (Math.random() - 0.5) * 60,
          y: sagY + (Math.random() - 0.5) * 16,
          life: 1.0
        });
      }

      for (let i = lightningArcs.length - 1; i >= 0; i--) {
        const arc = lightningArcs[i];
        arc.life -= 0.15;
        if (arc.life <= 0) {
          lightningArcs.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(56, 189, 248, ${arc.life})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(arc.x, arc.y);
        ctx.lineTo(arc.x + (Math.random() - 0.5) * 12, arc.y + (Math.random() - 0.5) * 12);
        ctx.stroke();
      }

      // Draw Left Crawler (High Torque Blue Unit)
      ctx.save();
      ctx.translate(bot1X, cy);
      // Heavy Tank Treads
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-22, -18, 44, 8);
      ctx.fillRect(-22, 10, 44, 8);
      // Tread Wheels
      ctx.fillStyle = '#38bdf8';
      for (let tx = -16; tx <= 16; tx += 8) {
        ctx.beginPath();
        ctx.arc(tx, -14, 3, 0, Math.PI * 2);
        ctx.arc(tx, 14, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      // Reinforced Heavy Chassis
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(-18, -10, 36, 20, 4);
      ctx.fill();
      // Glowing Battery Cell
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-12, -6, 24, 12);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('>TORQ<', -17, 3);
      ctx.restore();

      // Draw Right Crawler (High Torque Gold Unit)
      ctx.save();
      ctx.translate(bot2X, cy);
      // Heavy Tank Treads
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-22, -18, 44, 8);
      ctx.fillRect(-22, 10, 44, 8);
      // Tread Wheels
      ctx.fillStyle = '#f59e0b';
      for (let tx = -16; tx <= 16; tx += 8) {
        ctx.beginPath();
        ctx.arc(tx, -14, 3, 0, Math.PI * 2);
        ctx.arc(tx, 14, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      // Reinforced Heavy Chassis
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(-18, -10, 36, 20, 4);
      ctx.fill();
      // Cockpit
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-12, -6, 24, 12);
      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px monospace';
      ctx.fillText('>FORCE<', -18, 3);
      ctx.restore();

      // HUD Dynamic Live Telemetry Bar
      const tensionN = (2150 + Math.abs(offset) * 22).toFixed(0);
      ctx.fillStyle = 'rgba(10, 14, 24, 0.9)';
      ctx.fillRect(16, h - 38, w - 32, 26);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.strokeRect(16, h - 38, w - 32, 26);

      ctx.font = '11px IBM Plex Mono, monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`💪 LOAD: ${tensionN} N   ⚙️ TORQUE: 48.6 N·m   📍 TRACTION: μ 0.98`, 24, h - 21);

      requestAnimationFrame(drawTug);
    }
    requestAnimationFrame(drawTug);
  }

  // 4. Soccer Pitch Visualizer - Holonomic Omni-Striker Bot & Precision Shooting
  const soccerCanvas = document.getElementById('canvas-soccer-zone');
  if (soccerCanvas) {
    const ctx = soccerCanvas.getContext('2d');
    let botX = 90;
    let botY = 160;
    let ballX = 150;
    let ballY = 160;
    let ballVx = 3.6;
    let ballVy = 1.8;
    const goalBursts = [];
    let goalsCount = 4;

    function drawSoccer() {
      const w = soccerCanvas.width = soccerCanvas.parentElement.clientWidth || 420;
      const h = soccerCanvas.height = soccerCanvas.parentElement.clientHeight || 420;
      ctx.clearRect(0, 0, w, h);

      // Synthetic Turf Background Grid
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(24, 24, w - 48, h - 48);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(24, 24, w - 48, h - 48);

      // Pitch Center Circle & Halfway Line
      ctx.beginPath();
      ctx.moveTo(w / 2, 24);
      ctx.lineTo(w / 2, h - 24);
      ctx.arc(w / 2, h / 2, 38, 0, Math.PI * 2);
      ctx.stroke();

      // Right Goal Net Box (Glowing Emerald)
      const goalTop = h / 2 - 38;
      const goalBottom = h / 2 + 38;
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(w - 24, goalTop, 16, 76);

      // Ball Trajectory Prediction Line
      ctx.beginPath();
      ctx.setLineDash([4, 6]);
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballX + ballVx * 18, ballY + ballVy * 18);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.stroke();
      ctx.setLineDash([]);

      // Ball Movement Physics
      ballX += ballVx;
      ballY += ballVy;

      if (ballY < 40 || ballY > h - 40) ballVy *= -1;
      if (ballX < 40) ballVx *= -1;

      // Goal Scored Detection!
      if (ballX > w - 30 && ballY > goalTop && ballY < goalBottom) {
        ballVx = -4.2;
        goalsCount++;

        // Explosive Goal Spark Burst
        for (let i = 0; i < 18; i++) {
          goalBursts.push({
            x: w - 24,
            y: ballY,
            vx: (Math.random() - 1.2) * 5,
            vy: (Math.random() - 0.5) * 5,
            life: 1.0,
            color: Math.random() > 0.5 ? '#34d399' : '#38bdf8'
          });
        }
      }

      // Draw Goal Bursts
      for (let i = goalBursts.length - 1; i >= 0; i--) {
        const gb = goalBursts[i];
        gb.x += gb.vx;
        gb.y += gb.vy;
        gb.life -= 0.04;
        if (gb.life <= 0) {
          goalBursts.splice(i, 1);
          continue;
        }
        ctx.fillStyle = gb.color;
        ctx.shadowColor = gb.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(gb.x, gb.y, 3 * gb.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Striker Bot Follows Ball smoothly
      botX += (ballX - 36 - botX) * 0.09;
      botY += (ballY - botY) * 0.09;

      // Draw "Striker-X" Omni Bot
      ctx.save();
      ctx.translate(botX, botY);

      // Omni-Wheels (3-Point Holonomic Configuration)
      ctx.fillStyle = '#334155';
      ctx.fillRect(-16, -14, 6, 28);
      ctx.fillRect(10, -14, 6, 28);

      // Spherical Cyber Chassis
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.stroke();

      // High-RPM Dribbler Roller Roller (Front)
      ctx.fillStyle = '#34d399';
      ctx.fillRect(12, -8, 4, 16);

      // LED Targeting Visor
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#34d399';
      ctx.font = '10px monospace';
      ctx.fillText('⚡ ⚡', -7, 4);

      ctx.restore();

      // Draw High-Tech Glowing Cyber Soccer Ball
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // HUD Dynamic Live Telemetry Bar
      ctx.fillStyle = 'rgba(10, 14, 24, 0.9)';
      ctx.fillRect(16, h - 38, w - 32, 26);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
      ctx.strokeRect(16, h - 38, w - 32, 26);

      ctx.font = '11px IBM Plex Mono, monospace';
      ctx.fillStyle = '#34d399';
      ctx.fillText(`⚽ OMNI-STRIKER // VELOCITY: 4.2 M/S   🎯 ACCURACY: 99.2%   🏆 GOALS: ${goalsCount}`, 24, h - 21);

      requestAnimationFrame(drawSoccer);
    }
    requestAnimationFrame(drawSoccer);
  }
}

// --- Initialize All Modules ---
document.addEventListener('DOMContentLoaded', () => {
  const curtain = document.getElementById('init-curtain');
  if (curtain) {
    setTimeout(() => {
      curtain.classList.add('loaded');
    }, 300);
  }

  initCustomCursor();
  initNavigation();
  init3DTilt();
  initParticleField();
  initArenaVisualizers();
  initRaceShowcase('race-visual-stage');

  // Initialize 3D Campus Scene
  if (document.getElementById('campus-3d-canvas')) {
    initCampusScene('campus-3d-canvas');
  }
});
