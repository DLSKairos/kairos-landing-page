(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* reveal on scroll */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.rv, .srow, #chart').forEach(function (el) { io.observe(el); });

  /* hero: tilt window flattens with scroll */
  var win = $('#win');
  function tilt() {
    if (!win) return;
    var y = scrollY, p = Math.min(1, Math.max(0, y / (innerHeight * .7)));
    win.style.setProperty('--rx', (innerWidth < 720 ? 14 : 24) * (1 - p) + 'deg');
    win.style.setProperty('--s', .93 + .07 * p);
  }

  /* statement: word-by-word reveal */
  var stmt = $('#stmt'), words = [];
  (function () {
    if (!stmt) return;
    var hot = ['inteligencia', 'artificial'];
    stmt.innerHTML = stmt.textContent.split(' ').map(function (w) {
      return '<span class="w' + (hot.indexOf(w.replace(/[.,]/g, '')) > -1 ? ' hot' : '') + '">' + w + '</span>';
    }).join(' ');
    words = $$('.w', stmt);
  })();
  function reveal() {
    if (!stmt) return;
    var r = stmt.getBoundingClientRect(), vh = innerHeight;
    var p = reduce ? 1 : Math.min(1, Math.max(0, (vh * .88 - r.top) / (r.height + vh * .38)));
    var n = p * words.length;
    words.forEach(function (w, i) { w.style.opacity = Math.min(1, Math.max(.16, n - i)); });
  }

  var tick = false;
  function onScroll() { if (tick) return; tick = true; requestAnimationFrame(function () { tilt(); reveal(); tick = false; }); }
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();

  /* spotlight on tiles */
  $$('.tile, .pr').forEach(function (t) {
    t.addEventListener('pointermove', function (e) {
      var r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* hero network */
  (function () {
    if (!$('#net')) return;
    var c = $('#net'), x = c.getContext('2d'), W, H, dpr, nodes = [], mouse = { x: -999, y: -999 }, run = true;
    function size() {
      dpr = Math.min(2, devicePixelRatio || 1); var b = c.parentNode.getBoundingClientRect();
      W = b.width; H = Math.min(b.height, innerHeight * 1.15); c.width = W * dpr; c.height = H * dpr; c.style.height = H + 'px'; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(90, W * H / 15000)); nodes = [];
      for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.4 + .7 });
    }
    function frame() {
      x.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        if (!reduce) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
          var dx = a.x - mouse.x, dy = a.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < 160) { a.x += dx / d * (160 - d) * .02; a.y += dy / d * (160 - d) * .02; }
        }
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], l = Math.hypot(a.x - b.x, a.y - b.y);
          if (l < 140) { x.strokeStyle = 'rgba(90,165,255,' + (.28 * (1 - l / 140)) + ')'; x.lineWidth = 1; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); }
        }
        var m = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        x.fillStyle = m < 180 ? 'rgba(160,210,255,.95)' : 'rgba(110,170,255,.55)';
        x.beginPath(); x.arc(a.x, a.y, a.r + (m < 180 ? 1 : 0), 0, 6.283); x.fill();
      }
      if (run && !reduce) requestAnimationFrame(frame);
    }
    size(); frame();
    addEventListener('resize', function () { size(); if (reduce) frame(); });
    c.parentNode.addEventListener('pointermove', function (e) { var b = c.getBoundingClientRect(); mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top; });
    new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !run) { run = true; frame(); } run = v; }).observe(c.parentNode);
  })();

  /* productos: celular interactivo */
  (function () {
    if (!$('#pshow')) return;
    var keys = ['senal', 'vigia', 'flujo', 'pila', 'llave'], order = ['home'].concat(keys);
    var HUE = { home: '#1a6bcc', senal: '#FFC400', vigia: '#0ea5ae', flujo: '#35c47a', pila: '#ff6a3d', llave: '#e0951f' };
    var stage = $('#stage-scr'), home = $('#home'), show = $('#pshow'), card = $('#pcard'), pscroll = $('#pscroll'), lens = $('#lens');
    var ambA = $('.amb .a'), ambB = $('.amb .b'), phone = $('.phone', show), tilt = $('.ptilt', show);
    var scr = {}, cur = 'home', lensReady = false;
    var glare = document.createElement('i'); glare.className = 'glare'; stage.appendChild(glare);
    keys.forEach(function (k) {
      var s = $('#scr-' + k).content.firstElementChild.cloneNode(true); s.setAttribute('aria-hidden', 'true'); stage.appendChild(s); scr[k] = s;
      Array.prototype.forEach.call(s.children, function (c, i) { c.style.setProperty('--i', i); });
    });
    $$('.pi').forEach(function (a) {
      var h3 = $('h3', a), t = h3.textContent; h3.setAttribute('aria-label', t);
      h3.innerHTML = t.split('').map(function (c, j) { return '<span class="lx" aria-hidden="true" style="--j:' + j + '">' + c + '</span>'; }).join('');
      var i = 0; Array.prototype.forEach.call(a.children, function (c) { if (c.tagName !== 'H3' && !c.classList.contains('feats')) c.style.setProperty('--i', i++); });
      $$('.feats li', a).forEach(function (li, k) { li.style.setProperty('--k', k); });
    });
    function origin(k) {
      var ic = $('.appi[data-k="' + k + '"] .ai', home);
      return [(ic.offsetLeft + ic.offsetWidth / 2) / home.offsetWidth * 100, (ic.offsetTop + ic.offsetHeight / 2) / home.offsetHeight * 100];
    }
    function prep(el, o, s0, tx) {
      el.style.transition = 'none'; el.style.setProperty('--ox', o[0] + '%'); el.style.setProperty('--oy', o[1] + '%'); el.style.setProperty('--s0', s0); el.style.setProperty('--tx', (tx || 0) + 'px');
      void el.offsetWidth; el.style.transition = '';
    }
    function center(el) { var c = card.getBoundingClientRect(), r = el.getBoundingClientRect(); return [r.left + r.width / 2 - c.left, r.top + r.height / 2 - c.top]; }
    /* ondas de color: el ambiente se expande desde donde tocaste */
    function ripple(hex, xy) {
      card.style.setProperty('--tint', hex);
      ambB.getAnimations().forEach(function (a) { a.finish(); });
      ambB.style.setProperty('--c', hex);
      if (reduce) { ambA.style.setProperty('--c', hex); return; }
      var x = xy[0], y = xy[1], R = Math.hypot(Math.max(x, card.offsetWidth - x), Math.max(y, card.offsetHeight - y)) + 24;
      var an = ambB.animate([{ clipPath: 'circle(0px at ' + x + 'px ' + y + 'px)' }, { clipPath: 'circle(' + R + 'px at ' + x + 'px ' + y + 'px)' }], { duration: 1200, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
      an.onfinish = function () { ambA.style.setProperty('--c', hex); an.cancel(); };
    }
    /* el celular gira como una tarjeta y un destello cruza el cristal */
    function turn(dir) {
      if (reduce) return;
      phone.getAnimations().forEach(function (a) { a.cancel(); });
      phone.animate([
        { transform: 'perspective(1400px) rotateY(0deg) translateZ(0) scale(1)' },
        { transform: 'perspective(1400px) rotateY(' + (-dir * 26) + 'deg) translateZ(-100px) scale(.93)', offset: .42 },
        { transform: 'perspective(1400px) rotateY(0deg) translateZ(0) scale(1)' }
      ], { duration: 950, easing: 'cubic-bezier(.25,1.1,.4,1)' });
      glare.getAnimations().forEach(function (a) { a.cancel(); });
      glare.animate([{ transform: 'translateX(-130%)' }, { transform: 'translateX(130%)' }], { duration: 1100, delay: 140, easing: 'cubic-bezier(.3,.6,.3,1)' });
    }
    /* la lente de cristal se estira como líquido entre botones */
    function moveLens(b, animate) {
      var nL = b.offsetLeft, nW = b.offsetWidth;
      lens.style.top = b.offsetTop + 'px'; lens.style.height = b.offsetHeight + 'px';
      if (animate && lensReady && !reduce) {
        var oL = lens.offsetLeft, oW = lens.offsetWidth, uL = Math.min(oL, nL), uR = Math.max(oL + oW, nL + nW);
        lens.getAnimations().forEach(function (a) { a.cancel(); });
        lens.animate([
          { left: oL + 'px', width: oW + 'px', transform: 'scaleY(1)' },
          { left: uL + 'px', width: (uR - uL) + 'px', transform: 'scaleY(.82)', offset: .42 },
          { left: nL + 'px', width: nW + 'px', transform: 'scaleY(1)' }
        ], { duration: 820, easing: 'cubic-bezier(.3,1.25,.5,1)' });
      }
      lens.style.left = nL + 'px'; lens.style.width = nW + 'px'; lensReady = true;
    }
    function go(k, src) {
      if (k === cur) return;
      var prev = cur; cur = k;
      var dir = Math.sign(order.indexOf(k) - order.indexOf(prev)), mobile = matchMedia('(max-width: 960px)').matches;
      if (k === 'home' && mobile && show.getBoundingClientRect().top < 0) show.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      if (prev === 'home') prep(scr[k], origin(k), .2, 0);
      else if (k === 'home') prep(scr[prev], origin(prev), .2, 0);
      else { prep(scr[prev], [50, 50], 1, -dir * 46); prep(scr[k], [50, 50], 1, dir * 46); }
      keys.forEach(function (x) { scr[x].classList.toggle('on', x === k); });
      home.classList.toggle('away', k !== 'home');
      show.classList.toggle('idle', k === 'home');
      show.style.setProperty('--dir', dir);
      $$('.pi').forEach(function (s) { s.classList.toggle('on', s.dataset.k === (k === 'home' ? '' : k)); });
      var btn = $('button[data-k="' + k + '"]', pscroll);
      $$('button', pscroll).forEach(function (b) { b.classList.toggle('on', b === btn); });
      pscroll.scrollTo({ left: btn.offsetLeft - (pscroll.clientWidth - btn.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
      moveLens(btn, true);
      ripple(HUE[k], center(src || btn));
      if (prev !== 'home' && k !== 'home') turn(dir || 1); else turn(0.0001);
    }
    $$('.appi').forEach(function (b) { b.addEventListener('click', function () { go(b.dataset.k, $('.ai', b)); }); });
    $$('button', pscroll).forEach(function (b) { b.addEventListener('click', function () { go(b.dataset.k, b); }); });
    $('#pcta').addEventListener('click', function (e) { go('senal', e.currentTarget); });
    $('#hbar').addEventListener('click', function (e) { go('home', e.currentTarget); });
    show.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') go('home', $('#hbar'));
      if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && pscroll.contains(document.activeElement)) {
        var i = order.indexOf(cur) + (e.key === 'ArrowRight' ? 1 : -1);
        if (i >= 0 && i < order.length) { var b = $('button[data-k="' + order[i] + '"]', pscroll); go(order[i], b); b.focus(); }
      }
    });
    /* brillo del cristal sigue al cursor, el celular se inclina con el puntero */
    pscroll.parentNode.addEventListener('pointermove', function (e) { var r = this.getBoundingClientRect(); this.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%'); });
    if (!reduce && matchMedia('(hover: hover)').matches) {
      card.addEventListener('pointermove', function (e) {
        var r = phone.getBoundingClientRect(), dx = (e.clientX - (r.left + r.width / 2)) / innerWidth, dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        tilt.style.setProperty('--ry', Math.max(-9, Math.min(9, dx * 24)) + 'deg'); tilt.style.setProperty('--rx', Math.max(-7, Math.min(7, -dy * 18)) + 'deg');
      });
      card.addEventListener('pointerleave', function () { tilt.style.setProperty('--ry', '0deg'); tilt.style.setProperty('--rx', '0deg'); });
    }
    function place() { moveLens($('button.on', pscroll), false); }
    place(); addEventListener('resize', place); if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  })();

  /* ICCU: mapa con registros en tiempo real */
  (function () {
    var svg = $('#imap-svg'); if (!svg) return;
    var ps = $$('.prov', svg), out = $('#live-t'), pinned = false, timer, last = -1;
    function show(p) { out.textContent = '● ' + p.getAttribute('data-n'); }
    function ping() {
      if (pinned) return;
      var i; do { i = Math.floor(Math.random() * ps.length); } while (i === last); last = i;
      var p = ps[i]; p.classList.add('hot'); out.textContent = 'Nuevo registro · ' + p.getAttribute('data-n');
      setTimeout(function () { p.classList.remove('hot'); }, 1400);
    }
    ps.forEach(function (p) {
      p.addEventListener('pointerenter', function () { pinned = true; show(p); });
      p.addEventListener('pointerleave', function () { pinned = false; out.textContent = 'Registros en tiempo real'; });
      p.addEventListener('click', function () { show(p); p.classList.add('hot'); setTimeout(function () { p.classList.remove('hot'); }, 900); });
    });
    if (reduce) { ps[3].classList.add('pick'); ps[9].classList.add('pick'); return; }
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { if (!timer) { ping(); timer = setInterval(ping, 2200); } }
      else { clearInterval(timer); timer = null; }
    }, { threshold: .25 }).observe(svg);
  })();

  /* chat demo */
  (function () {
    if (!$('#chat')) return;
    var b = $('#chat-b'), timers = [], started = false;
    function el(c, h) { var d = document.createElement('div'); d.className = c; d.innerHTML = h; b.appendChild(d); requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('show'); }); }); return d; }
    function at(ms, f) { timers.push(setTimeout(f, ms)); }
    function play() {
      b.innerHTML = '';
      el('msg u', 'Permiso de trabajo en alturas · Torre grúa 3 · Turno 6:00 a. m.');
      var ty;
      at(900, function () { ty = el('msg a', '<span class="typing"><i></i><i></i><i></i></span>'); });
      at(2600, function () { ty.innerHTML = 'Revisando certificaciones y permisos activos…'; });
      at(4200, function () { ty.innerHTML = '<b>Riesgo alto detectado.</b> La certificación de alturas del operario vence hoy. Recomiendo devolver el permiso y solicitar la renovación.'; });
      var ac; at(5600, function () { ac = el('acts', '<span class="p1">Devolver permiso</span><span>Aprobar con excepción</span>'); });
      at(7000, function () { ac.firstChild.classList.add('pick'); });
      at(7600, function () { el('done', '<svg class="ico"><use href="#i-check"/></svg>Permiso devuelto · Trazabilidad registrada'); });
      at(12500, play);
    }
    function static_() {
      b.innerHTML = '<div class="msg u show">Permiso de trabajo en alturas · Torre grúa 3 · Turno 6:00 a. m.</div><div class="msg a show"><b>Riesgo alto detectado.</b> La certificación de alturas del operario vence hoy. Recomiendo devolver el permiso y solicitar la renovación.</div><div class="done show"><svg class="ico"><use href="#i-check"/></svg>Permiso devuelto · Trazabilidad registrada</div>';
    }
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { if (!started) { started = true; reduce ? static_() : play(); } }
      else if (started && !reduce) { timers.forEach(clearTimeout); timers = []; started = false; }
    }, { threshold: .4 }).observe($('#chat'));
  })();

  /* counters */
  $$('[data-count]').forEach(function (n) {
    var to = +n.dataset.count, pre = n.dataset.pre || '', suf = n.dataset.suf || '';
    new IntersectionObserver(function (es, o) {
      if (!es[0].isIntersecting) return; o.disconnect();
      if (reduce) return;
      var t0 = performance.now();
      (function step(t) { var p = Math.min(1, (t - t0) / 1800), e = 1 - Math.pow(1 - p, 4); n.textContent = pre + Math.round(to * e) + suf; if (p < 1) requestAnimationFrame(step); })(t0);
    }, { threshold: .6 }).observe(n);
  });

  /* form */
  var form = $('#contact-form'), btn = $('#form-btn'), msg = $('#form-msg');
  var arrow = '<svg class="ico"><use href="#i-arrow"/></svg>';
  if (form) form.addEventListener('submit', async function (e) {
    e.preventDefault(); btn.disabled = true; btn.textContent = 'Enviando...';
    try {
      var res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error();
      msg.style.cssText = 'display:block;background:rgba(40,200,120,.12);border:1px solid rgba(40,200,120,.35);color:#6fe0a5';
      msg.textContent = '✓ Mensaje enviado. Te respondemos en menos de 24 horas.'; form.reset(); window.track && window.track('formulario_enviado');
    } catch (_) {
      msg.style.cssText = 'display:block;background:rgba(255,90,90,.12);border:1px solid rgba(255,90,90,.35);color:#ff9d9d';
      msg.textContent = 'Hubo un error. Escríbenos directamente a gerencia@dlskairos.com';
    } finally { btn.disabled = false; btn.innerHTML = 'Enviar mensaje ' + arrow; }
  });
})();

/* menú móvil */
(function () {
  var nav = document.querySelector('nav'), tg = document.querySelector('.nav-tg');
  if (!tg) return;
  tg.addEventListener('click', function () { var o = nav.classList.toggle('open'); tg.setAttribute('aria-expanded', o); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) { nav.classList.remove('open'); tg.setAttribute('aria-expanded', 'false'); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { nav.classList.remove('open'); tg.setAttribute('aria-expanded', 'false'); } });
})();
