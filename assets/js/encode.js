/* Codificação base64 segura para UTF-8 (acentos e emojis) usada para
   transportar os dados do presente dentro da própria URL — sem backend. */

function amzEncode(obj) {
  const json = JSON.stringify(obj);
  const utf8 = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode('0x' + p1)
  );
  return btoa(utf8).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function amzDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const utf8 = atob(base64);
  const json = decodeURIComponent(
    Array.prototype.map
      .call(utf8, (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(json);
}
