/**
 * Solidframe Web - Global JavaScript
 * Enhanced with robust FAQ & Blog toggles, mobile menu, reveal animations.
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
  window.addEventListener('scroll', handleScroll);
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

  document.querySelectorAll('.mob-link').forEach(link => {
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

  // ---------- FAQ Accordion (dynamic height) ----------
  function initFaqItems() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const toggleBtn = item.querySelector('.faq-toggle');
      const content = item.querySelector('.faq-content');
      if (!toggleBtn || !content) return;

      // Remove any existing listener by cloning
      const newToggle = toggleBtn.cloneNode(true);
      toggleBtn.parentNode.replaceChild(newToggle, toggleBtn);

      newToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const faq = item;
        const isActive = faq.classList.contains('active');
        
        // Close others? (optional – currently independent)
        faq.classList.toggle('active');
        
        const faqContent = faq.querySelector('.faq-content');
        if (faq.classList.contains('active')) {
          faqContent.style.maxHeight = faqContent.scrollHeight + 'px';
          newToggle.textContent = '−';
        } else {
          faqContent.style.maxHeight = '0';
          newToggle.textContent = '+';
        }
      });

      // Ensure collapsed initially
      content.style.maxHeight = '0';
      newToggle.textContent = '+';
    });
  }

  // Also support inline onclick (legacy)
  window.toggleFaq = function(element) {
    const faq = element.closest('.faq-item');
    if (!faq) return;
    const content = faq.querySelector('.faq-content');
    const toggle = faq.querySelector('.faq-toggle');
    const isActive = faq.classList.contains('active');
    
    faq.classList.toggle('active');
    if (!isActive) {
      content.style.maxHeight = content.scrollHeight + 'px';
      if (toggle) toggle.textContent = '−';
    } else {
      content.style.maxHeight = '0';
      if (toggle) toggle.textContent = '+';
    }
  };

  // ---------- Blog Read More / Read Less ----------
  function initBlogCards() {
    document.querySelectorAll('.blog-card').forEach(card => {
      const btn = card.querySelector('.read-more-btn');
      const content = card.querySelector('.blog-full-content');
      if (!btn || !content) return;

      // Remove existing listeners
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

      // Ensure collapsed initially
      content.style.maxHeight = '0';
    });
  }

  // Expose global toggle for inline usage
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

  // ---------- Form Handling ----------
  function handleForm(form, successEl) {
    if (!form || !successEl) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.display = 'none';
      successEl.classList.remove('hidden');
      console.log('Form submitted:', new FormData(form));
    });
  }
  handleForm(document.getElementById('quoteForm'), document.getElementById('formDone'));
  handleForm(document.getElementById('contactForm'), document.getElementById('formSuccess'));

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

  // ---------- Initialize everything ----------
  initFaqItems();
  initBlogCards();

  // Re-run initialization if content changes dynamically (e.g., after form success)
  // Not needed for static pages, but safe.
  window.refreshToggles = function() {
    initFaqItems();
    initBlogCards();
  };

})();
