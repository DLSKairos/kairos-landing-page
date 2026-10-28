/* Analítica y cookies compartidas por todo el sitio (Kairos + SEÑAL). */
(function () {
  /* analítica: Google Analytics 4, solo con consentimiento */
  var GA_ID = 'G-VWKLH1PMMQ'; // pega aquí tu ID de medición, por ejemplo 'G-XXXXXXXXXX'
  function track(n) { if (window.gtag) gtag('event', n); }
  window.track = track;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a'); if (!a) return;
    var u = a.getAttribute('href') || '';
    if (u.indexOf('wa.me') > -1) track('whatsapp_click');
    else if (u.indexOf('calendly') > -1) track('agenda_click');
    else if (u.indexOf('mailto:') === 0) track('email_click');
  });
  (function () {
    if (!GA_ID) return;
    var key = 'kairos-cookies', pref = null;
    try { pref = localStorage.getItem(key); } catch (e) {}
    function load() {
      var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date()); gtag('config', GA_ID, { anonymize_ip: true });
    }
    if (pref === 'si') { load(); return; }
    if (pref === 'no') return;
    var b = document.createElement('div'); b.className = 'cookies'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Cookies de analítica');
    b.innerHTML = '<p>Usamos cookies de analítica (Google Analytics) para entender cómo se usa el sitio y mejorarlo. <a href="politica-datos.html" target="_blank" rel="noopener">Más información</a></p><div><button type="button" data-v="no">Rechazar</button><button type="button" data-v="si" class="y">Aceptar</button></div>';
    document.body.appendChild(b); document.body.classList.add('cb');
    b.addEventListener('click', function (e) {
      var v = e.target.getAttribute && e.target.getAttribute('data-v'); if (!v) return;
      try { localStorage.setItem(key, v); } catch (x) {}
      b.remove(); document.body.classList.remove('cb'); if (v === 'si') load();
    });
  })();

})();
