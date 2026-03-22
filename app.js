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
  '  Boot complete.',
];

function runTerminal() {
  const el = document.getElementById('terminal-output');
  if (!el) return;

  let lineIdx = 0;
  let charIdx = 0;
  let output = '';
  let cursorBlinkCount = 0;
  let cursorVisible = true;
  let cursorInterval = null;

  // Blinking cursor
  function startCursorBlink(final) {
    cursorBlinkCount = 0;
    cursorInterval = setInterval(() => {
      cursorVisible = !cursorVisible;
      el.textContent = output + (cursorVisible ? '▊' : '');
      cursorBlinkCount++;
      if (final && cursorBlinkCount >= 6) {
        clearInterval(cursorInterval);
        el.textContent = output; // remove cursor
      }
    }, 400);
  }

  function typeChar() {
    if (lineIdx >= BOOT_LINES.length) {
      // All done — blink cursor 3 times then stop
      startCursorBlink(true);
      return;
    }

    const line = BOOT_LINES[lineIdx];

    if (charIdx < line.length) {
      output += line[charIdx];
      charIdx++;
      el.textContent = output + '▊';
      const delay = line.startsWith('  [') ? 14 : line.startsWith('$') ? 60 : 22;
      setTimeout(typeChar, delay);
    } else {
      output += '\n';
      el.textContent = output + '▊';
      lineIdx++;
      charIdx = 0;
      const delay = lineIdx === 1 ? 80 : 40;
      setTimeout(typeChar, delay);
    }
  }

  setTimeout(typeChar, 600);
}

/* ─── Particle Canvas (scattered warm dots using logo colors) ─── */
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
    const count = Math.floor((window.innerWidth * window.innerHeight) / 28000);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    // Logo colors: teal, amber, navy, cream border
    const colors = ['#3B9B8F', '#E8973F', '#2D3E50', '#DBCDB3', '#C4B498'];
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      r: Math.random() * 2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.22 + 0.04,
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
      p.alpha += p.alphaDelta * p.alphaDir;
      if (p.alpha > 0.28 || p.alpha < 0.03) p.alphaDir *= -1;

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
  // Standard reveal-up elements
  const elements = document.querySelectorAll('.reveal-up');
  if (elements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });
    elements.forEach(el => observer.observe(el));
  }

  // Stagger containers — stagger children with 150ms intervals
  const staggerContainers = document.querySelectorAll('.reveal-stagger');
  if (staggerContainers.length) {
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = Array.from(entry.target.children);
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.15}s`;
          });
          entry.target.classList.add('visible');
          staggerObserver.unobserve(entry.target);
          // Trigger border-draw on children
          children.forEach((child, i) => {
            if (child.classList.contains('card-border-draw')) {
              setTimeout(() => child.classList.add('border-drawn'), i * 150 + 200);
            }
          });
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });
    staggerContainers.forEach(el => staggerObserver.observe(el));
  }

  // Border-draw standalone cards
  const borderCards = document.querySelectorAll('.card-border-draw:not(.reveal-stagger *)');
  if (borderCards.length) {
    const borderObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('border-drawn');
          borderObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    borderCards.forEach(el => borderObserver.observe(el));
  }
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

/* ─── easeOutExpo ─── */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* ─── Counter animations ─── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOutExpo(progress) * target);
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

/* ─── Market bar animations with elastic easing ─── */
function initMarketBars() {
  const gpuBar = document.getElementById('gpu-bar');
  const marketBarFuture = document.getElementById('market-bar-future');
  const insightBar1 = document.getElementById('insight-bar-1');
  const insightBar2 = document.getElementById('insight-bar-2');
  const insightStat1 = document.getElementById('insight-stat-1');
  const insightStat2 = document.getElementById('insight-stat-2');

  const animateValue = (el, from, to, duration, suffix = '') => {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(easeOutExpo(progress) * (to - from) + from) + suffix;
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
        if (insightStat1) animateValue(insightStat1, 0, 87, 1400, '%');
      }
    },
    {
      el: insightBar2, action: () => {
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

/* ─── Act V Loop animation: comet trail + gradient ring rotation ─── */
function initLoopAnimation() {
  const circle = document.getElementById('loop-circle');
  const dot = document.getElementById('loop-dot');
  const svg = document.getElementById('loop-svg');
  if (!circle || !dot || !svg) return;

  let isAnimating = false;
  let trailDots = [];

  // Gradient ring slow rotation
  let gradientAngle = 0;
  const gradient = svg.querySelector('#loopGradient');
  function rotateGradient() {
    if (!gradient) return;
    gradientAngle = (gradientAngle + 0.2) % 360;
    const rad = (gradientAngle * Math.PI) / 180;
    const x2 = (Math.cos(rad) * 0.5 + 0.5) * 100;
    const y2 = (Math.sin(rad) * 0.5 + 0.5) * 100;
    gradient.setAttribute('x1', (100 - x2) + '%');
    gradient.setAttribute('y1', (100 - y2) + '%');
    gradient.setAttribute('x2', x2 + '%');
    gradient.setAttribute('y2', y2 + '%');
    requestAnimationFrame(rotateGradient);
  }
  rotateGradient();

  // Create trail circles in SVG
  function createTrail() {
    for (let i = 0; i < 6; i++) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', 6 - i * 0.7);
      c.setAttribute('fill', '#3B9B8F');
      c.setAttribute('opacity', 0);
      c.classList.add('loop-comet-trail');
      svg.insertBefore(c, dot);
      trailDots.push({ el: c, x: 200, y: 60, alpha: 0 });
    }
  }
  createTrail();

  const circleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isAnimating) {
        isAnimating = true;
        circle.style.transition = 'stroke-dashoffset 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        circle.style.strokeDashoffset = '0';
        setTimeout(() => animateDot(), 600);
      }
    });
  }, { threshold: 0.3 });

  circleObserver.observe(svg);

  const nodePositions = [
    { x: 200, y: 60 },
    { x: 333, y: 153 },
    { x: 310, y: 293 },
    { x: 90, y: 293 },
    { x: 67, y: 153 },
    { x: 200, y: 60 },
  ];

  let dotStepIdx = 0;
  let dotAnimFrame = null;
  let prevPositions = [];

  function updateTrail(x, y) {
    prevPositions.unshift({ x, y });
    if (prevPositions.length > trailDots.length) prevPositions.pop();
    trailDots.forEach((t, i) => {
      const pos = prevPositions[i] || { x, y };
      t.el.setAttribute('cx', pos.x);
      t.el.setAttribute('cy', pos.y);
      const alpha = Math.max(0, 0.45 - i * 0.07);
      t.el.setAttribute('opacity', alpha);
    });
  }

  function animateDot() {
    dotStepIdx = 0;
    prevPositions = [];
    moveDotStep();
  }

  function moveDotStep() {
    if (dotStepIdx >= nodePositions.length - 1) {
      setTimeout(() => {
        dotStepIdx = 0;
        prevPositions = [];
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
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const x = from.x + (to.x - from.x) * eased;
      const y = from.y + (to.y - from.y) * eased;

      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      updateTrail(x, y);

      // Color shift per segment
      dot.setAttribute('fill', dotStepIdx % 2 === 0 ? '#3B9B8F' : '#E8973F');

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

  dot.setAttribute('cx', nodePositions[0].x);
  dot.setAttribute('cy', nodePositions[0].y);
}

/* ─── Trust SVG animation: comet trail + tier pulse ─── */
function initTrustAnimation() {
  const svg = document.getElementById('trust-svg');
  const mover = document.getElementById('trust-mover');
  if (!svg || !mover) return;

  // Create comet trail for trust mover
  const trailCount = 5;
  const trails = [];
  for (let i = 0; i < trailCount; i++) {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('r', 5 - i * 0.6);
    c.setAttribute('fill', '#E8973F');
    c.setAttribute('opacity', 0);
    svg.insertBefore(c, mover);
    trails.push(c);
  }

  let trailPositions = [];
  function updateTrail(x, y) {
    trailPositions.unshift({ x, y });
    if (trailPositions.length > trailCount) trailPositions.pop();
    trails.forEach((t, i) => {
      const pos = trailPositions[i] || { x, y };
      t.setAttribute('cx', pos.x);
      t.setAttribute('cy', pos.y);
      t.setAttribute('opacity', Math.max(0, 0.4 - i * 0.08));
    });
  }

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

  const tierIds = ['trust-d1', 'trust-gate1', 'trust-d2', 'trust-gate2', 'trust-d3'];
  const waypoints = [
    { x: 60, y: 70, delay: 0 },
    { x: 170, y: 70, delay: 800 },
    { x: 280, y: 70, delay: 600 },
    { x: 390, y: 70, delay: 800 },
    { x: 540, y: 70, delay: 600 },
  ];

  mover.setAttribute('cx', 60);
  mover.setAttribute('cy', 70);

  function pulseTier(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transition = 'filter 0.3s';
    el.style.filter = 'drop-shadow(0 0 8px rgba(232, 151, 63, 0.8))';
    setTimeout(() => { el.style.filter = ''; }, 600);
  }

  function animateTrustMover() {
    let idx = 0;
    trailPositions = [];

    function step() {
      if (idx >= waypoints.length - 1) return;
      const from = waypoints[idx];
      const to = waypoints[idx + 1];
      const duration = 700;
      const start = performance.now();

      pulseTier(tierIds[idx]);

      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const x = from.x + (to.x - from.x) * eased;
        const y = from.y + (to.y - from.y) * eased;
        mover.setAttribute('cx', x);
        mover.setAttribute('cy', y);
        updateTrail(x, y);

        if (t > 0.5 && idx === 1) mover.setAttribute('fill', '#3B9B8F');
        if (t > 0.5 && idx === 3) mover.setAttribute('fill', '#E8973F');

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          pulseTier(tierIds[idx + 1]);
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

/* ─── Query flow: glowing amber pulse travels along lines ─── */
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
          setTimeout(() => {
            line.classList.add('drawn');
            // Add glowing pulse dot traveling along the line
            addPulseOnLine(line, i);
          }, i * 80);
        });
      }
    });
  }, { threshold: 0.4 });

  observer.observe(svg);

  function addPulseOnLine(line, delay) {
    setTimeout(() => {
      const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulse.setAttribute('r', '4');
      pulse.setAttribute('fill', '#E8973F');
      pulse.setAttribute('filter', 'url(#ambGlow)');
      pulse.setAttribute('opacity', '0.9');
      svg.appendChild(pulse);

      // Get line endpoints
      const x1 = parseFloat(line.getAttribute('x1') || 0);
      const y1 = parseFloat(line.getAttribute('y1') || 0);
      const x2 = parseFloat(line.getAttribute('x2') || 0);
      const y2 = parseFloat(line.getAttribute('y2') || 0);

      const duration = 600;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        pulse.setAttribute('cx', x1 + (x2 - x1) * t);
        pulse.setAttribute('cy', y1 + (y2 - y1) * t);
        pulse.setAttribute('opacity', 0.9 * (1 - t));
        if (t < 1) requestAnimationFrame(tick);
        else pulse.remove();
      }
      requestAnimationFrame(tick);
    }, delay * 120 + 400);
  }

  // Add amber glow filter if not present
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.insertBefore(defs, svg.firstChild);
  }
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.setAttribute('id', 'ambGlow');
  filter.innerHTML = '<feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>';
  defs.appendChild(filter);
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
      form.style.animation = 'shake 0.3s ease';
      setTimeout(() => form.style.animation = '', 300);
      return;
    }

    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

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

/* ─── Arch layer expand — waterfall cascade tags ─── */
function initArchLayers() {
  document.querySelectorAll('.arch-layer').forEach(layer => {
    const comps = layer.querySelector('.arch-layer-components');
    if (!comps) return;

    let cascaded = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !cascaded) {
          cascaded = true;
          const spans = Array.from(comps.querySelectorAll('span'));
          spans.forEach((span, i) => {
            span.style.opacity = '0';
            span.style.transform = 'translateX(-12px)';
            span.style.transition = `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`;
            setTimeout(() => {
              span.style.opacity = '1';
              span.style.transform = 'translateX(0)';
            }, 100 + i * 50);
          });
        }
      });
    }, { threshold: 0.3 });

    observer.observe(layer);
  });
}

/* ─── Act I: Traditional side drift, AdiOS side pulse ─── */
function initAct1Diagram() {
  const svg = document.querySelector('.comp-svg');
  if (!svg) return;

  let observed = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !observed) {
        observed = true;
        // Elements on Traditional side (left half) drift slightly
        const traditionalEls = svg.querySelectorAll('[transform^="translate(40"]');
        traditionalEls.forEach(el => {
          el.style.animation = 'traditionalDrift 3s ease-in-out infinite';
        });
        // AdiOS side (right half) pulses with glow
        const adiosEls = svg.querySelectorAll('[transform^="translate(320"]');
        adiosEls.forEach(el => {
          el.style.animation = 'adiosPulse 2.5s ease-in-out infinite';
        });
      }
    });
  }, { threshold: 0.4 });

  observer.observe(svg);
}

/* ─── Prologue stat counter trigger ─── */
function initPrologueCounters() {
  const ribbon = document.querySelector('.stat-ribbon');
  if (!ribbon) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        ribbon.querySelectorAll('.stat-number[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 1200 + Math.random() * 400;
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor(easeOutExpo(p) * target).toLocaleString() + suffix;
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

/* ─── Parallax on scroll ─── */
function initParallax() {
  const tintSections = document.querySelectorAll('.section-teal-tint, .section-amber-tint, .section-alt');
  if (!tintSections.length) return;

  window.addEventListener('scroll', () => {
    tintSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewH) return;
      const scrolled = -rect.top * 0.5;
      section.style.backgroundPositionY = `${scrolled}px`;
    });
  }, { passive: true });
}

/* ─── Add keyframes ─── */
function addKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      25%{transform:translateX(-6px)}
      75%{transform:translateX(6px)}
    }
    @keyframes traditionalDrift {
      0%,100%{transform:translate(40px, 60px) translateX(0);}
      50%{transform:translate(40px, 60px) translateX(2px) translateY(1px);}
    }
    @keyframes adiosPulse {
      0%,100%{filter:drop-shadow(0 0 0px rgba(59,155,143,0));}
      50%{filter:drop-shadow(0 0 8px rgba(59,155,143,0.5));}
    }
  `;
  document.head.appendChild(style);
}

/* ─── Init all ─── */
document.addEventListener('DOMContentLoaded', () => {
  addKeyframes();
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
  initAct1Diagram();
  initWaitlistForm();
  initParallax();
});
