/* ═══════════════════════════════════════════════════════════
   AdiOS Portal v3 — App Logic
   High-contrast journey: scroll-driven reveal, counter animations,
   SVG path drawing, circular loop, adaptive header
═══════════════════════════════════════════════════════════ */

/* ─── easing ─── */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ─── 1. TERMINAL TYPEWRITER ─── */
const BOOT_LINES = [
  '$ adios init --sovereign --mode=enterprise',
  '> mounting brain.kernel v1.4.2 ............ ✓',
  '> loading lakehouse.engine ................ ✓',
  '> activating sentinel.enforcement ......... ✓',
  '> 1,570 tests passing ..................... ✓',
  '> confidence.baseline: 0.70 → 0.95+ ....... ✓',
  '> query.latency: 127ms avg ................ ✓',
  '> data.egress: ZERO ...................... ✓',
  '',
  'SOVEREIGN MODE ACTIVE. Boot complete.',
];

function runTerminal() {
  const el = document.getElementById('terminal-output');
  if (!el) return;
  let lineIdx = 0;
  let charIdx = 0;
  let text = '';

  function tick() {
    if (lineIdx >= BOOT_LINES.length) {
      el.textContent = text + '_';
      // blink cursor
      let show = true;
      setInterval(() => {
        el.textContent = text + (show ? '_' : '');
        show = !show;
      }, 530);
      return;
    }
    const line = BOOT_LINES[lineIdx];
    if (charIdx < line.length) {
      text += line[charIdx];
      charIdx++;
      el.textContent = text + '_';
      setTimeout(tick, 18 + Math.random() * 16);
    } else {
      text += '\n';
      lineIdx++;
      charIdx = 0;
      setTimeout(tick, lineIdx <= 1 ? 120 : 40);
    }
  }
  setTimeout(tick, 800);
}

/* ─── 2. PARTICLE CANVAS ─── */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.4 + 0.3,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    alpha: Math.random() * 0.4 + 0.05,
    color: Math.random() > 0.5 ? '59,155,143' : '232,151,63',
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── 3. HEADER — adaptive light/dark ─── */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  // Sections with light backgrounds — header needs to go dark-text
  const lightSections = ['act-1', 'act-3', 'act-5', 'act-6', 'act-7', 'waitlist'];
  // Dark sections — header stays light-text  
  const darkSections = ['prologue', 'act-2', 'act-4', 'coda'];

  let lastScrollY = 0;

  function updateHeader() {
    const scrollY = window.scrollY;
    if (scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Find which section is at the top of the viewport
    const headerBottom = header.getBoundingClientRect().bottom;
    let currentSection = 'prologue';

    // Check dark sections
    for (const id of [...darkSections, ...lightSections]) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= headerBottom && rect.bottom > headerBottom) {
        currentSection = id;
        break;
      }
    }

    if (lightSections.includes(currentSection)) {
      header.classList.add('header-light');
    } else {
      header.classList.remove('header-light');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

/* ─── 4. SIDEBAR ACTIVE STATE ─── */
function initSidebar() {
  const items = document.querySelectorAll('.sidebar-item[data-section]');
  const sections = Array.from(items).map(i => document.getElementById(i.dataset.section)).filter(Boolean);

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        items.forEach(item => {
          item.classList.toggle('active', item.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

  sections.forEach(s => io.observe(s));
}

/* ─── 5. REVEAL ANIMATIONS — scroll-driven ─── */
function initReveal() {
  const ups = document.querySelectorAll('.reveal-up');
  const lefts = document.querySelectorAll('.reveal-left');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.05 });

  ups.forEach(el => io.observe(el));
  lefts.forEach(el => io.observe(el));

  // Stagger children
  const staggers = document.querySelectorAll('.reveal-stagger');
  const staggerIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        Array.from(entry.target.children).forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.18}s`;
        });
        staggerIO.unobserve(entry.target);
        // Card border draw
        setTimeout(() => {
          entry.target.querySelectorAll('.card-border-draw').forEach(c => {
            c.classList.add('border-drawn');
          });
        }, 400);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  staggers.forEach(el => staggerIO.observe(el));
}

/* ─── 6. STAT COUNTERS — easeOutExpo ─── */
function animateCounter(el, target, suffix, duration = 1400) {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutExpo(progress);
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString() + (suffix || '');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

/* ─── 7. MARKET BARS — animated on scroll ─── */
function initMarketBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;

      if (id === 'market-bar-now') {
        setTimeout(() => { entry.target.style.width = '6%'; }, 200);
      }
      if (id === 'market-bar-future') {
        setTimeout(() => { entry.target.style.width = '100%'; }, 500);
      }
      if (id === 'gpu-bar') {
        setTimeout(() => { entry.target.style.width = '19%'; }, 300); // 38k / 200k
      }
      if (id === 'insight-bar-1') {
        setTimeout(() => {
          entry.target.style.width = '87%';
          animateCounter(document.getElementById('insight-stat-1'), 87, '%', 1200);
        }, 400);
      }
      if (id === 'insight-bar-2') {
        setTimeout(() => {
          document.getElementById('insight-stat-2').textContent = '0%';
        }, 500);
      }

      io.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  ['market-bar-now', 'market-bar-future', 'gpu-bar', 'insight-bar-1', 'insight-bar-2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
}

/* ─── 8. SVG LINE DRAW — query flow ─── */
function initFlowLines() {
  const flowLines = document.querySelectorAll('.flow-line');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lines = entry.target.querySelectorAll('.flow-line');
        lines.forEach((line, i) => {
          setTimeout(() => {
            line.style.strokeDashoffset = '0';
          }, i * 80);
        });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const flowSVG = document.getElementById('query-flow-svg');
  if (flowSVG) io.observe(flowSVG);
}

/* ─── 9. TRUST SVG ANIMATION ─── */
function initTrustAnimation() {
  const svg = document.getElementById('trust-svg');
  if (!svg) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateTrustDot();
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  io.observe(svg);
}

function animateTrustDot() {
  const dot = document.getElementById('trust-mover');
  if (!dot) return;

  // Waypoints: personal (60,80) → gate1 (186,80) → domain (320,80) → gate2 (436,80) → enterprise (580,80)
  const waypoints = [
    { x: 60,  y: 80,  color: '#9AA3B0', scale: 1 },
    { x: 186, y: 80,  color: '#C07030', scale: 1 },
    { x: 320, y: 80,  color: '#E8973F', scale: 1.3 },
    { x: 436, y: 80,  color: '#E8973F', scale: 1.2 },
    { x: 580, y: 80,  color: '#3B9B8F', scale: 1.6 },
    { x: 60,  y: 80,  color: '#9AA3B0', scale: 1 },
  ];

  let idx = 0;
  function moveNext() {
    if (idx >= waypoints.length - 1) {
      idx = 0;
      setTimeout(moveNext, 1200);
      return;
    }
    const from = waypoints[idx];
    const to = waypoints[idx + 1];
    const dur = idx === 0 ? 600 : idx === 2 ? 800 : 500;
    const start = performance.now();

    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = easeInOutCubic(t);
      const x = from.x + (to.x - from.x) * eased;
      const y = from.y + (to.y - from.y) * eased;
      const r = (from.scale + (to.scale - from.scale) * eased) * 7;

      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', r);
      dot.setAttribute('fill', t > 0.5 ? to.color : from.color);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        idx++;
        setTimeout(moveNext, idx === waypoints.length - 1 ? 800 : 200);
      }
    }
    requestAnimationFrame(step);
  }
  moveNext();
}

/* ─── 10. CIRCULAR LOOP SVG ANIMATION ─── */
function initLoopAnimation() {
  const svg = document.getElementById('loop-svg');
  if (!svg) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startLoop();
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  io.observe(svg);
}

function startLoop() {
  const circle = document.getElementById('loop-circle');
  const dot = document.getElementById('loop-dot');
  const trail1 = document.getElementById('loop-trail1');
  const trail2 = document.getElementById('loop-trail2');
  const nodes = [
    document.getElementById('loop-n1'),
    document.getElementById('loop-n2'),
    document.getElementById('loop-n3'),
    document.getElementById('loop-n4'),
    document.getElementById('loop-n5'),
  ];
  if (!circle || !dot) return;

  // Draw the ring first
  const circumference = 942;
  circle.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.25,0.46,0.45,0.94)';
  setTimeout(() => { circle.style.strokeDashoffset = '0'; }, 200);

  // Orbit parameters — center (220,220), radius 150
  const cx = 220, cy = 220, r = 150;
  // Node positions by angle (degrees, measured clockwise from top = -90deg)
  const nodeAngles = [
    -90,   // USE (top)
    -24,   // OBSERVE (right-ish)
    54,    // LEARN (bottom right)
    126,   // INTELLIGENCE (bottom left)
    204,   // VALUE (left)
  ];

  let angle = -90; // start at top (USE)
  const SPEED = 0.35; // degrees per frame
  let trailAngle1 = angle - 12;
  let trailAngle2 = angle - 24;
  let raf;

  // Node pulse on pass
  let lastNodeIdx = 0;

  function step() {
    angle += SPEED;
    trailAngle1 = angle - 14;
    trailAngle2 = angle - 28;

    function angleToXY(a) {
      const rad = (a * Math.PI) / 180;
      return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
      };
    }

    const pos = angleToXY(angle);
    const t1 = angleToXY(trailAngle1);
    const t2 = angleToXY(trailAngle2);

    dot.setAttribute('cx', pos.x);
    dot.setAttribute('cy', pos.y);
    trail1.setAttribute('cx', t1.x);
    trail1.setAttribute('cy', t1.y);
    trail2.setAttribute('cx', t2.x);
    trail2.setAttribute('cy', t2.y);

    // Update gradient ring rotation subtly
    const normalizedAngle = ((angle % 360) + 360) % 360;
    circle.style.transform = `rotate(${normalizedAngle * 0.05}deg)`;

    // Pulse nearest node
    const currentNormAngle = ((angle % 360) + 360) % 360;
    nodeAngles.forEach((na, i) => {
      const normalNA = ((na % 360) + 360) % 360;
      const diff = Math.abs(currentNormAngle - normalNA);
      if (diff < 8 || diff > 352) {
        if (lastNodeIdx !== i) {
          lastNodeIdx = i;
          pulseNode(nodes[i]);
        }
      }
    });

    raf = requestAnimationFrame(step);
  }

  // Start after ring draw
  setTimeout(() => { raf = requestAnimationFrame(step); }, 800);
}

function pulseNode(node) {
  if (!node) return;
  node.style.transition = 'r 0.2s ease, opacity 0.2s ease';
  const origR = parseFloat(node.getAttribute('r')) || 28;
  node.setAttribute('r', origR * 1.3);
  setTimeout(() => {
    node.style.transition = 'r 0.4s ease';
    node.setAttribute('r', origR);
  }, 200);
}

/* ─── 11. HAMBURGER / MOBILE NAV ─── */
function initMobileNav() {
  const btn = document.getElementById('hamburger-btn');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    nav.setAttribute('aria-hidden', !open);
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ─── 12. ARCH LAYER CASCADE ─── */
function initArchLayers() {
  const layers = document.querySelectorAll('.arch-layer');
  layers.forEach(layer => {
    const components = layer.querySelectorAll('.arch-layer-components span');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          components.forEach((c, i) => {
            setTimeout(() => {
              c.classList.add('cascade-in');
            }, i * 55);
          });
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    io.observe(layer);
  });
}

/* ─── 13. WAITLIST FORM ─── */
function initForm() {
  const form = document.getElementById('waitlist-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('wl-submit');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameEl = document.getElementById('wl-name');
    const emailEl = document.getElementById('wl-email');

    if (!nameEl.value.trim() || !emailEl.value.trim()) {
      [nameEl, emailEl].forEach(el => {
        if (!el.value.trim()) {
          el.style.borderColor = '#E85555';
          el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
        }
      });
      return;
    }

    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    await new Promise(r => setTimeout(r, 900));
    success.classList.add('show');
    submitBtn.style.display = 'none';
  });
}

/* ─── 14. REVENUE CARD BORDER DRAW ─── */
function initRevenueBorderDraw() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.card-border-draw').forEach((c, i) => {
          setTimeout(() => c.classList.add('border-drawn'), i * 200);
        });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const revGrid = document.querySelector('.revenue-grid');
  if (revGrid) io.observe(revGrid);
}

/* ─── INIT ALL ─── */
document.addEventListener('DOMContentLoaded', () => {
  runTerminal();
  initParticles();
  initHeader();
  initSidebar();
  initReveal();
  initCounters();
  initMarketBars();
  initFlowLines();
  initTrustAnimation();
  initLoopAnimation();
  initMobileNav();
  initArchLayers();
  initForm();
  initRevenueBorderDraw();
});
