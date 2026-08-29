/**
 * ROBO KRITI 2026 - MASTER MAIN JAVASCRIPT
 * Modern Tech Festival Dynamics
 * 3D Tilt • Interactive Particles • Precision Audio
 *
 * IMPORTANT:
 * - Robo Race is handled ONLY by three-event-showcase.js
 * - Legacy Robo Race canvas code has been removed
 * - Firebase and other event visualizers are untouched
 */

import { initCampusScene } from './three-campus.js';
import { initRaceShowcase } from './three-event-showcase.js';


// ============================================================
// GLOBAL STATE
// ============================================================

let audioCtx = null;
let soundEnabled = true;


// ============================================================
// WEB AUDIO MICRO-FEEDBACK SYNTHESIZER
// ============================================================

function initAudio() {
  if (audioCtx) return audioCtx;

  const AudioCtxClass =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!AudioCtxClass) {
    return null;
  }

  try {
    audioCtx = new AudioCtxClass();
    return audioCtx;
  } catch (error) {
    audioCtx = null;
    return null;
  }
}


export function playTechSound(type = 'click') {
  if (!soundEnabled) return;

  try {
    const ctx = initAudio();

    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    // -------------------------
    // HOVER
    // -------------------------

    if (type === 'hover') {

      osc.type = 'sine';

      osc.frequency.setValueAtTime(
        650,
        now
      );

      osc.frequency.exponentialRampToValueAtTime(
        950,
        now + 0.03
      );

      gain.gain.setValueAtTime(
        0.012,
        now
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.03
      );

      osc.start(now);
      osc.stop(now + 0.03);
    }

    // -------------------------
    // CLICK
    // -------------------------

    else if (type === 'click') {

      osc.type = 'sine';

      osc.frequency.setValueAtTime(
        520,
        now
      );

      osc.frequency.exponentialRampToValueAtTime(
        260,
        now + 0.05
      );

      gain.gain.setValueAtTime(
        0.035,
        now
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.05
      );

      osc.start(now);
      osc.stop(now + 0.05);
    }

    // -------------------------
    // SUCCESS
    // -------------------------

    else if (type === 'success') {

      osc.type = 'sine';

      osc.frequency.setValueAtTime(
        523.25,
        now
      );

      osc.frequency.setValueAtTime(
        659.25,
        now + 0.08
      );

      osc.frequency.setValueAtTime(
        783.99,
        now + 0.16
      );

      gain.gain.setValueAtTime(
        0.04,
        now
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.28
      );

      osc.start(now);
      osc.stop(now + 0.28);
    }

  } catch (error) {
    // Audio is optional.
    // Never allow audio errors to break the website.
  }
}


// ============================================================
// INTERACTIVE 3D TILT ENGINE
// ============================================================

function init3DTilt() {

  const tiltElements =
    document.querySelectorAll(
      '.tilt-card, ' +
      '.event-card, ' +
      '.editorial-quote-block, ' +
      '.contact-info-card, ' +
      '.contact-form-card, ' +
      '.reg-form-card, ' +
      '.tech-bracket-container'
    );

  if (!tiltElements.length) return;


  tiltElements.forEach((el) => {

    if (
      el.dataset.tiltInitialized === 'true'
    ) {
      return;
    }

    el.dataset.tiltInitialized = 'true';


    // -------------------------
    // CREATE GLARE
    // -------------------------

    if (!el.querySelector('.tilt-glare')) {

      const glare =
        document.createElement('div');

      glare.className = 'tilt-glare';

      glare.setAttribute(
        'aria-hidden',
        'true'
      );

      el.appendChild(glare);
    }


    const glareEl =
      el.querySelector('.tilt-glare');


    // -------------------------
    // MOUSE MOVE
    // -------------------------

    el.addEventListener(
      'mousemove',
      (e) => {

        const rect =
          el.getBoundingClientRect();

        if (
          !rect.width ||
          !rect.height
        ) {
          return;
        }


        const x =
          e.clientX - rect.left;

        const y =
          e.clientY - rect.top;


        const centerX =
          rect.width / 2;

        const centerY =
          rect.height / 2;


        const rotateX =
          ((y - centerY) / centerY) *
          -7;

        const rotateY =
          ((x - centerX) / centerX) *
          7;


        el.style.transition =
          'none';


        el.style.transform =
          `perspective(1000px) ` +
          `rotateX(${rotateX.toFixed(2)}deg) ` +
          `rotateY(${rotateY.toFixed(2)}deg) ` +
          `scale3d(1.015, 1.015, 1.015)`;


        if (glareEl) {

          glareEl.style.background =
            `radial-gradient(` +
            `circle at ${x}px ${y}px, ` +
            `rgba(255,255,255,0.15) 0%, ` +
            `transparent 60%)`;
        }

      },
      {
        passive: true
      }
    );


    // -------------------------
    // MOUSE LEAVE
    // -------------------------

    el.addEventListener(
      'mouseleave',
      () => {

        el.style.transition =
          'transform 0.4s var(--ease-smooth), ' +
          'box-shadow 0.3s ease';


        el.style.transform =
          'perspective(1000px) ' +
          'rotateX(0deg) ' +
          'rotateY(0deg) ' +
          'scale3d(1, 1, 1)';


        if (glareEl) {
          glareEl.style.background =
            'none';
        }

      }
    );

  });
}


// ============================================================
// AMBIENT CIRCUIT / PARTICLE FIELD
// ============================================================

function initParticleField() {

  const canvas =
    document.getElementById(
      'ambient-particles-canvas'
    );

  if (!canvas) return;

  if (
    canvas.dataset.particlesInitialized ===
    'true'
  ) {
    return;
  }


  const ctx =
    canvas.getContext('2d');

  if (!ctx) return;


  canvas.dataset.particlesInitialized =
    'true';


  let width = 0;
  let height = 0;


  const mouse = {
    x: 0,
    y: 0,
    radius: 120
  };


  // -------------------------
  // RESIZE
  // -------------------------

  function resizeCanvas() {

    const dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );


    width =
      window.innerWidth;

    height =
      window.innerHeight;


    canvas.width =
      Math.floor(width * dpr);

    canvas.height =
      Math.floor(height * dpr);


    canvas.style.width =
      `${width}px`;

    canvas.style.height =
      `${height}px`;


    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );


    mouse.x =
      width / 2;

    mouse.y =
      height / 2;
  }


  resizeCanvas();


  window.addEventListener(
    'resize',
    resizeCanvas,
    {
      passive: true
    }
  );


  // -------------------------
  // MOUSE
  // -------------------------

  window.addEventListener(
    'mousemove',
    (e) => {

      mouse.x =
        e.clientX;

      mouse.y =
        e.clientY;

    },
    {
      passive: true
    }
  );


  // -------------------------
  // PARTICLE COUNT
  // -------------------------

  const particleCount =
    Math.min(
      Math.max(
        Math.floor(
          (width * height) /
          18000
        ),
        20
      ),
      55
    );


  const particles = [];


  // -------------------------
  // PARTICLE CLASS
  // -------------------------

  class Particle {

    constructor() {

      this.x =
        Math.random() *
        width;

      this.y =
        Math.random() *
        height;


      this.vx =
        (Math.random() - 0.5) *
        0.4;

      this.vy =
        (Math.random() - 0.5) *
        0.4;


      this.size =
        Math.random() * 1.8 +
        0.8;


      this.baseAlpha =
        Math.random() * 0.3 +
        0.15;
    }


    update() {

      this.x += this.vx;
      this.y += this.vy;


      if (this.x < 0) {
        this.x = width;
      }

      if (this.x > width) {
        this.x = 0;
      }


      if (this.y < 0) {
        this.y = height;
      }

      if (this.y > height) {
        this.y = 0;
      }


      const dx =
        mouse.x - this.x;

      const dy =
        mouse.y - this.y;


      const distSq =
        dx * dx +
        dy * dy;


      if (
        distSq > 0 &&
        distSq <
        mouse.radius *
        mouse.radius
      ) {

        const dist =
          Math.sqrt(distSq);


        const force =
          (mouse.radius - dist) /
          mouse.radius;


        this.x -=
          (dx / dist) *
          force *
          1.5;

        this.y -=
          (dy / dist) *
          force *
          1.5;
      }

    }


    draw() {

      ctx.beginPath();


      ctx.arc(
        this.x,
        this.y,
        this.size,
        0,
        Math.PI * 2
      );


      ctx.fillStyle =
        `rgba(56, 189, 248, ${this.baseAlpha})`;


      ctx.fill();
    }

  }


  // -------------------------
  // CREATE PARTICLES
  // -------------------------

  for (
    let i = 0;
    i < particleCount;
    i++
  ) {

    particles.push(
      new Particle()
    );

  }


  // -------------------------
  // ANIMATION
  // -------------------------

  function animate() {

    ctx.clearRect(
      0,
      0,
      width,
      height
    );


    // -----------------------
    // CONNECTIONS
    // -----------------------

    for (
      let i = 0;
      i < particles.length;
      i++
    ) {

      for (
        let j = i + 1;
        j < particles.length;
        j++
      ) {

        const dx =
          particles[i].x -
          particles[j].x;

        const dy =
          particles[i].y -
          particles[j].y;


        const distSq =
          dx * dx +
          dy * dy;


        if (
          distSq <
          130 * 130
        ) {

          const dist =
            Math.sqrt(distSq);


          ctx.beginPath();


          ctx.moveTo(
            particles[i].x,
            particles[i].y
          );


          ctx.lineTo(
            particles[j].x,
            particles[j].y
          );


          ctx.strokeStyle =
            `rgba(56,189,248,${0.12 *
              (1 - dist / 130)})`;


          ctx.lineWidth =
            0.8;


          ctx.stroke();
        }

      }

    }


    // -----------------------
    // PARTICLES
    // -----------------------

    particles.forEach(
      (particle) => {

        particle.update();
        particle.draw();

      }
    );


    requestAnimationFrame(
      animate
    );
  }


  requestAnimationFrame(
    animate
  );
}


// ============================================================
// CUSTOM PRECISION CURSOR
// ============================================================

function initCustomCursor() {

  const dot =
    document.getElementById(
      'cursorDot'
    );

  const follower =
    document.getElementById(
      'cursorFollower'
    );


  if (!dot || !follower) {
    return;
  }


  // -------------------------
  // TOUCH DEVICES
  // -------------------------

  if (
    window.matchMedia(
      '(pointer: coarse)'
    ).matches
  ) {

    dot.style.display =
      'none';

    follower.style.display =
      'none';

    return;
  }


  let mouseX =
    window.innerWidth / 2;

  let mouseY =
    window.innerHeight / 2;


  let followerX =
    mouseX;

  let followerY =
    mouseY;


  // -------------------------
  // MOUSE
  // -------------------------

  window.addEventListener(
    'mousemove',
    (e) => {

      mouseX =
        e.clientX;

      mouseY =
        e.clientY;


      dot.style.transform =
        `translate(${mouseX}px, ${mouseY}px) ` +
        `translate(-50%, -50%)`;

    },
    {
      passive: true
    }
  );


  // -------------------------
  // FOLLOWER ANIMATION
  // -------------------------

  function renderCursor() {

    followerX +=
      (mouseX - followerX) *
      0.2;

    followerY +=
      (mouseY - followerY) *
      0.2;


    follower.style.transform =
      `translate(${followerX}px, ${followerY}px) ` +
      `translate(-50%, -50%)`;


    requestAnimationFrame(
      renderCursor
    );
  }


  requestAnimationFrame(
    renderCursor
  );


  // -------------------------
  // INTERACTIVE ELEMENTS
  // -------------------------

  const interactiveElements =
    document.querySelectorAll(
      'a, button, input, select, textarea, ' +
      '.arena-zone-section, ' +
      '.tilt-card, ' +
      '.tech-bracket-container'
    );


  interactiveElements.forEach(
    (el) => {

      el.addEventListener(
        'mouseenter',
        () => {

          document.body.classList.add(
            'cursor-hover'
          );

        }
      );


      el.addEventListener(
        'mouseleave',
        () => {

          document.body.classList.remove(
            'cursor-hover'
          );

        }
      );

    }
  );
}


// ============================================================
// NAVIGATION CONTROLLER
// ============================================================

function initNavigation() {

  const nav =
    document.getElementById(
      'main-nav'
    );

  const trigger =
    document.getElementById(
      'mobileMenuTrigger'
    );

  const overlay =
    document.getElementById(
      'mobileNavOverlay'
    );

  const soundBtn =
    document.getElementById(
      'soundToggleBtn'
    );


  // ==========================================================
  // SCROLL STATE
  // ==========================================================

  window.addEventListener(
    'scroll',
    () => {

      if (!nav) return;


      nav.classList.toggle(
        'scrolled',
        window.scrollY > 30
      );

    },
    {
      passive: true
    }
  );


  // ==========================================================
  // MOBILE MENU
  // ==========================================================

  if (
    trigger &&
    overlay
  ) {

    trigger.addEventListener(
      'click',
      (e) => {

        e.stopPropagation();


        const isOpen =
          overlay.classList.toggle(
            'open'
          );


        trigger.classList.toggle(
          'open',
          isOpen
        );


        playTechSound(
          'click'
        );

      }
    );


    // -----------------------
    // CLOSE ON OUTSIDE CLICK
    // -----------------------

    document.addEventListener(
      'click',
      (e) => {

        if (
          overlay.classList.contains(
            'open'
          ) &&
          !overlay.contains(
            e.target
          ) &&
          !trigger.contains(
            e.target
          )
        ) {

          overlay.classList.remove(
            'open'
          );

          trigger.classList.remove(
            'open'
          );
        }

      }
    );


    // -----------------------
    // CLOSE AFTER NAVIGATION
    // -----------------------

    overlay
      .querySelectorAll('a')
      .forEach(
        (link) => {

          link.addEventListener(
            'click',
            () => {

              overlay.classList.remove(
                'open'
              );

              trigger.classList.remove(
                'open'
              );

            }
          );

        }
      );
  }


  // ==========================================================
  // SOUND TOGGLE
  // ==========================================================

  if (soundBtn) {

    soundBtn.addEventListener(
      'click',
      () => {

        soundEnabled =
          !soundEnabled;


        soundBtn.textContent =
          soundEnabled
            ? '🔊'
            : '🔇';


        soundBtn.setAttribute(
          'aria-label',
          soundEnabled
            ? 'Disable interface sounds'
            : 'Enable interface sounds'
        );


        if (soundEnabled) {
          playTechSound(
            'click'
          );
        }

      }
    );

  }


  // ==========================================================
  // ACTIVE NAVIGATION
  // ==========================================================

  const currentPath =
    window.location.pathname;


  const navLinks =
    document.querySelectorAll(
      '.nav-link, .mobile-nav-link'
    );


  navLinks.forEach(
    (link) => {

      const href =
        link.getAttribute(
          'href'
        );


      if (!href) return;


      let isActive =
        false;


      // -----------------------
      // HOME
      // -----------------------

      if (href === '/') {

        isActive =
          currentPath === '/' ||
          currentPath.endsWith(
            '/index.html'
          );

      }

      // -----------------------
      // OTHER PAGES
      // -----------------------

      else {

        const cleanHref =
          href
            .split('#')[0]
            .split('?')[0];


        isActive =
          currentPath.endsWith(
            cleanHref
          );
      }


      if (isActive) {

        link.classList.add(
          'active'
        );

      }

    }
  );


  // ==========================================================
  // INTERFACE SOUND LISTENERS
  // ==========================================================

  const buttons =
    document.querySelectorAll(
      'button, a, input, select'
    );


  buttons.forEach(
    (btn) => {

      btn.addEventListener(
        'mouseenter',
        () => {

          playTechSound(
            'hover'
          );

        }
      );


      btn.addEventListener(
        'click',
        () => {

          playTechSound(
            'click'
          );

        }
      );

    }
  );
}


// ============================================================
// DISCIPLINE ARENA VISUALIZERS
//
// Robo Race is NOT initialized here.
//
// Robo Race:
//     initRaceShowcase('race-visual-stage')
//
// Other events:
//     Robo War
//     Robo Tug of War
//     Robo Soccer
// ============================================================

function initArenaVisualizers() {


  // ==========================================================
  // 1. ROBO WAR
  // ==========================================================

  const warCanvas =
    document.getElementById(
      'canvas-war-zone'
    );


  if (warCanvas) {

    const ctx =
      warCanvas.getContext(
        '2d'
      );


    if (!ctx) return;


    let angle = 0;

    const sparks = [];

    const shockwaves = [];


    let bot1Hp = 94;

    let bot2Hp = 88;


    function drawWar() {

      const parent =
        warCanvas.parentElement;


      if (!parent) return;


      const w =
        warCanvas.width =
        parent.clientWidth ||
        420;


      const h =
        warCanvas.height =
        parent.clientHeight ||
        420;


      ctx.clearRect(
        0,
        0,
        w,
        h
      );


      angle += 0.032;


      const cx =
        w / 2;

      const cy =
        h / 2;


      const arenaR =
        Math.min(
          w,
          h
        ) * 0.38;


      // -----------------------
      // ARENA
      // -----------------------

      ctx.beginPath();


      for (
        let i = 0;
        i < 8;
        i++
      ) {

        const a =
          (i *
            Math.PI *
            2) /
          8;


        const x =
          cx +
          Math.cos(a) *
          arenaR;


        const y =
          cy +
          Math.sin(a) *
          arenaR;


        if (i === 0) {

          ctx.moveTo(
            x,
            y
          );

        } else {

          ctx.lineTo(
            x,
            y
          );

        }

      }


      ctx.closePath();


      ctx.fillStyle =
        'rgba(15,23,42,0.6)';


      ctx.fill();


      ctx.strokeStyle =
        'rgba(248,113,113,0.4)';


      ctx.lineWidth =
        2.5;


      ctx.shadowColor =
        '#f43f5e';


      ctx.shadowBlur =
        12;


      ctx.stroke();


      ctx.shadowBlur =
        0;


      // -----------------------
      // FLOOR GRATE
      // -----------------------

      ctx.strokeStyle =
        'rgba(255,255,255,0.04)';


      ctx.lineWidth =
        1;


      for (
        let x =
          cx - arenaR;
        x <
          cx + arenaR;
        x += 24
      ) {

        ctx.beginPath();

        ctx.moveTo(
          x,
          cy - arenaR
        );

        ctx.lineTo(
          x,
          cy + arenaR
        );

        ctx.stroke();

      }


      // -----------------------
      // CENTER HAZARD RING
      // -----------------------

      ctx.beginPath();


      ctx.arc(
        cx,
        cy,
        32,
        0,
        Math.PI * 2
      );


      ctx.strokeStyle =
        'rgba(245,158,11,0.3)';


      ctx.setLineDash([
        6,
        6
      ]);


      ctx.lineWidth =
        2;


      ctx.stroke();


      ctx.setLineDash([]);


      // -----------------------
      // BOT POSITIONS
      // -----------------------

      const b1x =
        cx +
        Math.cos(angle) *
        (arenaR * 0.52);


      const b1y =
        cy +
        Math.sin(angle * 1.6) *
        (arenaR * 0.42);


      const b2x =
        cx -
        Math.cos(angle) *
        (arenaR * 0.52);


      const b2y =
        cy -
        Math.sin(angle * 1.6) *
        (arenaR * 0.42);


      const dist =
        Math.hypot(
          b1x - b2x,
          b1y - b2y
        );


      // -----------------------
      // COLLISION
      // -----------------------

      if (
        dist < 46 &&
        Math.random() > 0.3
      ) {

        const impactX =
          (b1x + b2x) /
          2;


        const impactY =
          (b1y + b2y) /
          2;


        shockwaves.push({
          x: impactX,
          y: impactY,
          r: 6,
          alpha: 1
        });


        for (
          let i = 0;
          i < 6;
          i++
        ) {

          sparks.push({
            x: impactX,
            y: impactY,
            vx:
              (Math.random() - 0.5) *
              8,
            vy:
              (Math.random() - 0.5) *
              8,
            life: 1,
            color:
              Math.random() > 0.5
                ? '#38bdf8'
                : '#f59e0b'
          });

        }


        bot1Hp =
          Math.max(
            70,
            bot1Hp - 0.1
          );


        bot2Hp =
          Math.max(
            65,
            bot2Hp - 0.15
          );
      }


      // -----------------------
      // SHOCKWAVES
      // -----------------------

      for (
        let i =
          shockwaves.length - 1;
        i >= 0;
        i--
      ) {

        const sw =
          shockwaves[i];


        sw.r +=
          2.5;


        sw.alpha -=
          0.05;


        if (
          sw.alpha <= 0
        ) {

          shockwaves.splice(
            i,
            1
          );

          continue;
        }


        ctx.beginPath();


        ctx.arc(
          sw.x,
          sw.y,
          sw.r,
          0,
          Math.PI * 2
        );


        ctx.strokeStyle =
          `rgba(248,113,113,${sw.alpha * 0.8})`;


        ctx.lineWidth =
          2;


        ctx.stroke();
      }


      // -----------------------
      // SPARKS
      // -----------------------

      for (
        let i =
          sparks.length - 1;
        i >= 0;
        i--
      ) {

        const s =
          sparks[i];


        s.x +=
          s.vx;

        s.y +=
          s.vy;


        s.life -=
          0.04;


        if (
          s.life <= 0
        ) {

          sparks.splice(
            i,
            1
          );

          continue;
        }


        ctx.fillStyle =
          s.color;


        ctx.beginPath();


        ctx.arc(
          s.x,
          s.y,
          2.5 * s.life,
          0,
          Math.PI * 2
        );


        ctx.shadowColor =
          s.color;


        ctx.shadowBlur =
          6;


        ctx.fill();


        ctx.shadowBlur =
          0;
      }


      // -----------------------
      // BOT 1
      // -----------------------

      ctx.save();


      ctx.translate(
        b1x,
        b1y
      );


      ctx.rotate(
        angle * 2.5
      );


      ctx.fillStyle =
        '#0f172a';


      ctx.beginPath();


      ctx.roundRect(
        -16,
        -16,
        32,
        32,
        6
      );


      ctx.fill();


      ctx.strokeStyle =
        '#38bdf8';


      ctx.lineWidth =
        2;


      ctx.stroke();


      const bladeAngle =
        angle * 14;


      ctx.save();


      ctx.rotate(
        bladeAngle
      );


      ctx.fillStyle =
        '#38bdf8';


      ctx.shadowColor =
        '#38bdf8';


      ctx.shadowBlur =
        14;


      ctx.fillRect(
        -22,
        -4,
        44,
        8
      );


      ctx.fillStyle =
        '#f8fafc';


      ctx.beginPath();


      ctx.arc(
        -20,
        0,
        5,
        0,
        Math.PI * 2
      );


      ctx.arc(
        20,
        0,
        5,
        0,
        Math.PI * 2
      );


      ctx.fill();


      ctx.shadowBlur =
        0;


      ctx.restore();


      ctx.fillStyle =
        '#38bdf8';


      ctx.beginPath();


      ctx.arc(
        0,
        0,
        6,
        0,
        Math.PI * 2
      );


      ctx.fill();


      ctx.restore();


      // -----------------------
      // BOT 2
      // -----------------------

      ctx.save();


      ctx.translate(
        b2x,
        b2y
      );


      ctx.rotate(
        -angle * 1.8
      );


      ctx.fillStyle =
        '#334155';


      ctx.fillRect(
        -18,
        -18,
        8,
        36
      );


      ctx.fillRect(
        10,
        -18,
        8,
        36
      );


      ctx.fillStyle =
        '#f59e0b';


      ctx.beginPath();


      ctx.moveTo(
        -10,
        -14
      );


      ctx.lineTo(
        10,
        -14
      );


      ctx.lineTo(
        14,
        14
      );


      ctx.lineTo(
        -14,
        14
      );


      ctx.closePath();


      ctx.fill();


      ctx.strokeStyle =
        '#ffffff';


      ctx.lineWidth =
        1.5;


      ctx.stroke();


      ctx.fillStyle =
        '#e2e8f0';


      ctx.beginPath();


      ctx.moveTo(
        -12,
        14
      );


      ctx.lineTo(
        12,
        14
      );


      ctx.lineTo(
        0,
        24
      );


      ctx.closePath();


      ctx.fill();


      ctx.restore();


      // -----------------------
      // HUD
      // -----------------------

      ctx.fillStyle =
        'rgba(10,14,24,0.9)';


      ctx.fillRect(
        16,
        h - 38,
        w - 32,
        26
      );


      ctx.strokeStyle =
        'rgba(248,113,113,0.3)';


      ctx.strokeRect(
        16,
        h - 38,
        w - 32,
        26
      );


      ctx.font =
        '11px IBM Plex Mono, monospace';


      ctx.fillStyle =
        '#f87171';


      ctx.fillText(
        `SPINNER: 8,400 RPM   IMPACT: 19.4G   ARMOR: ${bot1Hp.toFixed(0)}% vs ${bot2Hp.toFixed(0)}%`,
        24,
        h - 21
      );


      requestAnimationFrame(
        drawWar
      );
    }


    requestAnimationFrame(
      drawWar
    );
  }


  // ==========================================================
  // 2. ROBO TUG OF WAR
  // ==========================================================

  const tugCanvas =
    document.getElementById(
      'canvas-tug-zone'
    );


  if (tugCanvas) {

    const ctx =
      tugCanvas.getContext(
        '2d'
      );


    if (!ctx) return;


    let phase = 0;

    const lightningArcs = [];


    function drawTug() {

      const parent =
        tugCanvas.parentElement;


      if (!parent) return;


      const w =
        tugCanvas.width =
        parent.clientWidth ||
        420;


      const h =
        tugCanvas.height =
        parent.clientHeight ||
        420;


      ctx.clearRect(
        0,
        0,
        w,
        h
      );


      phase +=
        0.038;


      const offset =
        Math.sin(phase) *
        28;


      const cy =
        h / 2;


      // -----------------------
      // PLATFORM
      // -----------------------

      ctx.fillStyle =
        'rgba(15,23,42,0.5)';


      ctx.fillRect(
        20,
        cy - 60,
        w - 40,
        120
      );


      ctx.strokeStyle =
        'rgba(56,189,248,0.2)';


      ctx.lineWidth =
        1.5;


      ctx.strokeRect(
        20,
        cy - 60,
        w - 40,
        120
      );


      // -----------------------
      // CENTER THRESHOLD
      // -----------------------

      ctx.beginPath();


      ctx.moveTo(
        w / 2,
        cy - 60
      );


      ctx.lineTo(
        w / 2,
        cy + 60
      );


      ctx.strokeStyle =
        '#f59e0b';


      ctx.lineWidth =
        2;


      ctx.setLineDash([
        4,
        4
      ]);


      ctx.stroke();


      ctx.setLineDash([]);


      // -----------------------
      // BOT POSITIONS
      // -----------------------

      const bot1X =
        64 +
        offset * 0.35;


      const bot2X =
        w - 64 +
        offset * 0.35;


      const sagY =
        cy +
        Math.sin(
          phase * 3
        ) * 4;


      // -----------------------
      // CABLE
      // -----------------------

      ctx.beginPath();


      ctx.moveTo(
        bot1X + 22,
        cy
      );


      ctx.quadraticCurveTo(
        w / 2 + offset,
        sagY,
        bot2X - 22,
        cy
      );


      ctx.strokeStyle =
        '#38bdf8';


      ctx.lineWidth =
        4;


      ctx.shadowColor =
        '#38bdf8';


      ctx.shadowBlur =
        14;


      ctx.stroke();


      ctx.shadowBlur =
        0;


      // -----------------------
      // KNOT
      // -----------------------

      const knotX =
        w / 2 +
        offset;


      ctx.fillStyle =
        '#f59e0b';


      ctx.shadowColor =
        '#f59e0b';


      ctx.shadowBlur =
        10;


      ctx.beginPath();


      ctx.arc(
        knotX,
        sagY,
        8,
        0,
        Math.PI * 2
      );


      ctx.fill();


      ctx.shadowBlur =
        0;


      // -----------------------
      // LIGHTNING
      // -----------------------

      if (
        Math.random() > 0.4
      ) {

        lightningArcs.push({
          x:
            knotX +
            (Math.random() - 0.5) *
            60,

          y:
            sagY +
            (Math.random() - 0.5) *
            16,

          life: 1
        });

      }


      for (
        let i =
          lightningArcs.length - 1;
        i >= 0;
        i--
      ) {

        const arc =
          lightningArcs[i];


        arc.life -=
          0.15;


        if (
          arc.life <= 0
        ) {

          lightningArcs.splice(
            i,
            1
          );

          continue;
        }


        ctx.strokeStyle =
          `rgba(56,189,248,${arc.life})`;


        ctx.lineWidth =
          2;


        ctx.beginPath();


        ctx.moveTo(
          arc.x,
          arc.y
        );


        ctx.lineTo(
          arc.x +
            (Math.random() - 0.5) *
            12,

          arc.y +
            (Math.random() - 0.5) *
            12
        );


        ctx.stroke();
      }


      // -----------------------
      // LEFT CRAWLER
      // -----------------------

      ctx.save();


      ctx.translate(
        bot1X,
        cy
      );


      ctx.fillStyle =
        '#1e293b';


      ctx.fillRect(
        -22,
        -18,
        44,
        8
      );


      ctx.fillRect(
        -22,
        10,
        44,
        8
      );


      ctx.fillStyle =
        '#38bdf8';


      for (
        let tx = -16;
        tx <= 16;
        tx += 8
      ) {

        ctx.beginPath();


        ctx.arc(
          tx,
          -14,
          3,
          0,
          Math.PI * 2
        );


        ctx.arc(
          tx,
          14,
          3,
          0,
          Math.PI * 2
        );


        ctx.fill();
      }


      ctx.fillStyle =
        '#f8fafc';


      ctx.beginPath();


      ctx.roundRect(
        -18,
        -10,
        36,
        20,
        4
      );


      ctx.fill();


      ctx.fillStyle =
        '#0284c7';


      ctx.fillRect(
        -12,
        -6,
        24,
        12
      );


      ctx.fillStyle =
        '#38bdf8';


      ctx.font =
        '10px monospace';


      ctx.fillText(
        '>TORQ<',
        -17,
        3
      );


      ctx.restore();


      // -----------------------
      // RIGHT CRAWLER
      // -----------------------

      ctx.save();


      ctx.translate(
        bot2X,
        cy
      );


      ctx.fillStyle =
        '#1e293b';


      ctx.fillRect(
        -22,
        -18,
        44,
        8
      );


      ctx.fillRect(
        -22,
        10,
        44,
        8
      );


      ctx.fillStyle =
        '#f59e0b';


      for (
        let tx = -16;
        tx <= 16;
        tx += 8
      ) {

        ctx.beginPath();


        ctx.arc(
          tx,
          -14,
          3,
          0,
          Math.PI * 2
        );


        ctx.arc(
          tx,
          14,
          3,
          0,
          Math.PI * 2
        );


        ctx.fill();
      }


      ctx.fillStyle =
        '#f59e0b';


      ctx.beginPath();


      ctx.roundRect(
        -18,
        -10,
        36,
        20,
        4
      );


      ctx.fill();


      ctx.fillStyle =
        '#0f172a';


      ctx.fillRect(
        -12,
        -6,
        24,
        12
      );


      ctx.fillStyle =
        '#f59e0b';


      ctx.font =
        '10px monospace';


      ctx.fillText(
        '>FORCE<',
        -18,
        3
      );


      ctx.restore();


      // -----------------------
      // HUD
      // -----------------------

      const tensionN =
        (
          2150 +
          Math.abs(offset) *
          22
        ).toFixed(0);


      ctx.fillStyle =
        'rgba(10,14,24,0.9)';


      ctx.fillRect(
        16,
        h - 38,
        w - 32,
        26
      );


      ctx.strokeStyle =
        'rgba(56,189,248,0.3)';


      ctx.strokeRect(
        16,
        h - 38,
        w - 32,
        26
      );


      ctx.font =
        '11px IBM Plex Mono, monospace';


      ctx.fillStyle =
        '#38bdf8';


      ctx.fillText(
        `LOAD: ${tensionN} N   TORQUE: 48.6 N·m   TRACTION: μ 0.98`,
        24,
        h - 21
      );


      requestAnimationFrame(
        drawTug
      );
    }


    requestAnimationFrame(
      drawTug
    );
  }


  // ==========================================================
  // 3. ROBO SOCCER
  // ==========================================================

  const soccerCanvas =
    document.getElementById(
      'canvas-soccer-zone'
    );


  if (soccerCanvas) {

    const ctx =
      soccerCanvas.getContext(
        '2d'
      );


    if (!ctx) return;


    let botX = 90;
    let botY = 160;


    let ballX = 150;
    let ballY = 160;


    let ballVx = 3.6;
    let ballVy = 1.8;


    const goalBursts = [];


    let goalsCount = 4;


    function drawSoccer() {

      const parent =
        soccerCanvas.parentElement;


      if (!parent) return;


      const w =
        soccerCanvas.width =
        parent.clientWidth ||
        420;


      const h =
        soccerCanvas.height =
        parent.clientHeight ||
        420;


      ctx.clearRect(
        0,
        0,
        w,
        h
      );


      // -----------------------
      // PITCH
      // -----------------------

      ctx.fillStyle =
        'rgba(15,23,42,0.7)';


      ctx.fillRect(
        24,
        24,
        w - 48,
        h - 48
      );


      ctx.strokeStyle =
        'rgba(52,211,153,0.25)';


      ctx.lineWidth =
        1.5;


      ctx.strokeRect(
        24,
        24,
        w - 48,
        h - 48
      );


      // -----------------------
      // CENTER LINE
      // -----------------------

      ctx.beginPath();


      ctx.moveTo(
        w / 2,
        24
      );


      ctx.lineTo(
        w / 2,
        h - 24
      );


      ctx.stroke();


      // -----------------------
      // CENTER CIRCLE
      // -----------------------

      ctx.beginPath();


      ctx.arc(
        w / 2,
        h / 2,
        38,
        0,
        Math.PI * 2
      );


      ctx.stroke();


      // -----------------------
      // GOAL
      // -----------------------

      const goalTop =
        h / 2 - 38;


      const goalBottom =
        h / 2 + 38;


      ctx.strokeStyle =
        '#34d399';


      ctx.lineWidth =
        2.5;


      ctx.strokeRect(
        w - 24,
        goalTop,
        16,
        76
      );


      // -----------------------
      // TRAJECTORY
      // -----------------------

      ctx.beginPath();


      ctx.setLineDash([
        4,
        6
      ]);


      ctx.moveTo(
        ballX,
        ballY
      );


      ctx.lineTo(
        ballX +
          ballVx * 18,

        ballY +
          ballVy * 18
      );


      ctx.strokeStyle =
        'rgba(52,211,153,0.4)';


      ctx.stroke();


      ctx.setLineDash([]);


      // -----------------------
      // BALL PHYSICS
      // -----------------------

      ballX +=
        ballVx;

      ballY +=
        ballVy;


      if (
        ballY < 40 ||
        ballY > h - 40
      ) {

        ballVy *=
          -1;
      }


      if (
        ballX < 40
      ) {

        ballVx *=
          -1;
      }


      // -----------------------
      // GOAL DETECTION
      // -----------------------

      if (
        ballX > w - 30 &&
        ballY > goalTop &&
        ballY < goalBottom
      ) {

        ballVx =
          -4.2;


        goalsCount++;


        for (
          let i = 0;
          i < 18;
          i++
        ) {

          goalBursts.push({

            x:
              w - 24,

            y:
              ballY,

            vx:
              (Math.random() - 1.2) *
              5,

            vy:
              (Math.random() - 0.5) *
              5,

            life:
              1,

            color:
              Math.random() > 0.5
                ? '#34d399'
                : '#38bdf8'

          });

        }
      }


      // -----------------------
      // GOAL PARTICLES
      // -----------------------

      for (
        let i =
          goalBursts.length - 1;
        i >= 0;
        i--
      ) {

        const gb =
          goalBursts[i];


        gb.x +=
          gb.vx;

        gb.y +=
          gb.vy;


        gb.life -=
          0.04;


        if (
          gb.life <= 0
        ) {

          goalBursts.splice(
            i,
            1
          );

          continue;
        }


        ctx.fillStyle =
          gb.color;


        ctx.shadowColor =
          gb.color;


        ctx.shadowBlur =
          8;


        ctx.beginPath();


        ctx.arc(
          gb.x,
          gb.y,
          3 * gb.life,
          0,
          Math.PI * 2
        );


        ctx.fill();


        ctx.shadowBlur =
          0;
      }


      // -----------------------
      // BOT FOLLOWS BALL
      // -----------------------

      botX +=
        (
          ballX -
          36 -
          botX
        ) *
        0.09;


      botY +=
        (
          ballY -
          botY
        ) *
        0.09;


      // -----------------------
      // STRIKER BOT
      // -----------------------

      ctx.save();


      ctx.translate(
        botX,
        botY
      );


      ctx.fillStyle =
        '#334155';


      ctx.fillRect(
        -16,
        -14,
        6,
        28
      );


      ctx.fillRect(
        10,
        -14,
        6,
        28
      );


      ctx.fillStyle =
        '#f8fafc';


      ctx.beginPath();


      ctx.arc(
        0,
        0,
        16,
        0,
        Math.PI * 2
      );


      ctx.fill();


      ctx.strokeStyle =
        '#34d399';


      ctx.lineWidth =
        2;


      ctx.stroke();


      ctx.fillStyle =
        '#34d399';


      ctx.fillRect(
        12,
        -8,
        4,
        16
      );


      ctx.fillStyle =
        '#0f172a';


      ctx.beginPath();


      ctx.arc(
        0,
        0,
        10,
        0,
        Math.PI * 2
      );


      ctx.fill();


      ctx.fillStyle =
        '#34d399';


      ctx.font =
        '10px monospace';


      ctx.fillText(
        '⚡ ⚡',
        -7,
        4
      );


      ctx.restore();


      // -----------------------
      // BALL
      // -----------------------

      ctx.shadowColor =
        '#34d399';


      ctx.shadowBlur =
        12;


      ctx.fillStyle =
        '#ffffff';


      ctx.beginPath();


      ctx.arc(
        ballX,
        ballY,
        8,
        0,
        Math.PI * 2
      );


      ctx.fill();


      ctx.strokeStyle =
        '#34d399';


      ctx.lineWidth =
        2;


      ctx.stroke();


      ctx.shadowBlur =
        0;


      // -----------------------
      // HUD
      // -----------------------

      ctx.fillStyle =
        'rgba(10,14,24,0.9)';


      ctx.fillRect(
        16,
        h - 38,
        w - 32,
        26
      );


      ctx.strokeStyle =
        'rgba(52,211,153,0.3)';


      ctx.strokeRect(
        16,
        h - 38,
        w - 32,
        26
      );


      ctx.font =
        '11px IBM Plex Mono, monospace';


      ctx.fillStyle =
        '#34d399';


      ctx.fillText(
        `OMNI-STRIKER // VELOCITY: 4.2 M/S   ACCURACY: 99.2%   GOALS: ${goalsCount}`,
        24,
        h - 21
      );


      requestAnimationFrame(
        drawSoccer
      );
    }


    requestAnimationFrame(
      drawSoccer
    );
  }

}


// ============================================================
// INITIALIZE ALL MODULES
// ============================================================

document.addEventListener(
  'DOMContentLoaded',
  () => {

    const curtain =
      document.getElementById(
        'init-curtain'
      );


    // ========================================================
    // LIGHTWEIGHT UI
    // ========================================================

    initCustomCursor();

    initNavigation();

    init3DTilt();

    initParticleField();


    // ========================================================
    // EVENT VISUALIZERS
    //
    // Only:
    // - Robo War
    // - Robo Tug of War
    // - Robo Soccer
    //
    // Robo Race is handled separately by:
    // three-event-showcase.js
    // ========================================================

    initArenaVisualizers();


    // ========================================================
    // FAST PRELOADER REMOVAL
    // ========================================================

    requestAnimationFrame(
      () => {

        requestAnimationFrame(
          () => {

            curtain?.classList.add(
              'loaded'
            );

          }
        );

      }
    );


    // ========================================================
    // HEAVY 3D SYSTEMS
    // Start after initial render.
    // ========================================================

    setTimeout(
      () => {


        // ======================================================
        // ROBO RACE 3D SHOWCASE
        // ======================================================

        const raceStage =
          document.getElementById(
            'race-visual-stage'
          );


        if (raceStage) {

          try {

            initRaceShowcase(
              'race-visual-stage'
            );

          } catch (error) {

            console.error(
              'Robo Race 3D initialization failed:',
              error
            );

          }

        }


        // ======================================================
        // CAMPUS 3D
        // ======================================================

        const campusCanvas =
          document.getElementById(
            'campus-3d-canvas'
          );


        if (campusCanvas) {

          try {

            initCampusScene(
              'campus-3d-canvas'
            );

          } catch (error) {

            console.error(
              'Campus 3D initialization failed:',
              error
            );

          }

        }

      },
      150
    );

  },
  {
    once: true
  }
);
