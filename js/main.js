/* ==========================================================
   MAIN JS — Anant Kumar Portfolio
   Handles: scroll-reveal, nav scroll state, focus bars,
            parallax, mobile menu
   ========================================================== */

(function () {
  'use strict';

  /* ── Scroll-reveal ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ── Focus progress bars ────────────────────────────────── */
  const fills = document.querySelectorAll('.focus__fill');
  if (fills.length) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    fills.forEach((f) => barObserver.observe(f));
  }

  /* ── Nav scroll state ───────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ── Mobile menu ────────────────────────────────────────── */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) mobileMenu.classList.remove('open');
    });
  }

  /* ── Subtle parallax on hero portrait ──────────────────── */
  const portrait = document.querySelector('.hero__portrait-wrap');
  if (portrait) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.08;
      portrait.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  /* ── Animate stat numbers on scroll ────────────────────── */
  function animateCount(el, target, suffix) {
    const duration = 1400;
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const val = isFloat
        ? (eased * target).toFixed(1)
        : Math.floor(eased * target);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            animateCount(el, target, suffix);
            statObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNums.forEach((el) => statObserver.observe(el));
  }
})();
