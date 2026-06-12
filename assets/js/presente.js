const AMZ_MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const codificado = params.get('d');
  const dados = codificado ? amzDecode(codificado) : dadosExemplo();
  const inicio = parseDataLocal(dados.data);

  aplicarTema(dados.tema);
  preencherCabecalho(dados, inicio);
  iniciarContador(inicio);
  preencherMensagem(dados);
  preencherGaleria(dados);
  preencherMusica(dados);
  preencherRetrospectiva(dados, inicio);
  preencherConquistas(inicio);
  preencherLinhaDoTempo(dados);
});

function dadosExemplo() {
  return {
    de: 'Alguém especial',
    para: 'Você',
    data: '2022-06-12',
    mensagem:
      'E pensar que tudo começou do nada... ✨ Olha só pra gente agora, escrevendo nossa própria história. Te amo mais a cada dia que passa!',
    musica: 'dQw4w9WgXcQ',
    fotos: [],
    linha: [
      { data: '2022-01-15', titulo: 'Primeira mensagem', texto: 'O dia em que tudo começou.' },
      { data: '2022-06-12', titulo: 'Ficamos juntos', texto: 'A melhor decisão da minha vida.' },
    ],
    tema: 'rosa',
  };
}

function parseDataLocal(dataStr) {
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  return new Date(ano, mes - 1, dia, 0, 0, 0);
}

function formatarData(dataStr) {
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  return `${dia} de ${AMZ_MESES[mes - 1]} de ${ano}`;
}

const AMZ_TEMAS_VALIDOS = ['rosa', 'vermelho', 'roxo', 'dourado'];

function aplicarTema(tema) {
  const body = document.getElementById('gift-body');
  body.classList.remove('tema-rosa');
  body.classList.add(`tema-${AMZ_TEMAS_VALIDOS.includes(tema) ? tema : 'rosa'}`);
}

function preencherCabecalho(dados, inicio) {
  document.getElementById('gift-from').textContent = `De ${dados.de}, com todo amor`;
  document.getElementById('gift-title').textContent = `Para ${dados.para} 💕`;
  document.getElementById('gift-since').textContent = `Juntos desde ${formatarData(dados.data)}`;
}

/* ---------- Contador em tempo real ---------- */

function calcularDiferenca(inicio, agora) {
  let anos = agora.getFullYear() - inicio.getFullYear();
  let meses = agora.getMonth() - inicio.getMonth();
  let dias = agora.getDate() - inicio.getDate();
  let horas = agora.getHours() - inicio.getHours();
  let minutos = agora.getMinutes() - inicio.getMinutes();
  let segundos = agora.getSeconds() - inicio.getSeconds();

  if (segundos < 0) { segundos += 60; minutos--; }
  if (minutos < 0) { minutos += 60; horas--; }
  if (horas < 0) { horas += 24; dias--; }
  if (dias < 0) {
    const diasMesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
    dias += diasMesAnterior;
    meses--;
  }
  if (meses < 0) { meses += 12; anos--; }

  return { anos, meses, dias, horas, minutos, segundos };
}

function iniciarContador(inicio) {
  const grid = document.getElementById('counter-grid');
  const itens = [
    { key: 'anos', label: 'Anos' },
    { key: 'meses', label: 'Meses' },
    { key: 'dias', label: 'Dias' },
    { key: 'horas', label: 'Horas' },
    { key: 'minutos', label: 'Minutos' },
    { key: 'segundos', label: 'Segundos' },
  ];

  grid.innerHTML = itens
    .map((item) => `
      <div class="counter-item">
        <div class="value" id="counter-${item.key}">0</div>
        <div class="label">${item.label}</div>
      </div>
    `)
    .join('');

  function atualizar() {
    const diff = calcularDiferenca(inicio, new Date());
    itens.forEach((item) => {
      document.getElementById(`counter-${item.key}`).textContent = diff[item.key];
    });
  }

  atualizar();
  setInterval(atualizar, 1000);
}

/* ---------- Mensagem especial ---------- */

function preencherMensagem(dados) {
  const section = document.getElementById('message-section');
  if (!dados.mensagem) {
    section.style.display = 'none';
    return;
  }

  const texto = document.getElementById('message-text');
  const botao = document.getElementById('btn-mostrar-mensagem');
  texto.textContent = dados.mensagem;

  botao.addEventListener('click', () => {
    const visivel = texto.classList.toggle('show');
    botao.textContent = visivel ? 'Ocultar mensagem' : 'Mostrar mensagem 💌';
  });
}

/* ---------- Galeria ---------- */

function preencherGaleria(dados) {
  const section = document.getElementById('gallery-section');
  const galeria = document.getElementById('gallery');

  if (!dados.fotos || dados.fotos.length === 0) {
    section.style.display = 'none';
    return;
  }

  dados.fotos.forEach((url) => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Foto do casal';
    img.loading = 'lazy';
    img.addEventListener('error', () => img.remove());
    galeria.appendChild(img);
  });
}

/* ---------- Música ---------- */

function preencherMusica(dados) {
  const section = document.getElementById('music-section');
  if (!dados.musica) {
    section.style.display = 'none';
    return;
  }

  document.getElementById('music-iframe').src = `https://www.youtube.com/embed/${dados.musica}`;
}

/* ---------- Conquistas ---------- */

function preencherConquistas(inicio) {
  const diasTotais = Math.floor((new Date() - inicio) / 86400000);
  const grid = document.getElementById('achievements-grid');
  const resumo = document.getElementById('achievements-summary');

  let desbloqueadas = 0;
  grid.innerHTML = AMZ_MILESTONES
    .map((m) => {
      const ok = diasTotais >= m.dias;
      if (ok) desbloqueadas++;
      return `
        <div class="achievement ${ok ? '' : 'locked'}">
          <div class="icon">${ok ? m.icone : '🔒'}</div>
          <div class="title">${m.titulo}</div>
        </div>
      `;
    })
    .join('');

  resumo.textContent = `${desbloqueadas}/${AMZ_MILESTONES.length} conquistas desbloqueadas`;
}

/* ---------- Linha do tempo ---------- */

function preencherLinhaDoTempo(dados) {
  const section = document.getElementById('timeline-section');
  const timeline = document.getElementById('timeline');

  if (!dados.linha || dados.linha.length === 0) {
    section.style.display = 'none';
    return;
  }

  timeline.innerHTML = dados.linha
    .map(
      (item) => `
      <div class="timeline-item">
        ${item.data ? `<div class="date">${formatarData(item.data)}</div>` : ''}
        <h4>${escapeHtml(item.titulo)}</h4>
        ${item.texto ? `<p>${escapeHtml(item.texto)}</p>` : ''}
      </div>
    `
    )
    .join('');
}

/* ---------- Retrospectiva ---------- */

function preencherRetrospectiva(dados, inicio) {
  const diff = calcularDiferenca(inicio, new Date());

  const slides = [
    {
      titulo: `${dados.de} ❤️ ${dados.para}`,
      texto: `Juntos desde ${formatarData(dados.data)}`,
    },
  ];

  (dados.fotos || []).slice(0, 4).forEach(() => {
    slides.push({ titulo: '', texto: 'Um momento especial 💕' });
  });

  slides.push({
    titulo: `${diff.anos} anos, ${diff.meses} meses e ${diff.dias} dias`,
    texto: 'de muito amor e cumplicidade 💞',
  });

  if (dados.mensagem) {
    slides.push({
      titulo: 'Mensagem especial 💌',
      texto: dados.mensagem.length > 180 ? `${dados.mensagem.slice(0, 180)}…` : dados.mensagem,
    });
  }

  slides.push({
    titulo: `Continue escrevendo essa história, ${dados.para} 💕`,
    texto: `Com amor, ${dados.de}`,
  });

  // Associa as fotos aos slides "Um momento especial"
  let fotoIndex = 0;
  const fotos = dados.fotos || [];

  const card = document.getElementById('retro-card');
  const dotsContainer = document.getElementById('retro-dots');

  slides.forEach((slide, i) => {
    const div = document.createElement('div');
    div.className = `retro-slide ${i === 0 ? 'active' : ''}`;

    if (slide.texto === 'Um momento especial 💕' && fotos[fotoIndex]) {
      div.classList.add('has-photo');
      div.style.backgroundImage = `url("${fotos[fotoIndex]}")`;
      fotoIndex++;
    }

    div.innerHTML = `
      <div class="retro-content">
        ${slide.titulo ? `<h3>${escapeHtml(slide.titulo)}</h3>` : ''}
        <p>${escapeHtml(slide.texto)}</p>
      </div>
    `;
    card.insertBefore(div, dotsContainer);

    const dot = document.createElement('span');
    dot.className = `retro-dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => irParaSlide(i));
    dotsContainer.appendChild(dot);
  });

  const slideEls = card.querySelectorAll('.retro-slide');
  const dotEls = dotsContainer.querySelectorAll('.retro-dot');
  let atual = 0;

  function irParaSlide(index) {
    atual = (index + slideEls.length) % slideEls.length;
    slideEls.forEach((el, i) => el.classList.toggle('active', i === atual));
    dotEls.forEach((el, i) => el.classList.toggle('active', i === atual));
  }

  document.getElementById('retro-prev').addEventListener('click', () => irParaSlide(atual - 1));
  document.getElementById('retro-next').addEventListener('click', () => irParaSlide(atual + 1));

  setInterval(() => irParaSlide(atual + 1), 4500);
}

/* ---------- Utilitário ---------- */

function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}
