/**
 * Solidframe Web - Global JavaScript
 * Enhanced with Netlify form handling, robust FAQ & Blog toggles, mobile menu, reveal animations.
 */
(function() {
  'use strict';

  // ---------- DOM Elements ----------
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const body = document.body;

  // ---------- Navbar Scroll & Back to Top ----------
  function handleScroll() {
    if (nav) nav.classList.toggle('navbar-scrolled', window.scrollY > 50);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------- Mobile Menu ----------
  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.style.transform = 'translateX(0)';
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
    body.classList.add('menu-open');
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.style.transform = 'translateX(100%)';
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
    body.classList.remove('menu-open');
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
  if (menuClose) menuClose.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.mob-link, #mobileMenu a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.style.transform === 'translateX(0px)') {
      closeMobileMenu();
    }
  });

  // Mobile dropdown accordion
  document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.toggle('active');
    });
  });

  // ---------- FAQ Accordion (CSS Grid Method – flawless) ----------
  function initFaqItems() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const toggleBtn = item.querySelector('.faq-toggle');
      const contentWrapper = item.querySelector('.faq-content');
      if (!toggleBtn || !contentWrapper) return;

      // Remove any existing click listeners by cloning
      const newToggle = toggleBtn.cloneNode(true);
      toggleBtn.parentNode.replaceChild(newToggle, toggleBtn);

      // Set initial state
      item.classList.remove('active');
      newToggle.textContent = '+';

      newToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        item.classList.toggle('active');
        newToggle.textContent = item.classList.contains('active') ? '−' : '+';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqItems);
  } else {
    initFaqItems();
  }

  // ---------- Blog Read More / Read Less ----------
  function initBlogCards() {
    document.querySelectorAll('.blog-card').forEach(card => {
      const btn = card.querySelector('.read-more-btn');
      const content = card.querySelector('.blog-full-content');
      if (!btn || !content) return;

      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = card.classList.contains('expanded');
        card.classList.toggle('expanded');
        
        const btnText = newBtn.querySelector('span');
        const icon = newBtn.querySelector('svg');
        
        if (!isExpanded) {
          content.style.maxHeight = content.scrollHeight + 'px';
          if (btnText) btnText.textContent = 'Read Less';
          if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
          content.style.maxHeight = '0';
          if (btnText) btnText.textContent = 'Read More';
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      });

      content.style.maxHeight = '0';
    });
  }

  window.toggleBlogPost = function(btn) {
    const card = btn.closest('.blog-card');
    if (!card) return;
    const content = card.querySelector('.blog-full-content');
    const btnText = btn.querySelector('span');
    const icon = btn.querySelector('svg');
    const isExpanded = card.classList.contains('expanded');
    
    card.classList.toggle('expanded');
    if (!isExpanded) {
      content.style.maxHeight = content.scrollHeight + 'px';
      if (btnText) btnText.textContent = 'Read Less';
      if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
      content.style.maxHeight = '0';
      if (btnText) btnText.textContent = 'Read More';
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  };

  // ---------- Scroll Reveal ----------
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealElements.forEach(el => observer.observe(el));
  }

  // ---------- Netlify Form Handling (AJAX + fallback) ----------
  function setupNetlifyForm(formId, successElId, resetAfterMs = 5000) {
    const form = document.getElementById(formId);
    const successEl = document.getElementById(successElId);
    if (!form || !successEl) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const urlEncoded = new URLSearchParams(formData).toString();

      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: urlEncoded,
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        // Success – show green pop‑up
        form.style.display = 'none';
        successEl.classList.remove('hidden');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Auto‑hide after specified time and reset form
        setTimeout(() => {
          successEl.classList.add('hidden');
          form.style.display = '';
          form.reset();
        }, resetAfterMs);

      } catch (error) {
        console.warn('AJAX submission failed, falling back to normal form submit.', error);
        // Remove AJAX listener to avoid infinite loop, then submit normally
        form.removeEventListener('submit', arguments.callee);
        form.submit();
      }
    });
  }

  // Initialize both forms on the page (they can be on different pages)
  setupNetlifyForm('quoteForm', 'formDone');
  setupNetlifyForm('contactForm', 'formSuccess');

  // ---------- Smooth Scroll ----------
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---------- Initialization ----------
  initFaqItems();
  initBlogCards();

  window.refreshToggles = function() {
    initFaqItems();
    initBlogCards();
  };

})();
