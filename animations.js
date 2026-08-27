/**
 * ROBO KRITI 2026 - GSAP & MOTION ANIMATION SYSTEM
 */
import { gsap } from 'gsap';

export function initGSAPAnimations() {
  // Staggered reveal of hero elements
  gsap.from('.hero-reveal', {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Numbers counter animation
  const counters = document.querySelectorAll('.counter-val');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target') || '0', 10);
    gsap.fromTo(counter, { innerText: 0 }, {
      innerText: target,
      duration: 2,
      snap: { innerText: 1 },
      ease: 'power2.out',
      scrollTrigger: {
        trigger: counter,
        start: 'top 85%'
      }
    });
  });

  // Magnetic Button Effect
  const magnetics = document.querySelectorAll('.btn-magnetic');
  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initGSAPAnimations);
