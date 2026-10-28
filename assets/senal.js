/* SEÑAL — interacción: menú, revelado, demo del celular (Juego/Lite), IA papel→digital, pestañas, formulario. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var ico = function (id) { return '<svg class="ico" aria-hidden="true"><use href="#' + id + '"/></svg>'; };

  /* menú móvil */
  var nav = $('.sn'), tg = $('.sn-tg');
  function closeNav() { nav.classList.remove('open'); tg.setAttribute('aria-expanded', 'false'); }
  tg.addEventListener('click', function () { var o = nav.classList.toggle('open'); tg.setAttribute('aria-expanded', o); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* revelado al hacer scroll */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.rv').forEach(function (el) { io.observe(el); });

  /* analítica de CTAs */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-cta]');
    if (a && window.track) window.track('senal_cta_' + a.getAttribute('data-cta'));
  });

  /* ---------- celular: Modo Juego / Modo Lite ---------- */
  var STEPS = [
    { t: 'Entrada marcada', m: '6:02 · ubicación registrada' },
    { t: 'Inspección de arnés', m: 'Correas, hebillas y mosquetones', q: '¿El arnés tiene la inspección vigente?', k: 'yn' },
    { t: 'Permiso de alturas', m: 'Punto de anclaje y plan de rescate', q: '¿Confirmas el punto de anclaje certificado?', k: 'yn' },
    { t: 'Foto de evidencia', m: 'Con la cámara del celular', q: 'Toma una foto del punto de anclaje', k: 'photo' },
    { t: 'Firma', m: 'Con el dedo, en la pantalla', q: 'Firma para cerrar el permiso', k: 'sign' }
  ];
  var SIGN = 'M10 58c18-34 30-38 34-24s-6 30 6 28 14-34 30-34 6 30 22 28 20-22 34-22 22 16 38 10 22-20 36-18';

  function Phone(root) {
    var screen = $('.phone-screen', root), live = $('.live', root), mode = root.getAttribute('data-mode') || 'game';
    var cur = 1, prevP = 20, timer;
    function say(t) { if (live) live.textContent = t; }
    function setScreen(cls, html) { screen.className = 'scr phone-screen' + (cls ? ' ' + cls : ''); screen.innerHTML = html; }

    function renderMap(pop) {
      var p = Math.round(cur / STEPS.length * 100);
      var steps = STEPS.map(function (s, i) {
        var c = i < cur ? 'done' : i === cur ? 'cur' : 'lock';
        return '<li class="st ' + c + (i === pop ? ' pop' : '') + '"><span class="n">' + (i < cur ? ico('s-check') : i + 1) + '</span><div><b>' + s.t + '</b><em>' + s.m + '</em></div></li>';
      }).join('');
      setScreen('', '<div class="scr-top"><small>Ruta de la jornada · ' + (cur + 1) + ' de ' + STEPS.length + '</small><b>Trabajo en alturas</b><div class="prog"><i style="--p:' + prevP + '%"></i></div></div><ol class="route">' + steps + '</ol><div class="scr-foot"><button type="button" class="sbtn" data-a="go">Continuar</button></div>');
      var bar = $('.prog i', screen);
      requestAnimationFrame(function () { requestAnimationFrame(function () { bar.style.setProperty('--p', p + '%'); prevP = p; }); });
    }

    function renderQ() {
      var s = STEPS[cur], body;
      if (s.k === 'photo') body = '<div class="evid" id="ev"><div class="ph">' + ico('s-cam') + 'Encuadra el punto de anclaje</div><span class="stamp">Foto · 6:14 · ubicación registrada</span></div><div class="ans"><button type="button" data-a="shot">' + ico('s-cam') + ' Tomar foto</button></div>';
      else if (s.k === 'sign') body = '<div class="evid" id="ev"><svg class="sg" viewBox="0 0 240 80" aria-hidden="true"><path d="' + SIGN + '" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg><span class="stamp">Firmado · 6:16</span></div><div class="ans"><button type="button" data-a="sign">Firmar con el dedo</button></div>';
      else body = '<div class="ans" style="margin-top:auto"><button type="button" data-a="ok">Sí</button><button type="button" class="alt" data-a="no">No, revisar</button></div>';
      setScreen('', '<div class="scr-top"><small>Nivel ' + (cur + 1) + ' · ' + s.t + '</small><div class="prog"><i style="--p:' + Math.round(cur / STEPS.length * 100) + '%"></i></div></div><div class="q"><h4>' + s.q + '</h4><p>' + s.m + '</p>' + (s.k === 'yn' ? '' : '') + body + '</div>');
    }

    function renderFin() {
      setScreen('', '<div class="fin"><span class="big">' + ico('s-check') + '</span><h4>Jornada lista</h4><p>Enviada a revisión del administrador.</p><ul><li>' + ico('s-sign') + 'Firma digital</li><li>' + ico('s-cam') + 'Foto de evidencia</li><li>' + ico('s-pin') + 'Ubicación y hora</li></ul></div><div class="scr-foot"><button type="button" class="sbtn" data-a="reset">Repetir demo</button></div>');
      say('Jornada completada y enviada a revisión.');
    }

    function celebrate(done) {
      var b = document.createElement('div'); b.className = 'burst'; b.innerHTML = '<div>' + ico('s-check') + '</div><span>Nivel ' + (cur + 1) + ' completado</span>';
      screen.appendChild(b);
      void b.offsetWidth; b.classList.add('on');
      say('Nivel ' + (cur + 1) + ' completado.');
      timer = setTimeout(function () { done(); }, reduce ? 50 : 850);
    }

    function advance() {
      var i = cur; cur++;
      if (cur >= STEPS.length) renderFin(); else renderMap(i);
    }

    function renderLite() {
      var yn = function (l) { return '<div><label>' + l + '</label><div class="row"><button type="button" class="opt">Sí</button><button type="button" class="opt">No</button></div></div>'; };
      setScreen('lt', '<div class="scr-top"><small>Modo Lite · formulario directo</small><b>Trabajo en alturas</b></div><div class="lf">' + yn('Inspección de arnés vigente') + yn('Punto de anclaje certificado') +
        '<div><label>Foto del punto de anclaje</label><div class="inp">Adjuntar foto</div></div><div><label>Firma</label><div class="inp sg"></div></div></div><div class="scr-foot"><button type="button" class="sbtn" data-a="send">Enviar</button></div>');
    }

    function render() {
      clearTimeout(timer);
      if (mode === 'lite') { renderLite(); say('Modo Lite: formulario directo.'); }
      else { cur = 1; prevP = 20; renderMap(); say('Modo Juego: ruta de la jornada.'); }
    }

    screen.addEventListener('click', function (e) {
      var o = e.target.closest('.opt');
      if (o) { $$('.opt', o.parentNode).forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); }); o.classList.add('on'); o.setAttribute('aria-pressed', 'true'); return; }
      var b = e.target.closest('[data-a]'); if (!b) return;
      var a = b.getAttribute('data-a');
      if (a === 'go') renderQ();
      else if (a === 'ok') celebrate(advance);
      else if (a === 'no') { b.textContent = 'Revisión pendiente: avisamos al supervisor'; b.disabled = true; setTimeout(function () { b.disabled = false; b.textContent = 'No, revisar'; }, 1800); }
      else if (a === 'shot' || a === 'sign') {
        var ev = $('#ev', screen); ev.classList.add('on'); b.disabled = true;
        if (a === 'shot') { ev.querySelector('.ph').innerHTML = ico('s-check') + 'Foto adjunta'; }
        setTimeout(function () { celebrate(advance); }, reduce ? 0 : 900);
      }
      else if (a === 'reset') render();
      else if (a === 'send') { b.parentNode.insertAdjacentHTML('beforebegin', '<p class="ok-msg" role="status">Enviado a revisión.</p>'); b.disabled = true; b.textContent = 'Enviado'; }
    });

    $$('[data-set]', root).forEach(function (btn) {
      btn.addEventListener('click', function () {
        mode = btn.getAttribute('data-set');
        $$('[data-set]', root).forEach(function (x) { x.setAttribute('aria-pressed', x === btn); });
        render();
      });
    });
    render();
  }
  $$('[data-phone]').forEach(Phone);

  /* ---------- IA: del papel al formulario ---------- */
  $$('[data-ia]').forEach(function (root) {
    var rows = $$('.pr', root), fields = $$('.df', root), scan = $('.scan', root), form = $('.dform', root), timers = [], btn = $('[data-replay]', root);
    function clear() { timers.forEach(clearTimeout); timers = []; rows.forEach(function (r) { r.classList.remove('hit'); }); fields.forEach(function (f) { f.classList.remove('on'); }); form.classList.remove('done'); scan.classList.remove('run'); }
    function end() { fields.forEach(function (f) { f.classList.add('on'); }); form.classList.add('done'); }
    function play() {
      clear();
      if (reduce) { end(); return; }
      void scan.offsetWidth; scan.classList.add('run');
      rows.forEach(function (r, i) {
        timers.push(setTimeout(function () {
          r.classList.add('hit'); fields[i].classList.add('on');
          timers.push(setTimeout(function () { r.classList.remove('hit'); }, 650));
        }, 500 + i * (3400 / rows.length)));
      });
      timers.push(setTimeout(function () { form.classList.add('done'); }, 4300));
    }
    var seen = false;
    new IntersectionObserver(function (es) { if (es[0].isIntersecting && !seen) { seen = true; play(); } }, { threshold: .35 }).observe(root);
    if (btn) btn.addEventListener('click', play);
  });

  /* ---------- pestañas ---------- */
  $$('[data-tabs]').forEach(function (root) {
    var tabs = $$('[role="tab"]', root), panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    function sel(i, focus) {
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', i === j); t.tabIndex = i === j ? 0 : -1; panels[j].hidden = i !== j; });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { sel(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); sel((i + 1) % tabs.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); sel((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
    sel(0);
  });

  /* ---------- formulario de demo ---------- */
  var form = $('#demo-form');
  if (form) {
    var btn = $('#form-btn'), msg = $('#form-msg'), label = btn.innerHTML;
    form.addEventListener('submit', async function (e) {
      e.preventDefault(); btn.disabled = true; btn.textContent = 'Enviando...';
      try {
        var res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error();
        msg.style.cssText = 'display:block;background:rgba(0,135,60,.12);border:2px solid #00873C;color:var(--ok)';
        msg.textContent = '✓ Listo. Te escribimos en menos de 24 horas para agendar la demo.'; form.reset();
        if (window.track) window.track('senal_demo_enviada');
      } catch (_) {
        msg.style.cssText = 'display:block;background:rgba(232,101,10,.12);border:2px solid #E8650A;color:var(--warn)';
        msg.textContent = 'No pudimos enviarlo. Escríbenos a gerencia@dlskairos.com o por WhatsApp.';
      } finally { btn.disabled = false; btn.innerHTML = label; }
    });
  }
})();

/* ===== scrollytelling ===== */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var ico = function (id) { return '<svg class="ico" aria-hidden="true"><use href="#' + id + '"/></svg>'; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* progreso de lectura, paralaje y cinta */
  var bar = document.createElement('div'); bar.className = 'sprog'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
  var par = $$('[data-par]'), lines = $$('[data-line]'), tick = false;
  function frame() {
    tick = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--sp', max > 0 ? clamp(scrollY / max, 0, 1) : 0);
    if (!reduce && innerWidth > 900) par.forEach(function (el) { el.style.transform = 'translateY(' + (-scrollY * .07).toFixed(1) + 'px)'; });
    lines.forEach(function (el) {
      var r = el.getBoundingClientRect(), p = clamp((innerHeight * .62 - r.top) / r.height, 0, 1);
      el.style.setProperty('--p', p);
      $$('li', el).forEach(function (li, i, a) { li.classList.toggle('on', p >= i / a.length + .02); });
    });
    stories.forEach(function (s) { s.update(); });
  }
  function req() { if (!tick) { tick = true; requestAnimationFrame(frame); } }
  var tio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); tio.unobserve(e.target); } }); }, { threshold: .1 });
  $$('.tape').forEach(function (t) { tio.observe(t); });
  var fio = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('on', e.isIntersecting); }); }, { rootMargin: '-38% 0px -38% 0px' });
  $$('[data-focus] > li').forEach(function (li) { fio.observe(li); });

  /* vistas del celular de la jornada */
  var RS = [['Entrada marcada', '6:02 · ubicación registrada'], ['Inspección de arnés', 'Correas, hebillas y mosquetones'], ['Permiso de alturas', 'Punto de anclaje y plan de rescate'], ['Foto de evidencia', 'Con la cámara del celular'], ['Firma', 'Con el dedo, en la pantalla']];
  function routeView(cur, pop) {
    var rows = RS.map(function (s, i) {
      var c = i < cur ? 'done' : i === cur ? 'cur' : 'lock';
      return '<li class="st ' + c + (i === pop ? ' pop' : '') + '"><span class="n">' + (i < cur ? ico('s-check') : i + 1) + '</span><div><b>' + s[0] + '</b><em>' + s[1] + '</em></div></li>';
    }).join('');
    return '<div class="scr-top"><small>Ruta de la jornada · ' + Math.min(cur + 1, 5) + ' de 5</small><b>Trabajo en alturas</b><div class="prog"><i style="--p:' + Math.round(cur / 5 * 100) + '%"></i></div></div><ol class="route">' + rows + '</ol><div class="scr-foot"><button type="button" class="sbtn" tabindex="-1">Continuar</button></div>';
  }
  function finView() {
    return '<div class="fin"><span class="big">' + ico('s-check') + '</span><h4>Jornada lista</h4><p>Enviada a revisión del administrador.</p><ul><li>' + ico('s-sign') + 'Firma digital</li><li>' + ico('s-cam') + 'Foto de evidencia</li><li>' + ico('s-pin') + 'Ubicación y hora</li></ul></div>';
  }

  var timers = [];
  function clear() { timers.forEach(clearTimeout); timers = []; }
  function later(f, ms) { timers.push(setTimeout(f, ms)); }

  var HOOKS = {
    steps: {
      on: function (i, root) {
        clear();
        var screen = $('.route-screen', root), chip = $('.chip[data-flip]', root);
        if (i === 1) {
          screen.innerHTML = routeView(1);
          [2, 3, 4].forEach(function (c, k) { later(function () { screen.innerHTML = routeView(c, c - 1); }, reduce ? 0 : 900 * (k + 1)); });
        } else if (i === 2) {
          chip.className = 'chip pend'; chip.textContent = 'Pendiente';
          later(function () { chip.className = 'chip ok'; chip.textContent = 'Aprobado'; }, reduce ? 0 : 1300);
        }
      }
    },
    route: {
      map: function () { return 0; },
      on: function (i, root) {
        var screen = $('.route-screen', root);
        screen.innerHTML = i >= 5 ? finView() : routeView(i, i - 1);
      }
    },
    ia: {
      on: function (i, root) {
        clear();
        var rows = $$('.pr', root), fields = $$('.df', root), scan = $('.scan', root), form = $('.dform', root);
        rows.forEach(function (r) { r.classList.remove('hit'); });
        scan.classList.remove('run');
        form.classList.toggle('done', i >= 3);
        if (i === 1) {
          fields.forEach(function (f) { f.classList.remove('on'); });
          if (!reduce) { void scan.offsetWidth; scan.classList.add('run'); }
          rows.forEach(function (r, k) {
            later(function () { r.classList.add('hit'); fields[k].classList.add('on'); later(function () { r.classList.remove('hit'); }, 600); }, reduce ? 0 : 500 + k * 560);
          });
        } else {
          fields.forEach(function (f) { f.classList.toggle('on', i >= 2); });
        }
      }
    },
    record: {
      map: function (i) { return [0, 1, 1, 2][i]; },
      on: function (i, root) {
        clear();
        var chip = $('.chip[data-flip]', root);
        if (!chip) return;
        chip.className = 'chip pend'; chip.textContent = 'Pendiente';
        if (i >= 2) later(function () { chip.className = 'chip ok'; chip.textContent = 'Aprobado'; }, reduce ? 0 : 900);
      }
    },
    evidence: {
      on: function (i, root) {
        var msgs = [['s-finger', 'Ingresa con tu huella', 'O con tu PIN.'], ['s-wifioff', 'Conexión lenta', 'Tus respuestas se guardan en el dispositivo.'], ['s-sign', 'Firma y foto adjuntas', 'Evidencia capturada mientras se trabaja.'], ['s-pin', 'Ubicación y hora', 'Quedan registradas con el envío.'], ['s-check', 'Enviado a revisión', 'Trazable de principio a fin.']];
        var m = msgs[i], snk = $('.snk', root);
        snk.innerHTML = ico(m[0]) + '<div class="swap"><b>' + m[1] + '</b><span>' + m[2] + '</span></div>';
      }
    }
  };

  var stories = $$('[data-story]').map(function (root) {
    var kind = root.getAttribute('data-story'), H = HOOKS[kind] || {}, steps = $$('.story-step', root), scenes = $$('.scene', root), cur = -1;
    function set(i) {
      if (i === cur) return;
      cur = i;
      var sc = H.map ? H.map(i) : i;
      steps.forEach(function (s, j) { s.classList.toggle('on', j === i); });
      scenes.forEach(function (s) { s.classList.toggle('on', +s.getAttribute('data-s') === sc); });
      for (var j = 0; j <= steps.length; j++) root.classList.toggle('lv-' + j, j <= i);
      if (H.on) H.on(i, root);
    }
    set(0);
    return {
      update: function () {
        var vh = innerHeight, best = 0, bd = 1e9;
        steps.forEach(function (s, j) { var r = s.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - vh * (innerWidth > 900 ? .52 : .8)); if (d < bd) { bd = d; best = j; } });
        set(best);
      }
    };
  });
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req); frame();
})();
