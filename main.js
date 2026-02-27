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
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Pilares: hover y stagger ---
  document.querySelectorAll('.pillar[data-pillar]').forEach((pillar) => {
    const id = pillar.getAttribute('data-pillar');
    pillar.addEventListener('mouseenter', () => {
      document.body.classList.add('pillar-hover-' + id);
    });
    pillar.addEventListener('mouseleave', () => {
      document.body.classList.remove('pillar-hover-' + id);
    });
  });

  // Stagger: pilares aparecen uno tras otro
  const pillarObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const stagger = parseInt(entry.target.getAttribute('data-stagger') || '0', 10);
        const delay = prefersReducedMotion ? 0 : stagger * 120;
        setTimeout(() => {
          entry.target.classList.add('visible');
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

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const src = el.getAttribute('data-lightbox');
      const img = el.querySelector('img');
      if (lightbox && lightboxImg && src) {
        lightboxImg.src = src;
        lightboxImg.alt = img ? img.alt : 'Imagen ampliada';
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
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

  // --- Swipe navegación móvil ---
  const sections = ['#inicio', '#propuesta', '#materia', '#faq', '#contacto'];
  let touchStartY = 0;
  let touchEndY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    const diff = touchStartY - touchEndY;
    if (Math.abs(diff) < 80 || !isTouch) return;

    const current = sections.findIndex((id) => {
      const el = document.querySelector(id);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top >= -100 && rect.top <= 100;
    });

    if (diff > 0 && current < sections.length - 1) {
      document.querySelector(sections[current + 1])?.scrollIntoView({ behavior: 'smooth' });
    } else if (diff < 0 && current > 0) {
      document.querySelector(sections[current - 1])?.scrollIntoView({ behavior: 'smooth' });
    }
  }, { passive: true });

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
