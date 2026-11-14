/* faq.js — perguntas frequentes acessíveis (teclado + leitor de tela), uma aberta por vez */
(function () {
  'use strict';
  var items = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));

  function setOpen(item, open) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    item.classList.toggle('open', open);
    if (q) q.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (a) a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
  }

  items.forEach(function (item, i) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    var id = 'faq-resp-' + (i + 1);
    a.id = id;
    a.setAttribute('role', 'region');
    q.setAttribute('aria-controls', id);

    function toggle() {
      var willOpen = !item.classList.contains('open');
      items.forEach(function (other) { if (other !== item) setOpen(other, false); });
      setOpen(item, willOpen);
    }
    q.addEventListener('click', toggle);
    q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  window.addEventListener('resize', function () {
    items.forEach(function (item) {
      if (item.classList.contains('open')) {
        var a = item.querySelector('.faq-a');
        if (a) a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
})();
