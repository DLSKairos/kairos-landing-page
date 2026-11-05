/* Idioma del sitio: español por defecto; inglés si el navegador está en otro idioma o si se elige con el botón ES | EN.
   Las traducciones viven en i18n-en.js, indexadas por el texto original en español.
   Orden de carga: en <head> (define el idioma y carga el diccionario) y al final del <body> con i18n.apply(), antes de kairos.js/senal.js.
   Depuración: abre cualquier página con ?lang=es y, en la consola, i18n.missing() lista los textos que aún no tienen traducción. */
(function () {
  var KEY = 'kairos-lang', root = document.documentElement;

  function pick() {
    var q = /[?&]lang=(es|en)\b/.exec(location.search), v;
    if (q) { try { localStorage.setItem(KEY, q[1]); } catch (e) {} return q[1]; }
    try { v = localStorage.getItem(KEY); } catch (e) {}
    if (v === 'es' || v === 'en') return v;
    var n = (navigator.languages && navigator.languages[0]) || navigator.language || 'es';
    return /^es\b/i.test(n) ? 'es' : 'en';
  }
  var lang = pick(), D = {};

  /* el diccionario se carga en el <head>, antes de pintar nada, y solo si hace falta */
  if (lang === 'en' && !document.body) {
    document.write('<script src="' + document.currentScript.src.replace(/i18n\.js(\?.*)?$/, 'i18n-en.js') + '"><\/script>');
  }

  /* t('texto', { n: 2 }): traduce un texto armado desde JS; {n} se reemplaza con los valores dados */
  function t(s, v) {
    var r = lang === 'en' && D[s] != null ? D[s] : s;
    return v ? r.replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }) : r;
  }

  var SKIP = /^(script|style|noscript|canvas)$/, FMT = /^(a|b|br|em|i|small|span|strong|sub|sup|u|wbr)$/;
  var ATTRS = ['alt', 'title', 'aria-label', 'placeholder'], META = /^(description|og:title|og:description|twitter:title|twitter:description)$/;
  var norm = function (s) { return s.replace(/\s+/g, ' ').trim(); };

  /* texto mezclado con etiquetas en línea (<em>, <b>, <br>…): se traduce completo, no por fragmentos */
  function inline(el) {
    if (!FMT.test(el.localName)) return false;
    for (var i = 0; i < el.children.length; i++) if (!inline(el.children[i])) return false;
    return true;
  }
  function rich(el) {
    var txt = false, tag = false;
    for (var i = 0; i < el.childNodes.length; i++) {
      var c = el.childNodes[i];
      if (c.nodeType === 3) txt = txt || c.nodeValue.trim() !== '';
      else if (c.nodeType === 1) { if (!inline(c)) return false; tag = true; }
    }
    return txt && tag;
  }

  /* enlaces con texto precargado (WhatsApp, asunto del correo) */
  function link(a, tr) {
    var h = a.getAttribute('href') || '';
    var n = h.replace(/([?&](?:text|subject)=)([^&]*)/, function (m, p, v) {
      var es; try { es = decodeURIComponent(v); } catch (e) { return m; }
      var en = tr(es); return en == null ? m : p + encodeURIComponent(en);
    });
    if (n !== h) a.setAttribute('href', n);
  }

  /* recorre la página llamando tr(textoEnEspañol); si devuelve un texto, lo pone en su lugar */
  function walk(n, tr) {
    if (n.nodeType === 3) {
      var k = norm(n.nodeValue), v = k && tr(k);
      if (v != null) n.nodeValue = /^\s*/.exec(n.nodeValue)[0] + v + /\s*$/.exec(n.nodeValue)[0];
      return;
    }
    if (n.nodeType === 1) {
      if (SKIP.test(n.localName) || n.className === 'lang') return;
      ATTRS.forEach(function (a) { var s = n.getAttribute(a), r = s && tr(norm(s)); if (r != null) n.setAttribute(a, r); });
      if (n.localName === 'meta' && META.test(n.name || n.getAttribute('property'))) { var m = tr(norm(n.content)); if (m != null) n.content = m; }
      if (n.localName === 'a') link(n, tr);
      if (rich(n)) { var u = tr(norm(n.innerHTML)); if (u != null) n.innerHTML = u; return; }
      if (n.localName === 'template') walk(n.content, tr);
    }
    Array.prototype.slice.call(n.childNodes).forEach(function (c) { walk(c, tr); });
  }
  var lookup = function (k) { return D[k]; };

  /* botón ES | EN en el menú */
  function switcher() {
    var host = document.querySelector('.nav-links, .sn-links'); if (!host) return;
    var g = document.createElement('div'); g.className = 'lang'; g.setAttribute('role', 'group'); g.setAttribute('aria-label', 'Idioma / Language');
    g.innerHTML = ['es', 'en'].map(function (l) {
      return '<button type="button" lang="' + l + '" data-l="' + l + '" aria-pressed="' + (l === lang) + '">' + l.toUpperCase() + '</button>';
    }).join('');
    g.addEventListener('click', function (e) {
      var l = e.target.getAttribute && e.target.getAttribute('data-l');
      if (!l || l === lang) return;
      try { localStorage.setItem(KEY, l); } catch (x) {}
      var u = new URL(location.href); u.searchParams.set('lang', l); location.href = u.href;
    });
    host.appendChild(g);
  }

  window.i18n = {
    lang: lang,
    t: t,
    apply: function () {
      D = window.I18N_EN || {};
      if (lang === 'en') {
        root.lang = 'en';
        walk(root, lookup);
        var loc = document.querySelector('meta[property="og:locale"]'); if (loc) loc.content = 'en_US';
      }
      switcher();
    },
    missing: function () {
      var out = [], d = window.I18N_EN || {};
      walk(root, function (k) { if (d[k] == null && /[A-Za-zÁ-ÿ]{2}/.test(k) && out.indexOf(k) < 0) out.push(k); });
      return out;
    }
  };
})();
