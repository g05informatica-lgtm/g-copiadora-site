/* Gerador de Pix Copia-e-Cola (BR Code / EMV) + QR Code, 100% no navegador.
   Baseado no padrão do Banco Central (Arranjo Pix). */

function pixTLV(id, value) {
  const len = String(value.length).padStart(2, '0');
  return `${id}${len}${value}`;
}

function pixCRC16(payload) {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ polynomial) & 0xffff : (crc << 1) & 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function removeAcentos(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\x00-\x7F]/g, '');
}

/**
 * Monta o payload Pix "copia e cola".
 * @param {{chave: string, nome: string, cidade: string, valor?: number, identificador?: string, descricao?: string}} dados
 */
function gerarPayloadPix({ chave, nome, cidade, valor, identificador = '***', descricao = '' }) {
  const nomeLimpo = removeAcentos(nome).substring(0, 25);
  const cidadeLimpa = removeAcentos(cidade).substring(0, 15);

  let merchantAccountInfo = pixTLV('00', 'BR.GOV.BCB.PIX') + pixTLV('01', chave);
  if (descricao) {
    merchantAccountInfo += pixTLV('02', removeAcentos(descricao).substring(0, 40));
  }

  let payload = '';
  payload += pixTLV('00', '01'); // Payload Format Indicator
  payload += pixTLV('26', merchantAccountInfo); // Merchant Account Info (Pix)
  payload += pixTLV('52', '0000'); // Merchant Category Code
  payload += pixTLV('53', '986'); // Moeda: Real (BRL)
  if (valor) {
    payload += pixTLV('54', Number(valor).toFixed(2)); // Valor da transação
  }
  payload += pixTLV('58', 'BR'); // País
  payload += pixTLV('59', nomeLimpo || 'RECEBEDOR'); // Nome do recebedor
  payload += pixTLV('60', cidadeLimpa || 'BRASIL'); // Cidade
  payload += pixTLV('62', pixTLV('05', identificador)); // Campo adicional (txid)
  payload += '6304'; // CRC16 placeholder

  return payload + pixCRC16(payload);
}

/** Retorna a URL de uma imagem de QR Code (gerada por serviço público) para o payload informado. */
function gerarQrCodeUrl(payload, tamanho = 256) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${tamanho}x${tamanho}&data=${encodeURIComponent(payload)}`;
}
