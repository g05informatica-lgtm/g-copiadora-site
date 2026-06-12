document.addEventListener('DOMContentLoaded', () => {
  const steps = Array.from(document.querySelectorAll('.form-step'));
  const progressBar = document.getElementById('progress-bar');
  let current = 0;

  // Plano selecionado (começa no primeiro da lista)
  let planoAtual = AMORIZE_CONFIG.planos[0];

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
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const passo = steps[current];
    if (passo.querySelector('#fotos-container')) configurarFotosParaPlano();
    if (passo.querySelector('.pix-box')) prepararPagamento();
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

  // -------------------------------------------------------
  // Seleção de plano
  // -------------------------------------------------------
  function renderPlanos() {
    const container = document.getElementById('plan-options');
    container.innerHTML = '';

    AMORIZE_CONFIG.planos.forEach((plano) => {
      const card = document.createElement('label');
      card.className = `plan-card${plano.destaque ? ' destaque' : ''}${plano.id === planoAtual.id ? ' selected' : ''}`;
      card.dataset.id = plano.id;

      const recursos = plano.recursos.map((r) => `<li>${r}</li>`).join('');
      const selo = plano.destaque ? '<span class="plan-badge">Mais popular</span>' : '';

      card.innerHTML = `
        ${selo}
        <input type="radio" name="plano" value="${plano.id}" ${plano.id === planoAtual.id ? 'checked' : ''} />
        <div class="plan-name">${plano.nome}</div>
        <div class="plan-price">${amzPrecoFormatado(plano.preco)}</div>
        <div class="plan-resumo">${plano.resumo}</div>
        <ul class="plan-features">${recursos}</ul>
      `;

      card.addEventListener('click', () => {
        planoAtual = plano;
        container.querySelectorAll('.plan-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        card.querySelector('input[type="radio"]').checked = true;
      });

      container.appendChild(card);
    });
  }

  // -------------------------------------------------------
  // Fotos dinâmicas (limite conforme o plano) + música condicional
  // -------------------------------------------------------
  function novaFotoInput(valor = '') {
    const input = document.createElement('input');
    input.type = 'url';
    input.className = 'foto-input';
    input.placeholder = 'https://...';
    input.value = valor;
    return input;
  }

  function contarFotos() {
    return document.querySelectorAll('#fotos-container .foto-input').length;
  }

  function configurarFotosParaPlano() {
    const container = document.getElementById('fotos-container');
    const btnAdd = document.getElementById('btn-add-foto');
    const hint = document.getElementById('fotos-hint');
    const musicaField = document.getElementById('musica-field');
    const max = planoAtual.maxFotos;

    // Mantém as fotos já digitadas, mas respeita o limite do plano
    const existentes = Array.from(container.querySelectorAll('.foto-input'))
      .map((i) => i.value)
      .filter(Boolean);

    container.innerHTML = '';
    const inicial = Math.max(2, Math.min(existentes.length, max));
    for (let i = 0; i < inicial; i++) {
      container.appendChild(novaFotoInput(existentes[i] || ''));
    }

    const ilimitado = max >= 30;
    hint.textContent = ilimitado
      ? 'Fotos ilimitadas neste plano. Cole o link direto de cada imagem (Google Fotos, Imgur, Drive...).'
      : `Seu plano permite até ${max} fotos. Cole o link direto de cada imagem.`;

    btnAdd.style.display = contarFotos() >= max ? 'none' : '';

    // Música só nos planos que liberam o recurso
    musicaField.style.display = planoAtual.musica ? '' : 'none';
  }

  document.getElementById('btn-add-foto').addEventListener('click', () => {
    const container = document.getElementById('fotos-container');
    if (contarFotos() >= planoAtual.maxFotos) return;
    container.appendChild(novaFotoInput());
    if (contarFotos() >= planoAtual.maxFotos) {
      document.getElementById('btn-add-foto').style.display = 'none';
    }
  });

  // Seleção visual do tema
  document.querySelectorAll('#theme-options .theme-option').forEach((option) => {
    option.addEventListener('click', () => {
      document.querySelectorAll('#theme-options .theme-option').forEach((o) => o.classList.remove('selected'));
      option.classList.add('selected');
      option.querySelector('input[type="radio"]').checked = true;
    });
  });

  renderPlanos();
  mostrarPasso(0);

  // -------------------------------------------------------
  // Pagamento (Pix)
  // -------------------------------------------------------
  function prepararPagamento() {
    const valor = planoAtual.preco;
    document.getElementById('plano-escolhido').textContent = `Plano ${planoAtual.nome}`;
    document.getElementById('valor-pix').textContent = amzPrecoFormatado(valor);

    const payload = gerarPayloadPix({
      chave: AMORIZE_CONFIG.pix.chave,
      nome: AMORIZE_CONFIG.pix.nome,
      cidade: AMORIZE_CONFIG.pix.cidade,
      valor,
      descricao: `${AMORIZE_CONFIG.marca} ${planoAtual.nome}`,
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
    const fotos = Array.from(document.querySelectorAll('#fotos-container .foto-input'))
      .map((input) => input.value.trim())
      .filter(Boolean)
      .slice(0, planoAtual.maxFotos);

    const linha = [1, 2, 3]
      .map((n) => ({
        data: document.getElementById(`linha${n}-data`).value,
        titulo: document.getElementById(`linha${n}-titulo`).value.trim(),
        texto: document.getElementById(`linha${n}-texto`).value.trim(),
      }))
      .filter((item) => item.titulo)
      .sort((a, b) => (a.data || '').localeCompare(b.data || ''));

    const tema = document.querySelector('input[name="tema"]:checked').value;
    const musica = planoAtual.musica
      ? extrairYoutubeId(document.getElementById('musica').value.trim())
      : '';

    return {
      de: document.getElementById('de').value.trim(),
      para: document.getElementById('para').value.trim(),
      data: document.getElementById('data').value,
      mensagem: document.getElementById('mensagem').value.trim(),
      musica,
      fotos,
      linha,
      tema,
      plano: planoAtual.id,
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
