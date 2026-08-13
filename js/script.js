const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

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
