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
