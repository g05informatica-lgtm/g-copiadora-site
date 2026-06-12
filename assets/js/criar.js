document.addEventListener('DOMContentLoaded', () => {
  const steps = Array.from(document.querySelectorAll('.form-step'));
  const progressBar = document.getElementById('progress-bar');
  let current = 0;

  steps.forEach(() => {
    const span = document.createElement('span');
    progressBar.appendChild(span);
  });

  function atualizarProgresso() {
    const spans = progressBar.querySelectorAll('span');
    spans.forEach((span, i) => span.classList.toggle('active', i <= current));
  }

  function mostrarPasso(index) {
    steps.forEach((step, i) => step.classList.toggle('active', i === index));
    current = index;
    atualizarProgresso();

    if (steps[current].dataset.step === '6') {
      prepararPagamento();
    }
  }

  function validarPasso(index) {
    const campos = steps[index].querySelectorAll('input[required], textarea[required]');
    for (const campo of campos) {
      if (!campo.checkValidity()) {
        campo.reportValidity();
        return false;
      }
    }
    return true;
  }

  document.querySelectorAll('.next').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!validarPasso(current)) return;
      if (current < steps.length - 1) mostrarPasso(current + 1);
    });
  });

  document.querySelectorAll('.prev').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (current > 0) mostrarPasso(current - 1);
    });
  });

  // Seleção visual do tema
  document.querySelectorAll('#theme-options .theme-option').forEach((option) => {
    option.addEventListener('click', () => {
      document.querySelectorAll('#theme-options .theme-option').forEach((o) => o.classList.remove('selected'));
      option.classList.add('selected');
      option.querySelector('input[type="radio"]').checked = true;
    });
  });

  mostrarPasso(0);

  // -------------------------------------------------------
  // Pagamento (Pix)
  // -------------------------------------------------------
  function prepararPagamento() {
    const valor = AMORIZE_CONFIG.preco;
    document.getElementById('valor-pix').textContent = `R$ ${valor.toFixed(2).replace('.', ',')}`;

    const payload = gerarPayloadPix({
      chave: AMORIZE_CONFIG.pix.chave,
      nome: AMORIZE_CONFIG.pix.nome,
      cidade: AMORIZE_CONFIG.pix.cidade,
      valor,
      descricao: AMORIZE_CONFIG.marca,
    });

    document.getElementById('chave-pix').value = AMORIZE_CONFIG.pix.chave;
    document.getElementById('qr-pix').src = gerarQrCodeUrl(payload);
  }

  document.getElementById('btn-copiar-chave').addEventListener('click', () => {
    copiarTexto(document.getElementById('chave-pix').value, 'btn-copiar-chave');
  });

  // -------------------------------------------------------
  // Geração da página do presente
  // -------------------------------------------------------
  document.getElementById('btn-gerar').addEventListener('click', () => {
    const dados = coletarDados();
    const link = `${location.origin}${location.pathname.replace('criar.html', '')}presente.html?d=${amzEncode(dados)}`;

    document.getElementById('link-gerado').value = link;
    document.getElementById('btn-abrir').href = link;

    const textoCompartilhar = `💌 ${dados.de} preparou um presente especial pra você! Clique para abrir: ${link}`;
    document.getElementById('btn-whatsapp-share').href = `https://wa.me/?text=${encodeURIComponent(textoCompartilhar)}`;

    mostrarPasso(steps.length - 1);
  });

  document.getElementById('btn-copiar-link').addEventListener('click', () => {
    copiarTexto(document.getElementById('link-gerado').value, 'btn-copiar-link');
  });

  function coletarDados() {
    const fotos = ['foto1', 'foto2', 'foto3', 'foto4']
      .map((id) => document.getElementById(id).value.trim())
      .filter(Boolean);

    const linha = [1, 2, 3]
      .map((n) => ({
        data: document.getElementById(`linha${n}-data`).value,
        titulo: document.getElementById(`linha${n}-titulo`).value.trim(),
        texto: document.getElementById(`linha${n}-texto`).value.trim(),
      }))
      .filter((item) => item.titulo)
      .sort((a, b) => (a.data || '').localeCompare(b.data || ''));

    const tema = document.querySelector('input[name="tema"]:checked').value;

    return {
      de: document.getElementById('de').value.trim(),
      para: document.getElementById('para').value.trim(),
      data: document.getElementById('data').value,
      mensagem: document.getElementById('mensagem').value.trim(),
      musica: extrairYoutubeId(document.getElementById('musica').value.trim()),
      fotos,
      linha,
      tema,
    };
  }

  function extrairYoutubeId(url) {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : '';
  }

  function copiarTexto(texto, botaoId) {
    navigator.clipboard.writeText(texto).then(() => {
      const btn = document.getElementById(botaoId);
      const original = btn.textContent;
      btn.textContent = 'Copiado!';
      setTimeout(() => (btn.textContent = original), 1500);
    });
  }
});
