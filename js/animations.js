/* ========================================
   ForAll Sense — Pinned Scroll Animations
   Each section gets its own ScrollTrigger with pin: true
   ======================================== */

gsap.registerPlugin(ScrollTrigger);

function init() {
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initSVGPaths();

  if (isMobile || prefersReduced) {
    showStaticDevice();
    setupWaitlistForm();
    return;
  }

  setupHero();
  setupDrawIn();
  setupBeam();
  setupSpectrum();
  setupUseCases();
  setupPrice();
  setupNav();
  setupWaitlistForm();
}

// Init after fonts load, with a timeout fallback
if (document.fonts && document.fonts.ready) {
  Promise.race([
    document.fonts.ready,
    new Promise(r => setTimeout(r, 1500))
  ]).then(init);
} else {
  document.addEventListener('DOMContentLoaded', init);
}

/* ----------------------------------------
   SVG Init
   ---------------------------------------- */

function initSVGPaths() {
  document.querySelectorAll('[pathLength="1"]').forEach(el => {
    el.setAttribute('stroke-dasharray', '1');
    el.setAttribute('stroke-dashoffset', '1');
  });
}

function draw(tl, sel, dur, ease, pos) {
  tl.fromTo(sel,
    { attr: { 'stroke-dashoffset': 1 } },
    { attr: { 'stroke-dashoffset': 0 }, duration: dur, ease: ease || 'none' },
    pos
  );
}

function drawAll(tl, sel, dur, stagger, pos) {
  tl.fromTo(sel,
    { attr: { 'stroke-dashoffset': 1 } },
    { attr: { 'stroke-dashoffset': 0 }, duration: dur, stagger: stagger, ease: 'none' },
    pos
  );
}

/* Static fallback for mobile / reduced-motion */
function showStaticDevice() {
  gsap.set('[pathLength="1"]', { attr: { 'stroke-dashoffset': 0 } });
  gsap.set('#device-stage', { opacity: 1 });
  gsap.set('#screen-bg', { opacity: 1 });
  gsap.set('#screen-spectrum', { opacity: 1 });
  gsap.set('#screen-status', { opacity: 1 });
  gsap.set('.usecase-item', { opacity: 1, y: 0 });
}

/* ----------------------------------------
   HERO — fades out on scroll
   ---------------------------------------- */

function setupHero() {
  gsap.to('#section-hero', {
    opacity: 0,
    scrollTrigger: {
      trigger: '#section-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  // Fade in device stage as hero scrolls away
  gsap.fromTo('#device-stage',
    { opacity: 0 },
    {
      opacity: 1,
      scrollTrigger: {
        trigger: '#section-hero',
        start: '60% top',
        end: 'bottom top',
        scrub: true,
      }
    }
  );

  // Hide device stage + spectrum when science section is reached
  ScrollTrigger.create({
    trigger: '#section-science',
    start: 'top 80%',
    onEnter: () => {
      gsap.to('#device-stage', { opacity: 0, duration: 0.3 });
      gsap.to('#spectrum-display', { opacity: 0, duration: 0.3 });
    },
    onLeaveBack: () => {
      gsap.to('#device-stage', { opacity: 1, duration: 0.3 });
    },
  });
}

/* ----------------------------------------
   SECTION 1: DRAW-IN
   Pin: 1500px of scroll
   Device assembles, then headline appears
   ---------------------------------------- */

function setupDrawIn() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-draw-in',
      start: 'top top',
      end: '+=1500',
      pin: true,
      scrub: 0.5,
    }
  });

  // Draw device (0-0.5)
  draw(tl, '#base-bottom', 0.08, 'none', 0);
  draw(tl, '#base-top', 0.06, 'none', 0.04);
  drawAll(tl, '#vent-lines line', 0.03, 0.005, 0.08);
  drawAll(tl, '#base-ports rect, #base-ports circle', 0.03, 0.005, 0.09);
  draw(tl, '#screen-bezel', 0.04, 'none', 0.08);
  tl.fromTo('#screen-bg', { opacity: 0 }, { opacity: 1, duration: 0.03 }, 0.11);
  draw(tl, '#cord-path', 0.06, 'power1.inOut', 0.10);
  draw(tl, '#probe-body', 0.06, 'none', 0.12);
  draw(tl, '#trigger-btn', 0.04, 'none', 0.16);
  draw(tl, '#probe-lens-outer', 0.04, 'none', 0.18);
  draw(tl, '#probe-lens-inner', 0.03, 'none', 0.19);
  draw(tl, '#probe-display', 0.03, 'none', 0.19);

  // Headline fade in (0.55-0.75)
  tl.fromTo('#draw-in-text',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.15 },
    0.55
  );

  // Headline hold, then fade out (0.85-1.0)
  tl.to('#draw-in-text',
    { opacity: 0, duration: 0.15 },
    0.85
  );
}

/* ----------------------------------------
   SECTION 2: BEAM
   Pin: 1200px of scroll
   Beam fires, scatter, optics reveal
   ---------------------------------------- */

function setupBeam() {
  // Slide device right + scale up as beam section approaches
  gsap.to('#device-stage', {
    left: '68%',
    top: '42%',
    width: 'min(52vw, 580px)',
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: '#section-beam',
      start: 'top 90%',
      end: 'top 20%',
      scrub: true,
    }
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-beam',
      start: 'top top',
      end: '+=1200',
      pin: true,
      scrub: 0.5,
    }
  });

  // Beam group appears (0-0.05)
  tl.fromTo('#beam-group', { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0);
  tl.fromTo('#lens-glint', { opacity: 0 }, { opacity: 0.6, duration: 0.08 }, 0.02);

  // Main beam (0.05-0.15)
  tl.fromTo('#main-beam', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.05);
  tl.fromTo('#beam-glow', { opacity: 0 }, { opacity: 0.15, duration: 0.1 }, 0.05);

  // Sample (0.15-0.25)
  tl.fromTo('#sample-dot', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.15);
  tl.fromTo('#sample-core', { opacity: 0 }, { opacity: 0.8, duration: 0.08 }, 0.18);

  // Scatter (0.25-0.4)
  tl.fromTo('#scatter-rays line', { opacity: 0 }, { opacity: 0.6, duration: 0.1, stagger: 0.02 }, 0.25);

  // Internal optics (0.4-0.6)
  tl.fromTo('#internal-optics', { opacity: 0 }, { opacity: 0.7, duration: 0.2 }, 0.4);

  // Screen status (0.55-0.6)
  tl.fromTo('#screen-status', { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.55);

  // Text panel fades in from start
  tl.fromTo('#section-beam .pin-left',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.15 },
    0.05
  );
}

/* ----------------------------------------
   SPECTRUM SHAPES for morphing
   ---------------------------------------- */

const SPECTRUM = {
  // Normal drug — clear peaks at expected positions
  authentic: '10,180 30,178 50,175 70,172 90,170 100,165 108,140 112,100 115,65 118,100 122,140 130,160 150,165 170,162 180,158 188,130 192,90 195,55 198,90 202,130 210,155 230,160 250,158 260,150 268,120 272,80 275,45 278,80 282,120 290,150 310,158 330,160 350,162 370,165 390,170 410,172 430,175 450,178 470,180 490,180',

  // Counterfeit — peaks in WRONG places, different shape entirely
  counterfeit: '10,180 30,179 50,178 70,176 90,174 100,172 108,170 112,168 115,170 118,172 122,174 130,170 150,155 170,120 180,85 188,60 192,85 198,120 202,155 210,170 230,174 250,172 260,174 268,176 272,178 275,176 278,174 282,170 290,160 310,140 330,165 350,170 370,174 390,176 410,178 430,179 440,179 450,180 470,180 490,180',

  // Underdosed — SAME peak positions as authentic but ~60% height
  underdosed: '10,180 30,179 50,177 70,175 90,174 100,171 108,156 112,132 115,111 118,132 122,156 130,168 150,171 170,169 180,167 188,150 192,126 195,105 198,126 202,150 210,165 230,168 250,167 260,162 268,144 272,120 275,99 278,120 282,144 290,162 310,167 330,168 350,169 370,171 390,174 410,175 430,177 450,179 470,180 490,180',

  labels: ['Paracetamol 500mg — Match', 'Artesunate — No match', 'Amoxicillin 250mg — Underdosed'],
};

/* ----------------------------------------
   SECTION 3: SPECTRUM
   Pin: 1500px of scroll
   Graph draws on right, text on left
   Spectrum stays visible into use-cases
   ---------------------------------------- */

function setupSpectrum() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-spectrum',
      start: 'top top',
      end: '+=1500',
      pin: true,
      scrub: 0.5,
    }
  });

  // Phase 1: Spectrum graph appears and draws (0-0.45)
  tl.fromTo('#spectrum-display', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0);
  draw(tl, '#spectrum-line', 0.3, 'none', 0.02);

  // Axis labels
  tl.fromTo('#axis-x', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.08);
  tl.fromTo('#axis-y', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.08);

  // Mini spectrum on device screen
  tl.fromTo('#screen-spectrum', { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.1);
  draw(tl, '#screen-spectrum-line', 0.2, 'none', 0.1);

  // Phase 2: Text fades in (0.5-0.7)
  tl.fromTo('#spectrum-text',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.15 },
    0.5
  );

  // Phase 3: Text fades out at end — but spectrum STAYS visible
  tl.to('#spectrum-text', { opacity: 0, duration: 0.1 }, 0.88);
  tl.to('#scatter-rays line', { opacity: 0.15, duration: 0.1 }, 0.88);
}

/* ----------------------------------------
   SECTION 4: USE CASES
   Pin: 2400px of scroll
   Cards cycle one at a time, vertically centered
   Spectrum morphs shape for each card
   ---------------------------------------- */

function setupUseCases() {
  const spectrumLine = document.getElementById('spectrum-line');
  const spectrumLabel = document.getElementById('spectrum-label');
  const shapes = [SPECTRUM.authentic, SPECTRUM.counterfeit, SPECTRUM.underdosed];
  const labels = SPECTRUM.labels;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-usecases',
      start: 'top top',
      end: '+=2400',
      pin: true,
      scrub: 0.5,
    }
  });

  // Fade in the containing panel
  tl.fromTo('#section-usecases .pin-left',
    { opacity: 0 },
    { opacity: 1, duration: 0.05 },
    0
  );

  // Show spectrum label
  tl.fromTo('#spectrum-label', { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0);

  const items = document.querySelectorAll('.usecase-item');
  const count = items.length;
  const perItem = 1 / count;

  items.forEach((item, i) => {
    const start = i * perItem;

    // Morph spectrum to this card's shape
    if (i === 0) {
      // First card: set to authentic shape (already drawn as this)
      tl.set(spectrumLine, { attr: { points: shapes[0] } }, start);
      tl.set(spectrumLabel, { textContent: labels[0] }, start);
    } else {
      // Morph polyline shape
      tl.to(spectrumLine,
        { attr: { points: shapes[i] }, duration: perItem * 0.2, ease: 'power2.inOut' },
        start
      );
      tl.set(spectrumLabel, { textContent: labels[i] }, start + perItem * 0.01);
    }

    // Fade in card (vertically centered via CSS)
    tl.fromTo(item,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: perItem * 0.2 },
      start + perItem * 0.1
    );

    // Fade out card (except last holds a bit longer)
    if (i < count - 1) {
      tl.to(item,
        { opacity: 0, y: -10, duration: perItem * 0.15 },
        start + perItem * 0.75
      );
    }
  });

  // Fade out last card + spectrum at end
  tl.to(items[count - 1], { opacity: 0, duration: 0.05 }, 0.9);
  tl.to('#spectrum-display', { opacity: 0, duration: 0.08 }, 0.9);
  tl.to('#spectrum-label', { opacity: 0, duration: 0.05 }, 0.9);
}

/* ----------------------------------------
   SECTION 5: PRICE
   Pin: 1000px of scroll
   Device dims, price reveals
   ---------------------------------------- */

function setupPrice() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-price',
      start: 'top top',
      end: '+=1000',
      pin: true,
      scrub: 0.5,
    }
  });

  // Dim/hide beam and optics
  tl.to('#beam-group', { opacity: 0, duration: 0.1 }, 0);
  tl.to('#internal-optics', { opacity: 0, duration: 0.1 }, 0);
  tl.to('#spectrometer', { scale: 0.7, opacity: 0.2, duration: 0.2 }, 0);

  // Price block fades in
  tl.fromTo('.price-block',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.25 },
    0.15
  );

  // Fade spectrometer out fully
  tl.to('#spectrometer', { opacity: 0, duration: 0.15 }, 0.5);
}

/* ----------------------------------------
   NAVIGATION
   ---------------------------------------- */

function setupNav() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ----------------------------------------
   WAITLIST FORM
   ---------------------------------------- */

function setupWaitlistForm() {
  // PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwP2h2fxQ3-8cpJhQjGzd5GEvRuLHjZR-Pxj7uhE-8L7YLqyLDet83fNCmlE_cVjb5Y/exec';

  const form = document.getElementById('waitlist-form');
  const status = document.getElementById('form-status');
  const success = document.getElementById('waitlist-success');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value.trim();
    if (!email) return;

    status.textContent = 'Submitting...';
    const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);

    try {
      if (!isLocal && SHEET_URL) {
        const res = await fetch(SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ email }),
          redirect: 'follow',
        });
        const result = await res.json();
        if (result.status === 'duplicate') {
          status.textContent = "You're already on the list. We'll be in touch!";
          return;
        }
        if (result.status === 'error') throw new Error(result.message);
      }
      form.hidden = true;
      success.hidden = false;
      status.textContent = '';
    } catch {
      status.innerHTML = 'Something went wrong. Email <a href="mailto:contact@foralltech.in">contact@foralltech.in</a> instead.';
    }
  });
}
