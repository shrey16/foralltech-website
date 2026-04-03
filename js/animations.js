/* ========================================
   ForAll Sense — Pinned Scroll Animations
   ======================================== */

gsap.registerPlugin(ScrollTrigger);

const DEVICE_VIEWBOX = {
  minX: -50,
  minY: -120,
  width: 700,
  height: 620,
};

const DEVICE_SCREEN = {
  x: 255,
  y: 215,
  width: 140,
  height: 40,
};

const DEVICE_ASPECT = DEVICE_VIEWBOX.height / DEVICE_VIEWBOX.width;
const SPECTRUM_ASPECT = 220 / 500;
const SCREEN_RATIO = {
  centerX: ((DEVICE_SCREEN.x + DEVICE_SCREEN.width / 2) - DEVICE_VIEWBOX.minX) / DEVICE_VIEWBOX.width,
  centerY: ((DEVICE_SCREEN.y + DEVICE_SCREEN.height / 2) - DEVICE_VIEWBOX.minY) / DEVICE_VIEWBOX.height,
  width: DEVICE_SCREEN.width / DEVICE_VIEWBOX.width,
  height: DEVICE_SCREEN.height / DEVICE_VIEWBOX.height,
};

/* ---- Spectrum morph data ---- */

const SPECTRUM = {
  authentic:   '10,180 30,178 50,175 70,172 90,170 100,165 108,140 112,100 115,65 118,100 122,140 130,160 150,165 170,162 180,158 188,130 192,90 195,55 198,90 202,130 210,155 230,160 250,158 260,150 268,120 272,80 275,45 278,80 282,120 290,150 310,158 330,160 350,162 370,165 390,170 410,172 430,175 450,178 470,180 490,180',
  counterfeit: '10,180 30,179 50,178 70,176 90,174 100,172 108,170 112,168 115,170 118,172 122,174 130,170 150,155 170,120 180,85 188,60 192,85 198,120 202,155 210,170 230,174 250,172 260,174 268,176 272,178 275,176 278,174 282,170 290,160 310,140 330,165 350,170 370,174 390,176 410,178 430,179 440,179 450,180 470,180 490,180',
  underdosed:  '10,180 30,179 50,177 70,175 90,174 100,171 108,156 112,132 115,111 118,132 122,156 130,168 150,171 170,169 180,167 188,150 192,126 195,105 198,126 202,150 210,165 230,168 250,167 260,162 268,144 272,120 275,99 278,120 282,144 290,162 310,167 330,168 350,169 370,171 390,174 410,175 430,177 450,179 470,180 490,180',
  labels: ['Paracetamol 500mg — Match', 'Artesunate — No match', 'Amoxicillin 250mg — Underdosed'],
};

function init() {
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initSVGPaths();

  if (isMobile || prefersReduced) {
    showStaticDevice();
    setupWaitlistForm();
    return;
  }

  document.getElementById('spectrum-svg')?.setAttribute('preserveAspectRatio', 'none');

  applyLayoutMetrics();
  ScrollTrigger.addEventListener('refreshInit', applyLayoutMetrics);

  setupHero();
  setupDrawIn();
  setupBeam();
  setupSpectrum();
  setupUseCases();
  setupPrice();
  setupNav();
  setupWaitlistForm();

  ScrollTrigger.refresh();
}

if (document.fonts && document.fonts.ready) {
  Promise.race([
    document.fonts.ready,
    new Promise(r => setTimeout(r, 1500))
  ]).then(init);
} else {
  document.addEventListener('DOMContentLoaded', init);
}

/* ---- SVG helpers ---- */

function initSVGPaths() {
  document.querySelectorAll('[pathLength="1"]').forEach(el => {
    el.setAttribute('stroke-dasharray', '1');
    el.setAttribute('stroke-dashoffset', '1');
  });
}

function draw(tl, sel, dur, ease, pos) {
  tl.fromTo(sel,
    { attr: { 'stroke-dashoffset': 1 } },
    { attr: { 'stroke-dashoffset': 0 }, duration: dur, ease: ease || 'none', immediateRender: false },
    pos
  );
}

function drawAll(tl, sel, dur, stagger, pos) {
  tl.fromTo(sel,
    { attr: { 'stroke-dashoffset': 1 } },
    { attr: { 'stroke-dashoffset': 0 }, duration: dur, stagger, ease: 'none', immediateRender: false },
    pos
  );
}

/* ---- Layout helpers ---- */

function getLayoutMetrics() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const baseWidth = Math.min(vw * 0.30, 360);
  const beamWidth = Math.min(vw * 0.48, 540);
  const spectrumWidth = Math.min(vw * 0.42, 520);

  const deviceBase = {
    centerX: vw * 0.50,
    centerY: vh * 0.42,
    width: baseWidth,
    height: baseWidth * DEVICE_ASPECT,
  };

  const deviceBeam = {
    centerX: vw * 0.70,
    centerY: vh * 0.50,
    width: beamWidth,
    height: beamWidth * DEVICE_ASPECT,
  };

  const spectrumEmbedded = {
    centerX: deviceBeam.centerX + (SCREEN_RATIO.centerX - 0.5) * deviceBeam.width,
    centerY: deviceBeam.centerY + (SCREEN_RATIO.centerY - 0.5) * deviceBeam.height,
    width: deviceBeam.width * SCREEN_RATIO.width,
    height: deviceBeam.height * SCREEN_RATIO.height,
  };

  const spectrumExpanded = {
    centerX: vw * 0.72,
    centerY: vh * 0.50,
    width: spectrumWidth,
    height: spectrumWidth * SPECTRUM_ASPECT,
  };

  return {
    device: {
      base: deviceBase,
      beam: deviceBeam,
    },
    spectrum: {
      embedded: spectrumEmbedded,
      expanded: spectrumExpanded,
    },
  };
}

function applyLayoutMetrics() {
  const { device, spectrum } = getLayoutMetrics();

  gsap.set('#device-stage', {
    left: device.base.centerX,
    top: device.base.centerY,
    width: device.base.width,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    scale: 1,
    transformOrigin: '50% 50%',
    force3D: true,
  });

  gsap.set('#spectrum-display', {
    left: spectrum.embedded.centerX,
    top: spectrum.embedded.centerY,
    width: spectrum.embedded.width,
    height: spectrum.embedded.height,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    autoAlpha: 0,
    force3D: true,
  });

  gsap.set('#spectrum-line', { attr: { points: SPECTRUM.authentic, 'stroke-dashoffset': 1 } });
  gsap.set('#axis-x, #axis-y, #spectrum-label, #screen-spectrum', { opacity: 0 });
}

function showStaticDevice() {
  gsap.set('[pathLength="1"]', { attr: { 'stroke-dashoffset': 0 } });
  gsap.set('#device-stage', { opacity: 1 });
  gsap.set('#screen-bg', { opacity: 1 });
  gsap.set('#screen-spectrum', { opacity: 1 });
  gsap.set('#screen-status', { opacity: 1 });
  gsap.set('.usecase-item', { opacity: 1, y: 0 });
}

/* ========================================
   HERO — fades out, device fades in
   ======================================== */

function setupHero() {
  gsap.to('#section-hero', {
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#section-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  gsap.fromTo('#device-stage',
    { opacity: 0 },
    {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#section-hero',
        start: '60% top',
        end: 'bottom top',
        scrub: true,
      }
    }
  );
}

/* ========================================
   SECTION 1: DRAW-IN — device assembles
   ======================================== */

function setupDrawIn() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-draw-in',
      start: 'top top',
      end: '+=1500',
      pin: true,
      scrub: true,
      anticipatePin: 1,
    }
  });

  draw(tl, '#base-bottom', 0.08, 'none', 0);
  draw(tl, '#base-top', 0.06, 'none', 0.04);
  drawAll(tl, '#vent-lines line', 0.03, 0.005, 0.08);
  drawAll(tl, '#base-ports rect, #base-ports circle', 0.03, 0.005, 0.09);
  draw(tl, '#screen-bezel', 0.04, 'none', 0.08);
  tl.fromTo('#screen-bg', { opacity: 0 }, { opacity: 1, duration: 0.03, immediateRender: false }, 0.11);
  draw(tl, '#cord-path', 0.06, 'none', 0.10);
  draw(tl, '#probe-body', 0.06, 'none', 0.12);
  draw(tl, '#trigger-btn', 0.04, 'none', 0.16);
  draw(tl, '#probe-lens-outer', 0.04, 'none', 0.18);
  draw(tl, '#probe-lens-inner', 0.03, 'none', 0.19);
  draw(tl, '#probe-display', 0.03, 'none', 0.19);

  tl.fromTo('#draw-in-text',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.15, immediateRender: false },
    0.55
  );
  tl.to('#draw-in-text', { opacity: 0, duration: 0.15, ease: 'none' }, 0.85);
}

/* ========================================
   SECTION 2: BEAM — device slides right + grows, beam fires
   ======================================== */

function setupBeam() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-beam',
      start: 'top top',
      end: '+=1800',
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  tl.to('#device-stage', {
    x: () => getLayoutMetrics().device.beam.centerX - getLayoutMetrics().device.base.centerX,
    y: () => getLayoutMetrics().device.beam.centerY - getLayoutMetrics().device.base.centerY,
    scale: () => getLayoutMetrics().device.beam.width / getLayoutMetrics().device.base.width,
    duration: 0.25,
    ease: 'none',
    immediateRender: false,
  }, 0);

  tl.fromTo('#section-beam .pin-left',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.15, immediateRender: false },
    0.08
  );

  tl.fromTo('#beam-group', { opacity: 0 }, { opacity: 1, duration: 0.05, immediateRender: false }, 0.25);
  tl.fromTo('#lens-glint', { opacity: 0 }, { opacity: 0.6, duration: 0.08, immediateRender: false }, 0.27);
  tl.fromTo('#main-beam', { opacity: 0 }, { opacity: 1, duration: 0.1, immediateRender: false }, 0.30);
  tl.fromTo('#beam-glow', { opacity: 0 }, { opacity: 0.15, duration: 0.1, immediateRender: false }, 0.30);
  tl.fromTo('#sample-dot', { opacity: 0 }, { opacity: 1, duration: 0.1, immediateRender: false }, 0.38);
  tl.fromTo('#sample-core', { opacity: 0 }, { opacity: 0.8, duration: 0.08, immediateRender: false }, 0.40);
  tl.fromTo('#scatter-rays line', { opacity: 0 }, { opacity: 0.6, duration: 0.1, stagger: 0.02, immediateRender: false }, 0.45);
  tl.fromTo('#internal-optics', { opacity: 0 }, { opacity: 0.7, duration: 0.15, immediateRender: false }, 0.55);
  tl.fromTo('#screen-status', { opacity: 0 }, { opacity: 1, duration: 0.05, immediateRender: false }, 0.60);

  tl.to('#spectrum-display', {
    autoAlpha: 1,
    duration: 0.03,
    ease: 'none',
    immediateRender: false,
  }, 0.63);
  tl.set('#axis-x, #axis-y, #spectrum-label', { opacity: 0 }, 0.63);
  tl.set('#spectrum-line', { attr: { points: SPECTRUM.authentic, 'stroke-dashoffset': 1 } }, 0.63);
  draw(tl, '#spectrum-line', 0.12, 'none', 0.65);

  tl.to('#section-beam .pin-left', { opacity: 0, duration: 0.1, ease: 'none' }, 0.90);
}

/* ========================================
   SECTION 3: SPECTRUM — graph grows out of device, text on left
   ======================================== */

function setupSpectrum() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-spectrum',
      start: 'top top',
      end: '+=2000',
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  tl.to('#spectrum-display', {
    left: () => getLayoutMetrics().spectrum.expanded.centerX,
    top: () => getLayoutMetrics().spectrum.expanded.centerY,
    width: () => getLayoutMetrics().spectrum.expanded.width,
    height: () => getLayoutMetrics().spectrum.expanded.height,
    duration: 0.32,
    ease: 'none',
    immediateRender: false,
  }, 0);

  tl.to('#device-stage', { opacity: 0, duration: 0.20, ease: 'none' }, 0.08);

  tl.fromTo('#axis-x', { opacity: 0 }, { opacity: 1, duration: 0.08, immediateRender: false }, 0.35);
  tl.fromTo('#axis-y', { opacity: 0 }, { opacity: 1, duration: 0.08, immediateRender: false }, 0.35);

  tl.fromTo('#spectrum-text',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.15, immediateRender: false },
    0.45
  );

  tl.to('#spectrum-text', { opacity: 0, duration: 0.10, ease: 'none' }, 0.88);
}

/* ========================================
   SECTION 4: USE CASES — cards + spectrum morphing
   ======================================== */

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
      scrub: true,
      anticipatePin: 1,
    }
  });

  tl.fromTo('#section-usecases .pin-left', { opacity: 0 }, { opacity: 1, duration: 0.05, immediateRender: false }, 0);
  tl.fromTo('#spectrum-label', { opacity: 0 }, { opacity: 1, duration: 0.05, immediateRender: false }, 0);

  const items = document.querySelectorAll('.usecase-item');
  const count = items.length;
  const perItem = 1 / count;

  items.forEach((item, i) => {
    const start = i * perItem;

    if (i === 0) {
      tl.set(spectrumLine, { attr: { points: shapes[0] } }, start);
      tl.set(spectrumLabel, { textContent: labels[0] }, start);
    } else {
      tl.to(spectrumLine,
        { attr: { points: shapes[i] }, duration: perItem * 0.2, ease: 'power2.inOut' },
        start
      );
      tl.set(spectrumLabel, { textContent: labels[i] }, start + perItem * 0.01);
    }

    tl.fromTo(item,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: perItem * 0.2, immediateRender: false },
      start + perItem * 0.1
    );

    if (i < count - 1) {
      tl.to(item,
        { opacity: 0, y: -10, duration: perItem * 0.15, ease: 'none' },
        start + perItem * 0.75
      );
    }
  });

  tl.to(items[count - 1], { opacity: 0, duration: 0.05, ease: 'none' }, 0.85);
  tl.to('#spectrum-display', { autoAlpha: 0, duration: 0.08, ease: 'none' }, 0.85);
  tl.to('#spectrum-label', { opacity: 0, duration: 0.05, ease: 'none' }, 0.85);
}

/* ========================================
   SECTION 5: PRICE
   ======================================== */

function setupPrice() {
  ScrollTrigger.create({
    trigger: '#section-price',
    start: 'top 80%',
    onEnter: () => {
      gsap.set('#spectrum-display', { autoAlpha: 0 });
    },
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-price',
      start: 'top top',
      end: '+=1000',
      pin: true,
      scrub: true,
      anticipatePin: 1,
    }
  });

  tl.fromTo('.price-block',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.3, immediateRender: false },
    0.1
  );
}

/* ---- NAV ---- */

function setupNav() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ---- WAITLIST ---- */

function setupWaitlistForm() {
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
      if (typeof gtag === 'function') gtag('event', 'waitlist_signup', { method: 'form' });
    } catch {
      status.innerHTML = 'Something went wrong. Email <a href="mailto:contact@foralltech.in">contact@foralltech.in</a> instead.';
    }
  });
}
