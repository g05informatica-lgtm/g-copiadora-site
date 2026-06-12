document.addEventListener('DOMContentLoaded', () => {
  criarCoracoesFlutuantes();
  configurarMenuMobile();
});

/** Cria corações decorativos flutuando no fundo (.hearts-bg). */
function criarCoracoesFlutuantes() {
  const containers = document.querySelectorAll('.hearts-bg');
  const simbolos = ['💗', '💖', '💕', '💘', '❤️'];

  containers.forEach((container) => {
    const quantidade = Number(container.dataset.quantidade || 16);
    for (let i = 0; i < quantidade; i++) {
      const heart = document.createElement('span');
      heart.className = 'heart';
      heart.textContent = simbolos[i % simbolos.length];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.fontSize = `${1 + Math.random() * 1.8}rem`;
      heart.style.animationDuration = `${8 + Math.random() * 12}s`;
      heart.style.animationDelay = `${Math.random() * 10}s`;
      heart.style.opacity = String(0.25 + Math.random() * 0.5);
      container.appendChild(heart);
    }
  });
}

/** Liga/desliga o menu mobile (.nav-toggle / .nav-links). */
function configurarMenuMobile() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('open');
  });
}
