/* media.js — vídeo do topo (com botão de som) e foto do proprietário.
   Arquivos: video/academia.mp4 · img/video-poster.jpg · img/dono.jpg */
(function () {
  'use strict';
  var foto = document.querySelector('[data-media="foto"]');
  if (foto) {
    var img = foto.querySelector('img'), fb = foto.querySelector('.media-fallback');
    var falhou = function () { img.hidden = true; if (fb) fb.hidden = false; };
    img.addEventListener('error', falhou);
    if (img.complete && img.naturalWidth === 0) falhou();
  }

  var hero = document.querySelector('.hero');
  var main = document.querySelector('.hero-video'), bg = document.querySelector('.hero-bg');
  var btn = document.querySelector('.sound-btn');
  if (!hero || !main) return;
  main.addEventListener('error', function () { hero.classList.add('is-unavailable'); });

  [main, bg].forEach(function (v) { if (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } });

  /* Som: o navegador só libera áudio após um clique. No celular o vídeo audível é o de fundo. */
  function alvo() { var st = document.querySelector('.hero-stage'); return getComputedStyle(st).display === 'none' && bg ? bg : main; }
  function alternarSom() {
    var t = alvo(), outro = t === main ? bg : main, ligar = t.muted;
    if (outro) outro.muted = true;
    t.muted = !ligar; t.volume = 1;
    if (ligar) { t.currentTime = 0; if (bg && t !== bg) bg.currentTime = 0; }
    var p = t.play(); if (p && p.catch) p.catch(function () {});
    if (!btn) return;
    btn.setAttribute('aria-pressed', ligar ? 'true' : 'false');
    btn.setAttribute('aria-label', ligar ? 'Desativar som do vídeo' : 'Ativar som do vídeo');
    btn.querySelector('i').className = 'fa-solid ' + (ligar ? 'fa-volume-high' : 'fa-volume-xmark');
    btn.querySelector('span').textContent = ligar ? 'Som ligado · toque para silenciar' : 'Ouvir o vídeo com som';
  }
  if (btn) btn.addEventListener('click', alternarSom);
  main.addEventListener('click', alternarSom);

  /* economiza bateria: pausa quando o topo sai da tela */
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      [main, bg].forEach(function (v) { if (!v) return; if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); });
    });
  }, { threshold: 0.1 }).observe(hero);
})();
