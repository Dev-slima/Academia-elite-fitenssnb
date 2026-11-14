/* intro.js — abertura em cortina (uma vez por visita) e liberação da animação do hero */
(function () {
  'use strict';
  var root = document.documentElement, intro = document.querySelector('.intro');
  root.classList.add('js');
  function pronto() { root.classList.add('is-ready'); }
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visto = false; try { visto = sessionStorage.getItem('elite-intro') === '1'; } catch (e) {}
  if (!intro || reduz || visto) { if (intro) intro.remove(); return pronto(); }
  root.style.overflow = 'hidden';
  var feito = false;
  function abrir() { intro.classList.add('open'); setTimeout(pronto, 350); }
  function fechar() {
    if (feito) return; feito = true;
    intro.remove(); root.style.overflow = ''; pronto();
    try { sessionStorage.setItem('elite-intro', '1'); } catch (e) {}
  }
  setTimeout(abrir, 1700);
  setTimeout(fechar, 2700);
  intro.addEventListener('click', function () { abrir(); setTimeout(fechar, 700); });
})();
