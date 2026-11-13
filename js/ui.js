/* ui.js — interações gerais: header, progresso, menu ativo, entrada suave, voltar ao topo */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var header = document.querySelector('header');
  var bar = document.querySelector('.scroll-progress span');
  var toTop = document.querySelector('.to-top');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || root.scrollTop;
    var max = root.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    if (toTop) {
      var show = y > 700;
      if (show) { toTop.hidden = false; requestAnimationFrame(function () { toTop.classList.add('is-visible'); }); }
      else { toTop.classList.remove('is-visible'); }
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0 }); });
    toTop.addEventListener('transitionend', function () {
      if (!toTop.classList.contains('is-visible')) toTop.hidden = true;
    });
  }

  /* Menu: destaca a seção visível */
  var links = Array.prototype.slice.call(document.querySelectorAll('.hdr-nav a[href^="#"]'));
  if ('IntersectionObserver' in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        var a = map[e.target.id];
        if (a) a.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* Entrada suave dos blocos principais */
  var targets = document.querySelectorAll('.section-head, .mod-grid, .dif-grid, .planos-grid, .conheca-grid, .faq-list, .info, .cta-final');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
