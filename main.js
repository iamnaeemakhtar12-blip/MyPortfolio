/* ═══════════════════════════════════════════════
   ALEX REYES — PORTFOLIO JAVASCRIPT
   Features: Navbar, Lightbox, Filter, AOS,
             Counter Anim, Form, Mobile Menu
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR SCROLL EFFECT ───────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });


  /* ── 2. MOBILE MENU ────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  let menuOpen = false;

  const toggleMenu = (open) => {
    menuOpen = open;
    mobileMenu.classList.toggle('open', open);
    // Animate hamburger spans
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggleMenu(!menuOpen));
  mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));


  /* ── 3. SMOOTH ACTIVE NAV LINK ─────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const activateNav = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--amber)' : '';
    });
  };
  window.addEventListener('scroll', activateNav, { passive: true });


  /* ── 4. AOS — SCROLL REVEAL ────────────────── */
  const aosEls = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling items in same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('[data-aos]')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, idx * 80);
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  aosEls.forEach(el => aosObserver.observe(el));


  /* ── 5. STAT COUNTER ANIMATION ─────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const countUp = (el) => {
    const target   = +el.dataset.target;
    const duration = 1800;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));


  /* ── 6. PORTFOLIO FILTER ───────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          item.classList.remove('hidden');
          // Re-trigger animation
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            setTimeout(() => {
              item.style.opacity   = '';
              item.style.transform = '';
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            }, 10);
          });
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  /* ── 7. VIDEO LIGHTBOX ─────────────────────── */
  const lightbox       = document.getElementById('lightbox');
  const lightboxVideo  = document.getElementById('lightboxVideo');
  const lightboxSource = document.getElementById('lightboxSource');
  const lightboxTitle  = document.getElementById('lightboxTitle');
  const lightboxCat    = document.getElementById('lightboxCat');
  const lightboxClose  = document.getElementById('lightboxClose');
  const playBtns       = document.querySelectorAll('.play-btn');

  const openLightbox = (videoSrc, title, cat) => {
    lightboxSource.src = videoSrc;
    lightboxTitle.textContent = title;
    lightboxCat.textContent = cat;
    lightboxVideo.load();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Try to play — browser may block until user interacts
    lightboxVideo.play().catch(() => {});
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightboxVideo.pause();
    lightboxVideo.src = '';
    lightboxSource.src = '';
    document.body.style.overflow = '';
  };

  playBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const video = btn.dataset.video;
      const title = btn.dataset.title;
      const cat   = btn.dataset.cat;
      openLightbox(video, title, cat);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });


  /* ── 8. CONTACT FORM ───────────────────────── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect data (you'll connect to Netlify Forms or EmailJS)
      const data = {
        name:    form.name.value,
        email:   form.email.value,
        service: form.service.value,
        budget:  form.budget.value,
        message: form.message.value,
      };

      // === OPTION A: Netlify Forms (zero-code) ===
      // Just add  data-netlify="true"  to the <form> tag in HTML
      // and Netlify handles everything. Remove the e.preventDefault() above.

      // === OPTION B: EmailJS (free tier available) ===
      // import emailjs and call:
      // emailjs.send('SERVICE_ID', 'TEMPLATE_ID', data)

      // === Currently: simulate success for demo ===
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.textContent = 'Send Message →';
        submitBtn.disabled = false;
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1200);

      console.log('Form data:', data);
    });
  }


  /* ── 9. HERO VIDEO FALLBACK ────────────────── */
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroVideo.addEventListener('error', () => {
      // Video not found — show gradient bg instead
      const heroBg = document.querySelector('.hero-bg');
      if (heroBg) {
        heroBg.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)';
      }
    });
  }


  /* ── 10. CURSOR GLOW (desktop only) ───────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: var(--amber, #e8a020);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: transform 0.1s ease, opacity 0.3s;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(cursor);

    const cursorRing = document.createElement('div');
    cursorRing.style.cssText = `
      position: fixed;
      width: 36px;
      height: 36px;
      border: 1px solid rgba(232, 160, 32, 0.4);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9997;
      transform: translate(-50%, -50%);
      transition: transform 0.25s ease, width 0.25s ease, height 0.25s ease;
    `;
    document.body.appendChild(cursorRing);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    // Lag ring
    const animateRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Expand on interactive elements
    const interactables = document.querySelectorAll('a, button, .portfolio-item, input, select, textarea');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width  = '56px';
        cursorRing.style.height = '56px';
        cursorRing.style.borderColor = 'rgba(232, 160, 32, 0.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width  = '36px';
        cursorRing.style.height = '36px';
        cursorRing.style.borderColor = 'rgba(232, 160, 32, 0.4)';
      });
    });
  }


  /* ── 11. TICKER PAUSE ON HOVER ─────────────── */
  const ticker = document.querySelector('.ticker');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  }


  /* ── INIT ──────────────────────────────────── */
  onScroll();
  activateNav();

}); // end DOMContentLoaded
