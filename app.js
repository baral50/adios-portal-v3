/* ═══════════════════════════════════════════════════════════
   AdiOS Portal v3 — App JS
   Sequoia-style: calm, restrained, editorial animations
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── Terminal Boot Sequence ─── */
const BOOT_LINES = [
  '$ adios init --sovereign',
  '',
  '  AdiOS v3.0.0 — Architecture-Driven Intelligent OS',
  '  © 2026 AdiOS Platform Private Limited',
  '',
  '  [KERNEL]      Loading substrate layer ............... OK',
  '  [BRAIN]       Initializing knowledge graph ........... OK',
  '  [LAKEHOUSE]   Connecting data fabric ................. OK',
  '  [SENTINEL]    Enforcing governance policies .......... OK',
  '  [QUERY]       Planner warm — 127ms avg latency ........ OK',
  '',
  '  38 components loaded · 5 divisions active',
  '  1,570+ tests passing · Confidence: 0.94',
  '',
  '  System status: SOVEREIGN · Zero cloud egress',
  '',
  '  Boot complete. ▊',
];

function runTerminal() {
  const el = document.getElementById('terminal-output');
  if (!el) return;

  let lineIdx = 0;
  let charIdx = 0;
  let output = '';

  function typeChar() {
    if (lineIdx >= BOOT_LINES.length) return;

    const line = BOOT_LINES[lineIdx];

    if (charIdx < line.length) {
      output += line[charIdx];
      charIdx++;
      el.textContent = output + '▊';
      setTimeout(typeChar, line.startsWith('  [') ? 14 : line.startsWith('$') ? 60 : 20);
    } else {
      output += '\n';
      el.textContent = output + '▊';
      lineIdx++;
      charIdx = 0;
      const delay = lineIdx === 1 ? 80 : 40;
      setTimeout(typeChar, delay);
    }
  }

  // Start after a short pause
  setTimeout(typeChar, 600);
}

/* ─── Particle Canvas (scattered warm dots) ─── */
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animFrame = null;
    this.resize();
    this.init();
    this.animate();
    window.addEventListener('resize', () => this.resize(), { passive: true });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    // Warm scattered dots — sparse, calm
    const count = Math.floor((window.innerWidth * window.innerHeight) / 28000);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const colors = ['#CA5C3D', '#2A6B5A', '#DBCDB3', '#C4B498', '#8B7355'];
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      r: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.25 + 0.05,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      alphaDelta: Math.random() * 0.003 + 0.001,
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Gentle alpha pulse
      p.alpha += p.alphaDelta * p.alphaDir;
      if (p.alpha > 0.3 || p.alpha < 0.03) p.alphaDir *= -1;

      // Wrap around edges
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.y > this.canvas.height + 10) p.y = -10;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
    this.animFrame = requestAnimationFrame(() => this.animate());
  }
}

/* ─── Header Scroll State ─── */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── Hamburger + Mobile Nav ─── */
function initMobileNav() {
  const btn = document.getElementById('hamburger-btn');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open.toString());
    nav.setAttribute('aria-hidden', (!open).toString());
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ─── Reveal on scroll (IntersectionObserver) ─── */
function initReveal() {
  const elements = document.querySelectorAll('.reveal-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ─── Sidebar Scroll-Spy ─── */
function initScrollSpy() {
  const sidebarItems = document.querySelectorAll('.sidebar-item[data-section]');
  if (!sidebarItems.length) return;

  const sections = [];
  sidebarItems.forEach(item => {
    const id = item.dataset.section;
    const el = document.getElementById(id);
    if (el) sections.push({ id, el, item });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        sidebarItems.forEach(item => {
          item.classList.toggle('active', item.dataset.section === id);
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(({ el }) => observer.observe(el));
}

/* ─── Smooth Scroll for sidebar/header nav ─── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ─── Counter animations ─── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ─── Market bar animations ─── */
function initMarketBars() {
  const gpuBar = document.getElementById('gpu-bar');
  const marketBarFuture = document.getElementById('market-bar-future');
  const insightBar1 = document.getElementById('insight-bar-1');
  const insightBar2 = document.getElementById('insight-bar-2');
  const insightStat1 = document.getElementById('insight-stat-1');
  const insightStat2 = document.getElementById('insight-stat-2');

  const animateValue = (el, from, to, duration, suffix = '') => {
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(easeOut(progress) * (to - from) + from) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const targets = [
    { el: gpuBar, action: () => { gpuBar.style.width = '19%'; } },
    { el: marketBarFuture, action: () => { marketBarFuture.style.width = '100%'; } },
    {
      el: insightBar1, action: () => {
        insightBar1.style.width = '87%';
        if (insightStat1) animateValue(insightStat1, 0, 87, 1200, '%');
      }
    },
    {
      el: insightBar2, action: () => {
        // stays 0%
        if (insightStat2) {
          insightStat2.textContent = '0%';
          insightStat2.style.color = 'var(--text-secondary)';
        }
      }
    },
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const found = targets.find(t => t.el === entry.target);
        if (found) {
          found.action();
          observer.unobserve(entry.target);
        }
      }
    });
  }, { threshold: 0.4 });

  targets.forEach(({ el }) => { if (el) observer.observe(el); });
}

/* ─── Loop SVG animation ─── */
function initLoopAnimation() {
  const circle = document.getElementById('loop-circle');
  const dot = document.getElementById('loop-dot');
  if (!circle || !dot) return;

  let isAnimating = false;

  // Animate the circle draw on scroll
  const circleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isAnimating) {
        isAnimating = true;
        // Draw circle
        circle.style.transition = 'stroke-dashoffset 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        circle.style.strokeDashoffset = '0';

        // Animate dot along path
        setTimeout(() => animateDot(), 600);
      }
    });
  }, { threshold: 0.3 });

  const loopSvg = document.getElementById('loop-svg');
  if (loopSvg) circleObserver.observe(loopSvg);

  // Node positions on the circle (cx=200, cy=200, r=140)
  const nodePositions = [
    { x: 200, y: 60 },   // USE — top
    { x: 333, y: 153 },  // OBSERVE — right
    { x: 310, y: 293 },  // LEARN — bottom right
    { x: 90, y: 293 },   // INTELLIGENCE — bottom left
    { x: 67, y: 153 },   // VALUE — left
    { x: 200, y: 60 },   // back to USE
  ];

  let dotStepIdx = 0;
  let dotAnimFrame = null;

  function animateDot() {
    dotStepIdx = 0;
    moveDotStep();
  }

  function moveDotStep() {
    if (dotStepIdx >= nodePositions.length - 1) {
      // Restart after pause
      setTimeout(() => {
        dotStepIdx = 0;
        moveDotStep();
      }, 2000);
      return;
    }

    const from = nodePositions[dotStepIdx];
    const to = nodePositions[dotStepIdx + 1];
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease in-out

      const x = from.x + (to.x - from.x) * eased;
      const y = from.y + (to.y - from.y) * eased;

      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);

      if (t < 1) {
        dotAnimFrame = requestAnimationFrame(tick);
      } else {
        dotStepIdx++;
        setTimeout(moveDotStep, 300);
      }
    }

    if (dotAnimFrame) cancelAnimationFrame(dotAnimFrame);
    dotAnimFrame = requestAnimationFrame(tick);
  }

  // Set initial dot position
  dot.setAttribute('cx', nodePositions[0].x);
  dot.setAttribute('cy', nodePositions[0].y);
}

/* ─── Trust SVG animation ─── */
function initTrustAnimation() {
  const svg = document.getElementById('trust-svg');
  const mover = document.getElementById('trust-mover');
  if (!svg || !mover) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateTrustMover();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(svg);

  // Positions: start(60,70) → d1 gate → d2(280,70) → gate2 → d3(540,70)
  const waypoints = [
    { x: 60, y: 70, delay: 0 },
    { x: 170, y: 70, delay: 800 },
    { x: 280, y: 70, delay: 600 },
    { x: 390, y: 70, delay: 800 },
    { x: 540, y: 70, delay: 600 },
  ];

  mover.setAttribute('cx', 60);
  mover.setAttribute('cy', 70);

  function animateTrustMover() {
    let idx = 0;

    function step() {
      if (idx >= waypoints.length - 1) return;
      const from = waypoints[idx];
      const to = waypoints[idx + 1];
      const duration = 700;
      const start = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        mover.setAttribute('cx', from.x + (to.x - from.x) * eased);
        mover.setAttribute('cy', from.y + (to.y - from.y) * eased);

        // Change color as it progresses
        if (t > 0.5 && idx === 1) mover.setAttribute('fill', '#CA5C3D');
        if (t > 0.5 && idx === 3) mover.setAttribute('fill', '#FFAA44');

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          idx++;
          if (idx < waypoints.length - 1) {
            setTimeout(step, to.delay || 400);
          }
        }
      }
      requestAnimationFrame(tick);
    }

    setTimeout(step, 400);
  }
}

/* ─── Query flow line draw animation ─── */
function initQueryFlow() {
  const svg = document.getElementById('query-flow-svg');
  if (!svg) return;

  let drawn = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !drawn) {
        drawn = true;
        const lines = svg.querySelectorAll('.flow-line');
        lines.forEach((line, i) => {
          setTimeout(() => line.classList.add('drawn'), i * 80);
        });
      }
    });
  }, { threshold: 0.4 });

  observer.observe(svg);
}

/* ─── Waitlist form ─── */
function initWaitlistForm() {
  const form = document.getElementById('waitlist-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('wl-submit');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#wl-name').value.trim();
    const email = form.querySelector('#wl-email').value.trim();

    if (!name || !email) {
      // Simple shake animation
      form.style.animation = 'shake 0.3s ease';
      setTimeout(() => form.style.animation = '', 300);
      return;
    }

    // Disable submit
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Simulate async submission
    await new Promise(r => setTimeout(r, 800));

    form.querySelectorAll('.form-row, .form-group').forEach(el => {
      el.style.opacity = '0.4';
      el.style.pointerEvents = 'none';
    });
    submitBtn.style.display = 'none';

    if (success) {
      success.classList.add('show');
    }
  });
}

/* ─── Arch layer expand on click (blueprint reveal) ─── */
function initArchLayers() {
  document.querySelectorAll('.arch-layer').forEach(layer => {
    const comps = layer.querySelector('.arch-layer-components');
    if (!comps) return;

    // On initial load — show all (they're visible by default)
    // On hover — highlight them (CSS handles it)
    // No extra JS needed beyond CSS
  });
}

/* ─── Add shake keyframe ─── */
function addShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `@keyframes shake {
    0%,100%{transform:translateX(0)}
    25%{transform:translateX(-6px)}
    75%{transform:translateX(6px)}
  }`;
  document.head.appendChild(style);
}

/* ─── Prologue stat counter trigger ─── */
function initPrologueCounters() {
  const ribbon = document.querySelector('.stat-ribbon');
  if (!ribbon) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        ribbon.querySelectorAll('.stat-number[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 1000 + Math.random() * 400;
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor(easeOut(p) * target).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(ribbon);
}

/* ─── Init all ─── */
document.addEventListener('DOMContentLoaded', () => {
  addShakeKeyframe();
  new ParticleSystem();
  runTerminal();
  initHeader();
  initMobileNav();
  initReveal();
  initScrollSpy();
  initSmoothScroll();
  initCounters();
  initPrologueCounters();
  initMarketBars();
  initLoopAnimation();
  initTrustAnimation();
  initQueryFlow();
  initArchLayers();
  initWaitlistForm();
});
