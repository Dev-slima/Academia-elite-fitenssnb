/* efeitos.js — brilho que segue o mouse nos cards e cards de modalidade com atalho para o WhatsApp */
(function () {
  'use strict';
  document.querySelectorAll('.mod-card, .dif-card, .plano-card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
  document.querySelectorAll('.mod-card').forEach(function (c) {
    var nome = (c.querySelector('.mod-name') || {}).textContent;
    if (!nome) return;
    nome = nome.trim();
    c.setAttribute('role', 'link'); c.setAttribute('tabindex', '0');
    c.setAttribute('aria-label', nome + ' — falar no WhatsApp');
    function abrir() {
      var m = 'Olá! Tenho interesse em ' + nome + ' na Academia Elite Fitness. Podem me passar mais informações?';
      window.open('https://wa.me/5566992583190?text=' + encodeURIComponent(m), '_blank', 'noopener');
    }
    c.addEventListener('click', abrir);
    c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); } });
  });
})();

/* Botões com vida: ondulação no clique e efeito magnético leve */
(function () {
  'use strict';
  var sel = '.cta, .logo-cta, .btn-pro, .imc-btn, .ft-cta, .sound-btn, .plano-card a';
  var movel = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll(sel).forEach(function (b) {
    b.addEventListener('pointerdown', function (e) {
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
      var o = document.createElement('span');
      o.className = 'ripple';
      o.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
      b.appendChild(o); setTimeout(function () { o.remove(); }, 650);
    });
    if (movel && !reduz && b.matches('.cta, .btn-pro, .ft-cta')) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .08) + 'px,' + ((e.clientY - r.top - r.height / 2) * .18 - 2) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    }
  });
})();
