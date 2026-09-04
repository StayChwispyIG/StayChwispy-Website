const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

const toggleNavScrolled = () => {
  nav.classList.toggle('scrolled', window.scrollY > 8);
};
toggleNavScrolled();
window.addEventListener('scroll', toggleNavScrolled, { passive: true });

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

const transitionEl = document.getElementById('pageTransition');
const transitionVideo = document.getElementById('transitionVideo');
const TRANSITION_KEY = 'chwispyPageTransition';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (transitionEl && transitionVideo && !prefersReducedMotion) {
  const canWebm = transitionVideo.canPlayType('video/webm; codecs="vp9"') !== '';
  const ext = canWebm ? 'webm' : 'mp4';
  const coverSrc = `assets/transitions/spray-cover.${ext}`;
  const revealSrc = `assets/transitions/spray-reveal.${ext}`;

  const pendingTransition = sessionStorage.getItem(TRANSITION_KEY);
  if (pendingTransition === 'reveal') {
    sessionStorage.removeItem(TRANSITION_KEY);
    transitionEl.classList.add('active');
    transitionVideo.src = revealSrc;
    transitionVideo.onended = () => transitionEl.classList.remove('active');
    transitionVideo.play().catch(() => transitionEl.classList.remove('active'));
  }

  const internalPageLink = /^(?:index\.html|sponsors\.html|tips\.html)(?:#.*)?$/;
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || !internalPageLink.test(href)) return;

    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      transitionEl.classList.add('active');
      transitionVideo.src = coverSrc;
      transitionVideo.onended = () => {
        sessionStorage.setItem(TRANSITION_KEY, 'reveal');
        window.location.href = href;
      };
      transitionVideo.play().catch(() => {
        window.location.href = href;
      });
    });
  });
}

const heroBanner = document.getElementById('heroBanner');
if (heroBanner) {
  fetch('assets/banner-images/manifest.json')
    .then((res) => (res.ok ? res.json() : []))
    .then((files) => {
      if (!Array.isArray(files) || files.length === 0) return;

      const layers = heroBanner.querySelectorAll('.hero-banner-img');
      const paths = files.map((f) => `assets/banner-images/${f}`);
      let index = 0;
      let activeLayer = 0;

      layers[activeLayer].src = paths[0];
      layers[activeLayer].classList.add('is-active');

      if (paths.length < 2) return;

      setInterval(() => {
        index = (index + 1) % paths.length;
        const nextLayer = (activeLayer + 1) % 2;
        layers[nextLayer].src = paths[index];
        layers[nextLayer].classList.add('is-active');
        layers[activeLayer].classList.remove('is-active');
        activeLayer = nextLayer;
      }, 10000);
    })
    .catch(() => {});
}
