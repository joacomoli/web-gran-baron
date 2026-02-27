/**
 * Gran Barón — One Page
 * Interacciones: smooth scroll, navbar, FAQ, formulario, back-to-top
 * Respeta prefers-reduced-motion
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Smooth scroll para anchors ---
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
        // Cerrar menú móvil si está abierto
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          const toggle = document.getElementById('navToggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // --- Navbar: toggle móvil y scroll ---
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  let lastScroll = 0;
  function onScroll() {
    const scroll = window.scrollY || document.documentElement.scrollTop;
    if (navbar) {
      if (scroll > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    lastScroll = scroll;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Pilares: cambiar fondo al hacer hover ---
  document.querySelectorAll('.pillar[data-pillar]').forEach((pillar) => {
    const id = pillar.getAttribute('data-pillar');
    pillar.addEventListener('mouseenter', () => {
      document.body.classList.add('pillar-hover-' + id);
    });
    pillar.addEventListener('mouseleave', () => {
      document.body.classList.remove('pillar-hover-' + id);
    });
  });

  // --- IntersectionObserver: animar secciones al entrar al viewport ---
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

  // --- FAQ: acordeón ---
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('data-faq-target');
      const answer = document.getElementById(targetId);
      if (!answer) return;

      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      answer.hidden = isExpanded;

      // Cerrar otros (opcional: acordeón único abierto)
      document.querySelectorAll('.faq-question').forEach((other) => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherId = other.getAttribute('data-faq-target');
          const otherAnswer = document.getElementById(otherId);
          if (otherAnswer) otherAnswer.hidden = true;
        }
      });
    });
  });

  // --- Formulario: validación y envío simulado ---
  const form = document.getElementById('contactForm');
  if (form) {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');
    const formStatus = document.getElementById('formStatus');

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

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      // Simular envío (sin backend)
      setTimeout(() => {
        if (formStatus) {
          formStatus.textContent = '¡Mensaje enviado! Te responderemos a la brevedad.';
          formStatus.className = 'form-status success';
        }
        form.reset();
        clearErrors();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar';
        }
      }, 1200);
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
