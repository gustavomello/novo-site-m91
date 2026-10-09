(function () {
  'use strict';

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Idade da empresa, sempre atualizada (fundada em 1991)
  var year = new Date().getFullYear();
  var anos = String(year - 1991);
  document.querySelectorAll('[data-anos]').forEach(function (el) { el.textContent = anos; });
  document.querySelectorAll('[data-count][data-anos]').forEach(function (el) { el.setAttribute('data-count', anos); });
  var anoEl = document.getElementById('ano');
  if (anoEl) anoEl.textContent = year;

  // Cabeçalho sólido e botão do WhatsApp depois do hero
  var header = document.querySelector('.site-header');
  var waFloat = document.querySelector('.wa-float');
  var hero = document.querySelector('.hero');

  function onScroll() {
    var y = window.scrollY;
    var past = hero ? y > hero.offsetHeight * 0.6 : y > 40;
    header.classList.toggle('is-solid', y > 40);
    if (waFloat) waFloat.classList.toggle('show', past);
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  // Menu mobile
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    doc.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  toggle.addEventListener('click', function () { setMenu(!doc.classList.contains('menu-open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Contadores
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var fmt = function (n) { return n.toLocaleString('pt-BR'); };
    if (reduceMotion) { el.textContent = fmt(target); return; }
    var start = null, dur = 1600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  // Revelar ao rolar
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('in');
        el.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Galeria dos cards (troca de foto por toque ou deslize)
  document.querySelectorAll('[data-gallery]').forEach(function (box) {
    var imgs = box.querySelectorAll('img');
    var dots = box.querySelectorAll('.dots button');
    var current = 0;
    function show(i) {
      current = (i + imgs.length) % imgs.length;
      imgs.forEach(function (img, k) {
        if (k === current) img.loading = 'eager';
        img.classList.toggle('is-active', k === current);
      });
      dots.forEach(function (d, k) { d.setAttribute('aria-pressed', k === current); });
    }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); }); });
    box.addEventListener('click', function (e) { if (!e.target.closest('.dots')) show(current + 1); });
  });
})();
