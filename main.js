/**
 * Gran Barón — One Page
 * Interacciones: cursor follower, magnetic buttons, scroll progress, stagger,
 * lightbox, floating labels, form success, tooltips, modo quiet, swipe
 * Respeta prefers-reduced-motion
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = 'ontouchstart' in window;

  // --- Reveal al cargar ---
  function initReveal() {
    setTimeout(() => {
      document.body.classList.remove('page-loading');
    }, 150);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }

  // --- Cursor follower ---
  if (!isTouch && !prefersReducedMotion) {
    const follower = document.getElementById('cursorFollower');
    let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.body.classList.add('mouse-active');
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      if (follower) {
        follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animateFollower);
    }
    animateFollower();
  }

  // --- Scroll progress ---
  if (!prefersReducedMotion) {
    const progress = document.getElementById('scrollProgress');
    function updateProgress() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;
      if (progress) progress.style.transform = `scaleX(${pct / 100})`;
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // --- Parallax ---
  if (!prefersReducedMotion) {
    const fabricLayers = document.querySelectorAll('.fabric-layer[data-parallax]');
    function updateParallax() {
      const scrollY = window.scrollY;
      fabricLayers.forEach((layer) => {
        const factor = parseFloat(layer.getAttribute('data-parallax')) || 0.1;
        const y = scrollY * factor * 0.5;
        layer.style.transform = 'translate3d(0, ' + y + 'px, 0)';
      });
    }
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  // --- Smooth scroll ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          const toggle = document.getElementById('navToggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // --- Navbar ---
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  function onScroll() {
    const scroll = window.scrollY || document.documentElement.scrollTop;
    if (navbar) {
      if (scroll > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    // Hero parallax: contenido se mueve y desvanece al scrollear
    if (!prefersReducedMotion && !document.body.classList.contains('modo-quiet')) {
      const hero = document.querySelector('[data-hero-parallax]');
      if (hero) {
        const heroHeight = document.querySelector('.hero-block')?.offsetHeight || 600;
        const progress = Math.min(scroll / heroHeight, 1);
        const y = progress * 40;
        const opacity = 1 - progress * 0.4;
        const scale = 1 - progress * 0.05;
        hero.style.transform = `translateY(${y}px) scale(${scale})`;
        hero.style.opacity = opacity;
      }
    }
    // Gradiente de fondo que cambia con scroll (más cálido en hero, más oscuro abajo)
    const gradientOverlay = document.getElementById('gradientOverlay');
    if (gradientOverlay && !document.body.classList.contains('modo-quiet')) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(scroll / docHeight, 1) : 0;
      const warm = 0.97 - pct * 0.02;
      const mid = 0.85 - pct * 0.03;
      gradientOverlay.style.background = `linear-gradient(180deg, rgba(var(--color-bg-rgb), ${warm}) 0%, rgba(var(--color-bg-rgb), ${mid}) 30%, rgba(var(--color-bg-rgb), 0.9) 70%, rgba(var(--color-bg-rgb), 0.98) 100%)`;
    }
    // Telas de fondo: cambian según scroll (transición suave entre capas)
    const fabricHero = document.querySelector('.fabric-hero');
    const fabricMid = document.querySelector('.fabric-mid');
    const fabricBottom = document.querySelector('.fabric-bottom');
    const fabricExtra = document.querySelector('.fabric-extra');
    const fabricExtra2 = document.querySelector('.fabric-extra-2');
    if (fabricHero && fabricMid && fabricBottom && fabricExtra && fabricExtra2 && !document.body.classList.contains('modo-quiet') && !prefersReducedMotion) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? Math.min(scroll / docH, 1) : 0;
      const base = 0.45;
      const peak = 0.78;
      const fade = (pos, width) => Math.exp(-Math.pow((pct - pos) / width, 2));
      fabricHero.style.opacity = base + (peak - base) * fade(0, 0.35);
      fabricMid.style.opacity = base + (peak - base) * fade(0.25, 0.3);
      fabricExtra.style.opacity = base + (peak - base) * fade(0.5, 0.3);
      fabricBottom.style.opacity = base + (peak - base) * fade(0.7, 0.3);
      fabricExtra2.style.opacity = base + (peak - base) * fade(1, 0.35);
    }
    // Icono mundo orbitando: ángulo según scroll
    const orbitTrack = document.getElementById('phraseOrbitTrack');
    if (orbitTrack && !document.body.classList.contains('modo-quiet') && !prefersReducedMotion) {
      const angle = (scroll * 0.25) % 360;
      orbitTrack.style.transform = 'rotate(' + angle + 'deg)';
    }
    // Proceso: líneas que conectan 1→2 y 2→3, se extienden al scrollear
    const procesoBlock = document.getElementById('proceso');
    if (procesoBlock && !document.body.classList.contains('modo-quiet') && !prefersReducedMotion) {
      const path1 = procesoBlock.querySelector('.connector-path-1');
      const path2 = procesoBlock.querySelector('.connector-path-2');
      if (path1 && path2) {
        const len1 = path1.getTotalLength();
        const len2 = path2.getTotalLength();
        path1.style.strokeDasharray = String(len1);
        path2.style.strokeDasharray = String(len2);
        const rect = procesoBlock.getBoundingClientRect();
        const sectionTop = rect.top + scroll;
        const sectionHeight = procesoBlock.offsetHeight;
        const viewportHeight = window.innerHeight;
        const triggerStart = sectionTop - viewportHeight * 0.5;
        const triggerEnd = sectionTop + sectionHeight - viewportHeight * 0.2;
        const scrollRange = triggerEnd - triggerStart;
        const progress = scrollRange > 0 ? Math.max(0, Math.min(1, (scroll - triggerStart) / scrollRange)) : 0;
        const draw1 = Math.min(1, progress * 2);
        const draw2 = Math.max(0, Math.min(1, (progress - 0.5) * 2));
        path1.style.strokeDashoffset = String(len1 * (1 - draw1));
        path2.style.strokeDashoffset = String(len2 * (1 - draw2));
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Pilares: hover y stagger ---
  document.querySelectorAll('.pillar-globe[data-pillar]').forEach((pillar) => {
    const id = pillar.getAttribute('data-pillar');
    pillar.addEventListener('mouseenter', () => {
      document.body.classList.add('pillar-hover-' + id);
    });
    pillar.addEventListener('mouseleave', () => {
      document.body.classList.remove('pillar-hover-' + id);
    });
  });

  // Stagger: pilares aparecen uno tras otro + count-up en números
  const pillarObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const stagger = parseInt(entry.target.getAttribute('data-stagger') || '0', 10);
        const delay = prefersReducedMotion ? 0 : stagger * 120;
        setTimeout(() => {
          entry.target.classList.add('visible');
          const numEl = entry.target.querySelector('.pillar-num[data-pillar-value]');
          if (numEl && !numEl.dataset.animated && !prefersReducedMotion) {
            numEl.dataset.animated = 'true';
            const target = parseInt(numEl.getAttribute('data-pillar-value') || '0', 10);
            let current = 0;
            const step = target / 15;
            const dur = 600;
            const interval = dur / 15;
            const timer = setInterval(() => {
              current = Math.min(Math.ceil(current + step), target);
              numEl.textContent = String(current).padStart(2, '0');
              if (current >= target) clearInterval(timer);
            }, interval);
          }
        }, delay);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.pillar-stagger').forEach((el) => pillarObserver.observe(el));

  // --- IntersectionObserver: flow-inner ---
  const observerOptions = {
    root: null,
    rootMargin: prefersReducedMotion ? '0px' : '0px 0px -80px 0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  document.querySelectorAll('.flow-inner').forEach((el) => observer.observe(el));

  // --- Scroll reveal: slide in + scale + fabric layers ---
  if (!prefersReducedMotion) {
    const scrollRevealOptions = { root: null, rootMargin: '0px 0px -100px 0px', threshold: 0.1 };
    const scrollRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('visible');
          el.querySelectorAll('.scroll-scale').forEach((child) => child.classList.add('visible'));
          const fabricId = el.getAttribute('data-scroll-fabric');
          if (fabricId) {
            document.body.classList.add('scroll-fabric-' + fabricId);
          }
          if (el.classList.contains('proceso-block')) {
            const steps = el.querySelectorAll('.proceso-reveal');
            steps.forEach((step, i) => {
              setTimeout(() => step.classList.add('visible'), i * 150);
            });
          }
        }
      });
    }, scrollRevealOptions);
    document.querySelectorAll('.scroll-reveal').forEach((el) => scrollRevealObserver.observe(el));
  }

  // --- Botones magnéticos ---
  if (!prefersReducedMotion) {
    document.querySelectorAll('.btn-magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        if (document.body.classList.contains('modo-quiet')) return;
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // --- Tilt 3D ---
  if (!prefersReducedMotion) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        if (document.body.classList.contains('modo-quiet')) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (y - 0.5) * 8;
        const tiltY = (x - 0.5) * -8;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --- Marcas: hover magnético suave (logo cercano se acerca, otros se alejan) con lerp ---
  if (!prefersReducedMotion && !isTouch) {
    const marcasLogos = document.getElementById('marcasLogos');
    const marcasSection = marcasLogos?.closest('.marcas-block');
    if (marcasSection?.classList.contains('is-hidden')) {
      /* Sección oculta: no inicializar hover */
    } else {
    const marcaItems = marcasLogos ? marcasLogos.querySelectorAll('.marca-logo') : [];
    const ATTRACT = 0.18;
    const REPEL_BASE = 0.06;
    const REPEL_RADIUS = 200;
    const LERP = 0.06;

    if (marcasLogos && marcaItems.length) {
      let mouseX = -9999, mouseY = -9999;
      const current = Array.from(marcaItems).map(() => ({ x: 0, y: 0 }));
      let rafId = null;
      let animating = true;

      function updateMarcas() {
        if (mouseX === -9999) {
          marcaItems.forEach((el, i) => {
            current[i].x *= 0.88;
            current[i].y *= 0.88;
            if (Math.abs(current[i].x) < 0.5 && Math.abs(current[i].y) < 0.5) {
              current[i].x = 0;
              current[i].y = 0;
            }
            el.style.transform = `translate(calc(-50% + ${current[i].x}px), calc(-50% + ${current[i].y}px))`;
          });
          const settled = current.every((c) => Math.abs(c.x) < 0.5 && Math.abs(c.y) < 0.5);
          if (settled) animating = false;
        } else {
          let minDist = Infinity;
          let closest = null;
          marcaItems.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const d = Math.hypot(mouseX - cx, mouseY - cy);
            if (d < minDist) { minDist = d; closest = el; }
          });

          const repelMultiplier = minDist < 120 ? 1 + (120 - minDist) / 100 : 1;

          marcaItems.forEach((el, i) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = mouseX - cx;
            const dy = mouseY - cy;
            const dist = Math.hypot(dx, dy) || 1;

            let targetX, targetY;
            if (el === closest) {
              targetX = dx * ATTRACT;
              targetY = dy * ATTRACT;
            } else {
              const nx = -dx / dist;
              const ny = -dy / dist;
              const repel = (REPEL_RADIUS - Math.min(dist, REPEL_RADIUS)) * REPEL_BASE * repelMultiplier;
              targetX = nx * repel;
              targetY = ny * repel;
            }

            current[i].x += (targetX - current[i].x) * LERP;
            current[i].y += (targetY - current[i].y) * LERP;
            el.style.transform = `translate(calc(-50% + ${current[i].x}px), calc(-50% + ${current[i].y}px))`;
          });
        }
        rafId = null;
        if (animating) rafId = requestAnimationFrame(updateMarcas);
      }

      function loop() {
        updateMarcas();
      }

      const hoverRoot = marcasSection || marcasLogos;

      hoverRoot.addEventListener('mousemove', (e) => {
        if (document.body.classList.contains('modo-quiet')) return;
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!rafId) {
          animating = true;
          rafId = requestAnimationFrame(loop);
        }
      });

      hoverRoot.addEventListener('mouseleave', (e) => {
        if (!hoverRoot.contains(e.relatedTarget)) {
          mouseX = -9999;
          mouseY = -9999;
          if (!rafId) {
            animating = true;
            rafId = requestAnimationFrame(loop);
          }
        }
      });

    }
    }
  }

  // --- Lightbox: imágenes y videos ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, isVideo) {
    if (!lightbox) return;
    if (isVideo && lightboxVideo) {
      lightbox.classList.add('is-video');
      lightboxVideo.src = src;
      lightboxVideo.muted = false;
      lightboxVideo.play().catch(() => {});
      lightbox.setAttribute('aria-label', 'Reproducir video');
    } else if (lightboxImg) {
      lightbox.classList.remove('is-video');
      lightboxImg.src = src;
      lightboxImg.alt = 'Imagen ampliada';
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
      }
      lightbox.setAttribute('aria-label', 'Ampliar imagen');
    }
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('is-open', 'is-video');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = '';
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
      }
    }
  }

  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const src = el.getAttribute('data-lightbox');
      if (src) openLightbox(src, false);
    });
  });

  document.querySelectorAll('.gallery-item[data-src]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const src = el.getAttribute('data-src');
      const isVideo = el.getAttribute('data-media') === 'video';
      if (src) openLightbox(src, isVideo);
    });
  });

  // --- Galería socio: 4 slots rotando a destiempo + videos autoplay ---
  const socioGallery = document.getElementById('socioGallery');
  if (socioGallery && socioGallery.classList.contains('socio-gallery-rotating') && !prefersReducedMotion) {
    const pool = [
      { type: 'img', src: 'assets/images/viaje/PHOTO-2026-03-08-08-29-48.jpg' },
      { type: 'video', src: 'assets/images/viaje/VIDEO-2026-03-08-08-05-59.mp4', poster: 'assets/images/viaje/PHOTO-2026-03-08-08-29-48.jpg' },
      { type: 'img', src: 'assets/images/viaje/PHOTO-2026-03-08-07-53-11.jpg' },
      { type: 'video', src: 'assets/images/viaje/VIDEO-2026-03-08-15-58-10.mp4', poster: 'assets/images/viaje/PHOTO-2026-03-08-14-12-04.jpg' },
      { type: 'img', src: 'assets/images/viaje/PHOTO-2026-03-08-08-10-24.jpg' },
      { type: 'img', src: 'assets/images/viaje/PHOTO-2026-03-08-07-49-12.jpg' },
      { type: 'video', src: 'assets/images/viaje/VIDEO-2026-03-08-13-53-41.mp4', poster: 'assets/images/viaje/PHOTO-2026-03-08-14-11-42.jpg' },
      { type: 'img', src: 'assets/images/viaje/PHOTO-2026-03-08-14-12-14.jpg' }
    ];
    const slots = socioGallery.querySelectorAll('.gallery-slot');
    const slotIndex = [0, 1, 2, 3];
    const intervals = [5200, 6100, 5800, 6400];
    const delays = [0, 1200, 2500, 800];

    function renderSlot(slotEl, item) {
      slotEl.innerHTML = '';
      slotEl.removeAttribute('data-src');
      slotEl.removeAttribute('data-media');
      if (item.type === 'img') {
        slotEl.setAttribute('data-src', item.src);
        slotEl.setAttribute('data-media', 'img');
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = 'Viaje Gran Barón';
        img.loading = 'lazy';
        slotEl.appendChild(img);
      } else {
        slotEl.setAttribute('data-src', item.src);
        slotEl.setAttribute('data-media', 'video');
        const video = document.createElement('video');
        video.src = item.src;
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        video.autoplay = true;
        if (item.poster) video.poster = item.poster;
        video.preload = 'auto';
        const play = document.createElement('span');
        play.className = 'gallery-play';
        play.setAttribute('aria-hidden', 'true');
        play.textContent = '▶';
        slotEl.appendChild(video);
        slotEl.appendChild(play);
        video.play().catch(() => {});
      }
    }

    function rotateSlot(i) {
      const used = new Set();
      for (let j = 0; j < slots.length; j++) {
        if (j !== i) used.add(slotIndex[j]);
      }
      let next = slotIndex[i];
      const start = next;
      do {
        next = (next + 1) % pool.length;
        if (!used.has(next)) break;
      } while (next !== start);
      slotIndex[i] = next;
      renderSlot(slots[i], pool[slotIndex[i]]);
    }

    slots.forEach((slot, i) => {
      renderSlot(slot, pool[slotIndex[i]]);
      setTimeout(() => {
        setInterval(() => rotateSlot(i), intervals[i]);
      }, delays[i]);
    });

    socioGallery.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-slot');
      if (!item) return;
      const src = item.getAttribute('data-src');
      const isVideo = item.getAttribute('data-media') === 'video';
      if (src) {
        e.preventDefault();
        openLightbox(src, isVideo);
      }
    });

    // --- Flotación con rebote: imágenes se mueven lentamente y rebotan al chocarse (solo desktop) ---
    const mqFloat = window.matchMedia('(min-width: 769px)');
    if (!document.body.classList.contains('modo-quiet') && mqFloat.matches) {
      const socioLayout = socioGallery.closest('.socio-layout');
      const socioText = socioLayout?.querySelector('.socio-text');
      const floatSlots = Array.from(socioGallery.querySelectorAll('.gallery-slot'));
      const PAD = 15;

      if (socioLayout && socioText && floatSlots.length === 4) {
        socioGallery.classList.add('socio-float-js');
        const state = floatSlots.map((_, i) => ({
          x: 0,
          y: 0,
          vx: (i % 2 === 0 ? 1 : -1) * (0.045 + (i * 0.01)),
          vy: (i < 2 ? 1 : -1) * (0.038 + (i * 0.008))
        }));

        function rectsOverlap(a, b) {
          return !(a.right < b.left + PAD || a.left > b.right - PAD || a.bottom < b.top + PAD || a.top > b.bottom - PAD);
        }

        function tick() {
          const layoutRect = socioLayout.getBoundingClientRect();
          const textRect = socioText.getBoundingClientRect();
          const textZone = {
            left: textRect.left - 30,
            right: textRect.right + 30,
            top: textRect.top - 30,
            bottom: textRect.bottom + 30
          };

          floatSlots.forEach((_, i) => {
            state[i].x += state[i].vx;
            state[i].y += state[i].vy;
          });
          const t = performance.now() * 0.001;
          floatSlots.forEach((el, i) => {
            const pulse = 1 + 0.035 * Math.sin(t + i * 1.5);
            el.style.setProperty('--float-x', state[i].x + 'px');
            el.style.setProperty('--float-y', state[i].y + 'px');
            el.style.setProperty('--float-scale', String(pulse));
          });
          const rects = floatSlots.map((el) => el.getBoundingClientRect());

          for (let i = 0; i < 4; i++) {
            const r = rects[i];
            if (rectsOverlap(r, textZone)) {
              state[i].vx *= -1;
              state[i].vy *= -1;
              state[i].x += state[i].vx * 4;
              state[i].y += state[i].vy * 4;
            }
            if (r.left < layoutRect.left + PAD || r.right > layoutRect.right - PAD) state[i].vx *= -1;
            if (r.top < layoutRect.top + PAD || r.bottom > layoutRect.bottom - PAD) state[i].vy *= -1;
            for (let j = i + 1; j < 4; j++) {
              if (rectsOverlap(rects[i], rects[j])) {
                state[i].vx *= -1;
                state[i].vy *= -1;
                state[j].vx *= -1;
                state[j].vy *= -1;
                state[i].x += state[i].vx * 5;
                state[i].y += state[i].vy * 5;
                state[j].x += state[j].vx * 5;
                state[j].y += state[j].vy * 5;
              }
            }
          }
          floatSlots.forEach((el, i) => {
            const pulse = 1 + 0.035 * Math.sin(t + i * 1.5);
            el.style.setProperty('--float-x', state[i].x + 'px');
            el.style.setProperty('--float-y', state[i].y + 'px');
            el.style.setProperty('--float-scale', String(pulse));
          });
        }

        let rafId = null;
        let visible = true;
        const io = new IntersectionObserver((entries) => {
          visible = entries[0].isIntersecting;
        }, { threshold: 0.1 });
        io.observe(socioLayout);

        function loop() {
          if (visible && mqFloat.matches && !document.body.classList.contains('modo-quiet')) tick();
          rafId = requestAnimationFrame(loop);
        }
        rafId = requestAnimationFrame(loop);
      }
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  // --- FAQ: acordeón con transición ---
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('data-faq-target');
      const answer = document.getElementById(targetId);
      const item = this.closest('.faq-item');
      if (!answer || !item) return;

      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      answer.hidden = isExpanded;
      item.classList.toggle('is-open', !isExpanded);

      document.querySelectorAll('.faq-question').forEach((other) => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherId = other.getAttribute('data-faq-target');
          const otherAnswer = document.getElementById(otherId);
          const otherItem = other.closest('.faq-item');
          if (otherAnswer) otherAnswer.hidden = true;
          if (otherItem) otherItem.classList.remove('is-open');
        }
      });
    });
  });

  // --- Formulario: validación, animación éxito, floating labels ---
  const form = document.getElementById('contactForm');
  if (form) {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('btnSubmit');

    const errors = {
      nombre: document.getElementById('error-nombre'),
      email: document.getElementById('error-email'),
      mensaje: document.getElementById('error-mensaje')
    };

    function clearErrors() {
      Object.values(errors).forEach((el) => { if (el) el.textContent = ''; });
      [nombre, email, mensaje].forEach((el) => { if (el) el.classList.remove('error'); });
      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }
    }

    function showError(field, message) {
      const errEl = errors[field];
      const inputEl = form.querySelector(`#${field}`);
      if (errEl) errEl.textContent = message;
      if (inputEl) inputEl.classList.add('error');
    }

    function validate() {
      clearErrors();
      let valid = true;

      if (!nombre.value.trim()) {
        showError('nombre', 'El nombre es obligatorio.');
        valid = false;
      }

      const emailVal = email.value.trim();
      const hasAt = emailVal.includes('@');
      const hasDigits = /\d{6,}/.test(emailVal);
      if (!emailVal) {
        showError('email', 'El email o teléfono es obligatorio.');
        valid = false;
      } else if (hasAt && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showError('email', 'Ingresá un email válido.');
        valid = false;
      } else if (!hasAt && !hasDigits) {
        showError('email', 'Si es teléfono, ingresá al menos 6 dígitos.');
        valid = false;
      }

      if (!mensaje.value.trim()) {
        showError('mensaje', 'El mensaje es obligatorio.');
        valid = false;
      }

      return valid;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('success');
      }

      setTimeout(() => {
        if (formStatus) {
          formStatus.textContent = '¡Mensaje enviado! Te responderemos a la brevedad.';
          formStatus.className = 'form-status success';
        }
        form.reset();
        clearErrors();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('success');
        }
      }, 1200);
    });

    // Floating labels: toggle class on parent
    [nombre, email, mensaje].forEach((input) => {
      if (input && input.parentElement) {
        const group = input.parentElement;
        input.addEventListener('input', () => {
          group.classList.toggle('has-value', input.value.trim() !== '');
        });
        input.addEventListener('focus', () => group.classList.add('has-focus'));
        input.addEventListener('blur', () => group.classList.remove('has-focus'));
        if (input.value.trim()) group.classList.add('has-value');
      }
    });
  }

  // --- Modo tranquilo ---
  const btnQuiet = document.getElementById('btnQuiet');
  if (btnQuiet) {
    const saved = localStorage.getItem('granbaron-modo-quiet');
    if (saved === 'true') document.body.classList.add('modo-quiet');
    if (btnQuiet) btnQuiet.setAttribute('aria-pressed', document.body.classList.contains('modo-quiet'));

    btnQuiet.addEventListener('click', () => {
      document.body.classList.toggle('modo-quiet');
      const isQuiet = document.body.classList.contains('modo-quiet');
      btnQuiet.setAttribute('aria-pressed', isQuiet);
      localStorage.setItem('granbaron-modo-quiet', isQuiet);
    });
  }

  // --- Botón volver arriba ---
  const backTop = document.getElementById('backTop');
  if (backTop) {
    function updateBackTop() {
      const show = window.scrollY > window.innerHeight * 0.5;
      backTop.classList.toggle('visible', show);
    }
    window.addEventListener('scroll', updateBackTop, { passive: true });
    updateBackTop();

    backTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }
})();
