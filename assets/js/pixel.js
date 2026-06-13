/* ============================================================
   META PIXEL (Facebook/Instagram Ads) — Amorize
   ------------------------------------------------------------
   1. Crie um Pixel no Gerenciador de Eventos do Meta.
   2. Copie o ID (só números) e cole abaixo em META_PIXEL_ID.
   Enquanto estiver com o valor de exemplo, o pixel NÃO carrega
   (evita disparar evento pra conta errada).
   ============================================================ */
const META_PIXEL_ID = '2047566616644325';

(function () {
  if (!META_PIXEL_ID || META_PIXEL_ID.indexOf('COLE') === 0) return; // sem ID válido = não carrega
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
})();

/* Helpers usados pelas outras páginas. Sem pixel carregado, viram no-op. */
function amzTrackInitiateCheckout(valor) {
  if (window.fbq) fbq('track', 'InitiateCheckout', { value: Number(valor) || 0, currency: 'BRL' });
}
function amzTrackPurchase(valor) {
  if (window.fbq) fbq('track', 'Purchase', { value: Number(valor) || 0, currency: 'BRL' });
}
