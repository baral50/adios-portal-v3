/**
 * AdiOS Platform Portal v3 — The Manifesto
 * app.js — Starfield, Boot Sequence, Scroll Animations, Charts, Interactivity
 */

'use strict';

// ═══════════════════════════════════════════════
// STARFIELD CANVAS
// ═══════════════════════════════════════════════

(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStar() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.5 + 0.05,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
      // Occasional teal stars
      teal:  Math.random() < 0.04,
    };
  }

  function initStars() {
    const count = Math.min(Math.floor((W * H) / 6000), 280);
    stars = Array.from({ length: count }, createStar);
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.005;

    stars.forEach(s => {
      const pulse = Math.sin(t + s.phase) * 0.25;
      const alpha = Math.max(0, s.alpha + pulse);

      // Drift very slowly
      s.x += Math.sin(s.phase + t * 0.3) * s.speed;
      s.y += Math.cos(s.phase + t * 0.2) * s.speed * 0.5;

      // Wrap
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H;
      if (s.y > H) s.y = 0;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);

      if (s.teal) {
        ctx.fillStyle = `rgba(78,205,196,${alpha * 0.8})`;
      } else {
        ctx.fillStyle = `rgba(232,230,227,${alpha})`;
      }

      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  resize();
  initStars();
  draw();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    initStars();
    draw();
  }, { passive: true });
})();


// ═══════════════════════════════════════════════
// SCROLL PROGRESS
// ═══════════════════════════════════════════════

(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function update() {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


// ═══════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════

(function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  // Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


// ═══════════════════════════════════════════════
// SECTION DOTS
// ═══════════════════════════════════════════════

(function initSectionDots() {
  const dots = document.querySelectorAll('.section-dot');
  const sections = document.querySelectorAll('section[data-section]');

  if (!dots.length || !sections.length) return;

  // Click → scroll
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const id = dot.getAttribute('data-section');
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // IntersectionObserver → active dot
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('data-section');
        dots.forEach(d => {
          d.classList.toggle('active', d.getAttribute('data-section') === id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
})();


// ═══════════════════════════════════════════════
// BOOT SEQUENCE TERMINAL
// ═══════════════════════════════════════════════

(function initBootSequence() {
  const lines = document.querySelectorAll('.terminal-line');
  const ready = document.getElementById('terminal-ready');
  const statItems = document.querySelectorAll('.stat-item');

  if (!lines.length) return;

  let started = false;

  function runBootSequence() {
    if (started) return;
    started = true;

    lines.forEach((line, i) => {
      setTimeout(() => {
        line.classList.add('visible');
        if (i === lines.length - 1 && ready) {
          setTimeout(() => {
            ready.classList.add('visible');
            animateStats();
          }, 600);
        }
      }, i * 420 + 300);
    });
  }

  function animateStats() {
    statItems.forEach((item, i) => {
      setTimeout(() => {
        item.classList.add('visible');
        const numEl = item.querySelector('.stat-number');
        if (numEl) {
          const target = parseInt(numEl.getAttribute('data-count'), 10);
          const suffix = numEl.getAttribute('data-suffix') || '';
          countUp(numEl, 0, target, 1200, suffix);
        }
      }, i * 150);
    });
  }

  function countUp(el, from, to, duration, suffix) {
    const startTime = performance.now();
    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(from + (to - from) * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Trigger when prologue is visible
  const prologue = document.getElementById('prologue');
  if (prologue) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(runBootSequence, 400);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(prologue);
  } else {
    setTimeout(runBootSequence, 800);
  }
})();


// ═══════════════════════════════════════════════
// GENERIC SCROLL REVEAL (IntersectionObserver)
// ═══════════════════════════════════════════════

(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.reveal, .brain-tier, .pillar-card, .arch-layer, .market-card, .patent-node, .coda-statement, .coda-logo, .boot-sovereign-coda'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));

  // Stagger children for certain containers
  document.querySelectorAll('.brain-tier').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.15) + 's';
  });
  document.querySelectorAll('.pillar-card').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.12) + 's';
  });
  document.querySelectorAll('.arch-layer').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.1) + 's';
  });
  document.querySelectorAll('.patent-node').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.1) + 's';
  });
  document.querySelectorAll('.market-card').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.12) + 's';
  });
})();


// ═══════════════════════════════════════════════
// ARCHITECTURE LAYER ACCORDION
// ═══════════════════════════════════════════════

(function initArchAccordion() {
  const layers = document.querySelectorAll('.arch-layer');

  layers.forEach(layer => {
    const header = layer.querySelector('.arch-layer-header');
    if (!header) return;

    function toggle() {
      const isOpen = layer.classList.contains('open');

      // Close all
      layers.forEach(l => {
        l.classList.remove('open');
        l.setAttribute('aria-expanded', 'false');
        const c = l.querySelector('.arch-components');
        if (c) c.setAttribute('aria-hidden', 'true');
      });

      // Open this one if it wasn't open
      if (!isOpen) {
        layer.classList.add('open');
        layer.setAttribute('aria-expanded', 'true');
        const c = layer.querySelector('.arch-components');
        if (c) c.setAttribute('aria-hidden', 'false');
      }
    }

    header.addEventListener('click', toggle);
    layer.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
})();


// ═══════════════════════════════════════════════
// TESTS COUNTER (Act IV)
// ═══════════════════════════════════════════════

(function initTestsCounter() {
  const counter = document.getElementById('tests-counter');
  if (!counter) return;

  let animated = false;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';

      const duration = 2000;
      const startTime = performance.now();

      function frame(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * eased);
        counter.textContent = current.toLocaleString() + (progress >= 1 ? suffix : '');
        if (progress < 1) requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
      obs.disconnect();
    }
  }, { threshold: 0.5 });

  obs.observe(counter);
})();


// ═══════════════════════════════════════════════
// MARKET BAR CHART ANIMATIONS
// ═══════════════════════════════════════════════

(function initMarketBars() {
  const bars = document.querySelectorAll('.market-bar-fill');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => obs.observe(bar));
})();


// ═══════════════════════════════════════════════
// MINI LINE CHARTS (Act VI) — Canvas-based
// ═══════════════════════════════════════════════

(function initMiniCharts() {
  function drawLineChart(canvasId, data, color1, color2) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 300;
    const H = canvas.offsetHeight || 80;
    canvas.width = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const minV = Math.min(...data);
    const maxV = Math.max(...data);
    const range = maxV - minV || 1;

    const pad = { t: 8, b: 8, l: 4, r: 4 };
    const chartW = W - pad.l - pad.r;
    const chartH = H - pad.t - pad.b;

    function xPos(i) { return pad.l + (i / (data.length - 1)) * chartW; }
    function yPos(v) { return pad.t + chartH - ((v - minV) / range) * chartH; }

    // Gradient fill
    const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + chartH);
    grad.addColorStop(0, color1 + '33');
    grad.addColorStop(1, color1 + '00');

    ctx.beginPath();
    data.forEach((v, i) => {
      i === 0 ? ctx.moveTo(xPos(i), yPos(v)) : ctx.lineTo(xPos(i), yPos(v));
    });
    ctx.lineTo(xPos(data.length - 1), yPos(minV));
    ctx.lineTo(xPos(0), yPos(minV));
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((v, i) => {
      i === 0 ? ctx.moveTo(xPos(i), yPos(v)) : ctx.lineTo(xPos(i), yPos(v));
    });
    ctx.strokeStyle = color1;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Dots at start and end
    [0, data.length - 1].forEach(i => {
      ctx.beginPath();
      ctx.arc(xPos(i), yPos(data[i]), 3, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? color1 : (color2 || color1);
      ctx.fill();
    });
  }

  // India AI market growth (billions)
  const indiaData = [7.6, 12, 18, 28, 45, 68, 126];
  // Enterprise AI (billions)
  const enterpriseData = [11, 15, 22, 31, 44, 57, 71];

  function renderCharts() {
    drawLineChart('chart-india',      indiaData,      '#4ecdc4', '#d4a843');
    drawLineChart('chart-enterprise', enterpriseData, '#d4a843', '#4ecdc4');
  }

  // Render when visible
  const chartSection = document.getElementById('act-6');
  if (chartSection) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        renderCharts();
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(chartSection);
  }

  window.addEventListener('resize', renderCharts, { passive: true });
})();


// ═══════════════════════════════════════════════
// WAITLIST FORM
// ═══════════════════════════════════════════════

(function initWaitlistForm() {
  const form = document.getElementById('waitlist-form');
  const success = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name  = document.getElementById('wl-name')?.value.trim();
    const email = document.getElementById('wl-email')?.value.trim();

    if (!name || !email) {
      // Simple inline validation
      if (!name) document.getElementById('wl-name')?.focus();
      else if (!email) document.getElementById('wl-email')?.focus();
      return;
    }

    // Simulate submission
    const btn = form.querySelector('.form-submit');
    if (btn) {
      btn.textContent = 'Sending...';
      btn.disabled = true;
    }

    setTimeout(() => {
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    }, 800);
  });
})();


// ═══════════════════════════════════════════════
// PATENT NODES — SVG DEPENDENCY LINES
// ═══════════════════════════════════════════════

(function initPatentDiagram() {
  // Animate nodes appearing
  const nodes = document.querySelectorAll('.patent-node');
  if (!nodes.length) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      nodes.forEach((node, i) => {
        setTimeout(() => node.classList.add('visible'), i * 120);
      });
      obs.disconnect();
    }
  }, { threshold: 0.1 });

  const section = document.getElementById('act-7');
  if (section) obs.observe(section);
})();


// ═══════════════════════════════════════════════
// CODA SEQUENTIAL REVEAL
// ═══════════════════════════════════════════════

(function initCoda() {
  const statements = document.querySelectorAll('.coda-statement');
  const logo = document.querySelector('.coda-logo');
  const sovereign = document.querySelector('.boot-sovereign-coda');

  if (!statements.length) return;

  const coda = document.getElementById('coda');
  if (!coda) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      statements.forEach((stmt, i) => {
        setTimeout(() => stmt.classList.add('visible'), i * 300);
      });
      setTimeout(() => {
        if (logo) logo.classList.add('visible');
      }, statements.length * 300 + 200);
      setTimeout(() => {
        if (sovereign) sovereign.classList.add('visible');
      }, statements.length * 300 + 600);
      obs.disconnect();
    }
  }, { threshold: 0.2 });

  obs.observe(coda);
})();


// ═══════════════════════════════════════════════
// KEYBOARD ACCESSIBILITY — SKIP TO MAIN
// ═══════════════════════════════════════════════

(function initA11y() {
  // Allow keyboard users to skip to content
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
})();


// ═══════════════════════════════════════════════
// AMBIENT GLOW EFFECT — Mouse parallax on prologue
// ═══════════════════════════════════════════════

(function initMouseGlow() {
  const prologue = document.getElementById('prologue');
  if (!prologue || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  prologue.addEventListener('mousemove', e => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const rect = prologue.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const logoIcon = prologue.querySelector('.logo-icon');
      if (logoIcon) {
        logoIcon.style.filter = `drop-shadow(${x * 20}px ${y * 20}px 40px rgba(78,205,196,${0.3 + Math.abs(x) * 0.2}))`;
      }

      ticking = false;
    });
  });
})();


// ═══════════════════════════════════════════════
// COMPONENT TAG HOVER ANIMATION
// ═══════════════════════════════════════════════

(function initComponentTags() {
  document.querySelectorAll('.component-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.transform = 'translateY(-2px)';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.transform = '';
    });
  });
})();


// ═══════════════════════════════════════════════
// REDUCED MOTION RESPECT
// ═══════════════════════════════════════════════

(function respectReducedMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--ease-out', 'linear');
    document.querySelectorAll('.logo-icon, .coda-logo').forEach(el => {
      el.style.animationDuration = '0s';
    });
  }
})();

// ─── Init complete ───
console.log('[AdiOS Portal v3] Initialized. Boot Sovereign.');
