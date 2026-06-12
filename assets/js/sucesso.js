/* Página de sucesso: confere o pagamento no Mercado Pago e, só se estiver
   APROVADO, libera o link do presente. Os dados do presente ficam guardados
   no navegador (localStorage) desde o momento em que o cliente clicou em pagar. */

const AMZ_POLL_MAX = 20; // tentativas
const AMZ_POLL_INTERVALO = 4000; // 4s entre tentativas

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  // O Mercado Pago acrescenta esses parâmetros ao voltar para o site.
  const paymentId = params.get('payment_id') || params.get('collection_id');
  const d = localStorage.getItem('amz_pending');

  document.getElementById('btn-copiar-link').addEventListener('click', () => {
    copiarTexto(document.getElementById('link-gerado').value, 'btn-copiar-link');
  });
  document.getElementById('btn-verificar-novamente').addEventListener('click', () => {
    mostrarEstado('verificando');
    iniciarVerificacao(paymentId, d, 1);
  });

  if (!d) {
    mostrarErro('Não encontramos os dados do seu presente neste navegador. Use o mesmo aparelho/navegador em que você preencheu o presente.');
    return;
  }
  if (!paymentId) {
    // Sem id de pagamento: pode ter caído aqui sem pagar.
    mostrarEstado('pendente');
    return;
  }

  iniciarVerificacao(paymentId, d, 1);
});

function iniciarVerificacao(paymentId, d, tentativa) {
  fetch(`/api/verificar?id=${encodeURIComponent(paymentId)}`)
    .then((r) => r.json())
    .then((info) => {
      if (info.status === 'approved') {
        revelarPresente(d);
        return;
      }
      if (info.status === 'rejected' || info.status === 'cancelled') {
        mostrarErro('O pagamento foi recusado ou cancelado. Tente novamente.');
        return;
      }
      // pending / in_process: tenta de novo por um tempo
      if (tentativa < AMZ_POLL_MAX) {
        setTimeout(() => iniciarVerificacao(paymentId, d, tentativa + 1), AMZ_POLL_INTERVALO);
      } else {
        mostrarEstado('pendente');
      }
    })
    .catch(() => {
      if (tentativa < 3) {
        setTimeout(() => iniciarVerificacao(paymentId, d, tentativa + 1), AMZ_POLL_INTERVALO);
      } else {
        mostrarErro('Não foi possível falar com o servidor de pagamento. Verifique sua conexão e tente novamente.');
      }
    });
}

function revelarPresente(d) {
  const link = `${location.origin}/presente.html?d=${d}`;
  document.getElementById('link-gerado').value = link;
  document.getElementById('btn-abrir').href = link;

  let nomeDe = 'Alguém especial';
  try {
    const dados = amzDecode(d);
    if (dados && dados.de) nomeDe = dados.de;
  } catch (e) { /* mantém padrão */ }

  const texto = `💌 ${nomeDe} preparou um presente especial pra você! Clique para abrir: ${link}`;
  document.getElementById('btn-whatsapp-share').href = `https://wa.me/?text=${encodeURIComponent(texto)}`;

  localStorage.removeItem('amz_pending');
  mostrarEstado('aprovado');
}

function mostrarEstado(estado) {
  ['verificando', 'aprovado', 'pendente', 'erro'].forEach((e) => {
    document.getElementById(`estado-${e}`).style.display = e === estado ? '' : 'none';
  });
}

function mostrarErro(msg) {
  document.getElementById('erro-msg').textContent = msg;
  mostrarEstado('erro');
}

function copiarTexto(texto, botaoId) {
  navigator.clipboard.writeText(texto).then(() => {
    const btn = document.getElementById(botaoId);
    const original = btn.textContent;
    btn.textContent = 'Copiado!';
    setTimeout(() => (btn.textContent = original), 1500);
  });
}
