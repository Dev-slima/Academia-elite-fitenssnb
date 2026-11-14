/* horario.js — mostra "Aberto agora" / "Fechado" com base no horário de Mato Grosso (America/Cuiaba).
   Para mudar o horário, edite o objeto HORARIOS abaixo (0 = domingo ... 6 = sábado). */
(function () {
  'use strict';
  var TZ = 'America/Cuiaba';
  var HORARIOS = {
    0: [],
    1: [['04:30', '09:00'], ['15:00', '21:00']],
    2: [['04:30', '09:00'], ['15:00', '21:00']],
    3: [['04:30', '09:00'], ['15:00', '21:00']],
    4: [['04:30', '09:00'], ['15:00', '21:00']],
    5: [['04:30', '09:00'], ['15:00', '21:00']],
    6: []
  };
  var DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

  var box = document.getElementById('status-aberto');
  if (!box) return;
  var txt = box.querySelector('.status-texto');

  function min(hhmm) { var p = hhmm.split(':'); return +p[0] * 60 + +p[1]; }

  function agora() {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    var dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
    return { dia: dia, min: (+o.hour) * 60 + (+o.minute) };
  }

  function proximaAbertura(dia, m) {
    for (var add = 0; add <= 7; add++) {
      var d = (dia + add) % 7;
      var faixas = HORARIOS[d];
      for (var i = 0; i < faixas.length; i++) {
        var ab = min(faixas[i][0]);
        if (add > 0 || ab > m) return { add: add, dia: d, hora: faixas[i][0] };
      }
    }
    return null;
  }

  function atualizar() {
    try {
      var n = agora();
      var faixas = HORARIOS[n.dia] || [];
      var aberta = null;
      for (var i = 0; i < faixas.length; i++) {
        if (n.min >= min(faixas[i][0]) && n.min < min(faixas[i][1])) { aberta = faixas[i]; break; }
      }
      box.hidden = false;
      if (aberta) {
        box.className = 'status-aberto is-open';
        txt.textContent = 'Aberto agora · fecha às ' + aberta[1].replace(':', 'h');
      } else {
        var prox = proximaAbertura(n.dia, n.min);
        box.className = 'status-aberto is-closed';
        if (!prox) txt.textContent = 'Fechado agora';
        else if (prox.add === 0) txt.textContent = 'Fechado agora · abre às ' + prox.hora.replace(':', 'h');
        else if (prox.add === 1) txt.textContent = 'Fechado agora · abre amanhã às ' + prox.hora.replace(':', 'h');
        else txt.textContent = 'Fechado agora · abre ' + DIAS[prox.dia] + ' às ' + prox.hora.replace(':', 'h');
      }
    } catch (e) {
      box.hidden = true; /* navegador sem suporte: simplesmente não mostra */
    }
  }

  atualizar();
  setInterval(atualizar, 60000);
})();
