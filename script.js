/**
 * Solidframe Web - Global JavaScript
 * Handles interactivity across all pages: navigation, modals, accordions, reveals, forms.
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

  // ---------- Navbar Scroll Effect & Back to Top ----------
  function handleScroll() {
    // Navbar background
    if (nav) {
      nav.classList.toggle('navbar-scrolled', window.scrollY > 50);
    }
    // Back to top button
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // initial call

  // ---------- Mobile Menu Toggle ----------
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

  if (menuToggle) {
    menuToggle.addEventListener('click', openMobileMenu);
  }
  if (menuClose) {
    menuClose.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when clicking on any mobile nav link (.mob-link)
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.style.transform === 'translateX(0px)') {
      closeMobileMenu();
    }
  });

  // ---------- Mobile Dropdown Accordion (Services inside mobile menu) ----------
  document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.toggle('active');
    });
  });

  // ---------- FAQ Accordion (used on faqs.html and pricing.html) ----------
  window.toggleFaq = function(element) {
    if (!element) return;
    const faqItem = element.closest('.faq-item');
    if (!faqItem) return;
    
    const isActive = faqItem.classList.contains('active');
    
    // Optional: close others? No, we let multiple be open as per design.
    faqItem.classList.toggle('active');
    
    const content = faqItem.querySelector('.faq-content');
    const toggleIcon = faqItem.querySelector('.faq-toggle');
    
    if (content) {
      if (!isActive) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    }
    if (toggleIcon) {
      toggleIcon.textContent = isActive ? '+' : '−';
    }
  };

  // Attach click handlers to existing FAQ items (for pages that load with them)
  document.querySelectorAll('.faq-item').forEach(item => {
    // Avoid duplicate listeners; we use the onclick attribute in HTML, but ensure consistency
    const header = item.querySelector('.flex, .faq-toggle')?.parentElement;
    if (header) {
      header.addEventListener('click', (e) => {
        // Prevent if clicking on a link inside
        if (e.target.tagName === 'A') return;
        toggleFaq(item);
      });
    }
  });

  // ---------- Blog Read More / Read Less ----------
  window.toggleBlogPost = function(btn) {
    const card = btn.closest('.blog-card');
    if (!card) return;
    
    const content = card.querySelector('.blog-full-content');
    const btnText = btn.querySelector('span');
    const icon = btn.querySelector('svg');
    
    card.classList.toggle('expanded');
    
    if (card.classList.contains('expanded')) {
      if (btnText) btnText.textContent = 'Read Less';
      if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
      if (btnText) btnText.textContent = 'Read More';
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  };

  // Attach to existing read-more buttons (if not using inline onclick)
  document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleBlogPost(this);
    });
  });

  // ---------- Scroll Reveal Animation (Intersection Observer) ----------
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ---------- Form Handling (Quote / Contact) ----------
  function handleFormSubmit(form, successElement) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Basic validation could be added here
      form.style.display = 'none';
      if (successElement) {
        successElement.classList.remove('hidden');
      }
      // Optional: console log or send data
      console.log('Form submitted:', new FormData(form));
    });
  }

  const quoteForm = document.getElementById('quoteForm');
  const formDone = document.getElementById('formDone');
  if (quoteForm && formDone) {
    handleFormSubmit(quoteForm, formDone);
  }

  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm && formSuccess) {
    handleFormSubmit(contactForm, formSuccess);
  }

  // ---------- Smooth Scroll for Anchor Links (enhance) ----------
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu after clicking anchor
        closeMobileMenu();
      }
    });
  });

  // ---------- Additional: Dropdown hover for touch devices? Not needed, CSS handles.
  // Ensure any other interactive elements.

  // ---------- Initialize any pre-expanded FAQ? Not needed.

  // ---------- Fix for back to top click ----------
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Expose functions globally for inline onclick usage ----------
  window.toggleFaq = toggleFaq;
  window.toggleBlogPost = toggleBlogPost;
  window.closeMobileMenu = closeMobileMenu;

})();
