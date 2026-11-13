/* imc.js — calculadora de IMC (OMS). Aceita decimais com vírgula ou ponto.
   Altura pode ser em metros (1,75) ou centímetros (175). */
(function () {
  'use strict';
  var peso = document.getElementById('imc-peso'), alt = document.getElementById('imc-altura');
  var btn = document.getElementById('imc-calcular'), box = document.getElementById('imc-resultado');
  if (!btn) return;
  var num = document.getElementById('imc-num'), classe = document.getElementById('imc-classe');
  var marc = document.getElementById('imc-marcador'), wa = document.getElementById('imc-wa'), faixa = document.getElementById('imc-faixa');
  var rotulo = btn.querySelector('span');

  function fmt(n, d) { return n.toFixed(d).replace('.', ','); }
  function ler(el) { return parseFloat(String(el.value).trim().replace(',', '.')); }
  function classificar(v) {
    if (v < 18.5) return 'Abaixo do peso';
    if (v < 25) return 'Peso normal';
    if (v < 30) return 'Sobrepeso';
    if (v < 35) return 'Obesidade grau I';
    if (v < 40) return 'Obesidade grau II';
    return 'Obesidade grau III';
  }
  /* só números, vírgula e ponto */
  [peso, alt].forEach(function (i) {
    i.addEventListener('input', function () { i.value = i.value.replace(/[^0-9.,]/g, ''); });
    i.addEventListener('keydown', function (e) { if (e.key === 'Enter') calcular(); });
  });

  function contar(ate) {
    var ini = performance.now(), dur = 700;
    (function passo(t) {
      var k = Math.min((t - ini) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      num.textContent = fmt(ate * e, 1);
      if (k < 1) requestAnimationFrame(passo);
    })(ini);
  }

  function mostrar() {
    var p = ler(peso), h = ler(alt);
    if (h > 3) h = h / 100; /* centímetros -> metros */
    box.hidden = false;
    if (!(p >= 20 && p <= 300) || !(h >= 1 && h <= 2.5)) {
      num.textContent = '–'; classe.textContent = 'Confira o peso (kg) e a altura (ex.: 1,75 ou 175).';
      faixa.textContent = ''; marc.style.left = '0%'; wa.hidden = true; return;
    }
    var imc = p / (h * h), c = classificar(imc);
    classe.textContent = c; wa.hidden = false; contar(imc);
    faixa.textContent = 'Faixa de peso saudável para ' + fmt(h, 2) + ' m: ' + fmt(18.5 * h * h, 1) + ' a ' + fmt(24.9 * h * h, 1) + ' kg.';
    var pos = Math.max(0, Math.min((imc - 15) / 25, 1)) * 100;
    marc.style.left = '0%';
    requestAnimationFrame(function () { requestAnimationFrame(function () { marc.style.left = 'calc(' + pos + '% - 2px)'; }); });
    var msg = 'Olá! Usei a calculadora de IMC do site (peso ' + fmt(p, 1) + ' kg, altura ' + fmt(h, 2) + ' m, IMC ' + fmt(imc, 1) + ' – ' + c + ') e quero agendar uma avaliação física na Academia Elite Fitness.';
    wa.href = 'https://wa.me/5566992583190?text=' + encodeURIComponent(msg);
  }
  function calcular() {
    btn.classList.add('is-loading'); rotulo.textContent = 'Calculando…';
    setTimeout(function () { btn.classList.remove('is-loading'); rotulo.textContent = 'Calcular novamente'; mostrar(); }, 450);
  }
  btn.addEventListener('click', calcular);
})();
