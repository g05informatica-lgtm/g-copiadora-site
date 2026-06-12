/* ============================================================
   CONFIGURAÇÕES DO SITE — edite estes valores antes de publicar
   ============================================================ */
const AMORIZE_CONFIG = {
  marca: 'Amorize',
  slogan: 'Transforme sua história de amor em um presente inesquecível',

  // Planos oferecidos. TODOS os presentes ficam no ar para sempre — a
  // diferença é a quantidade de fotos e os recursos liberados.
  // (maxFotos: número máximo de fotos; "ilimitado" usa um teto técnico alto)
  planos: [
    {
      id: 'simples',
      nome: 'Simples',
      preco: 19.9,
      maxFotos: 8,
      musica: false,
      retrospectiva: false,
      vitalicio: false,
      destaque: false,
      resumo: 'O essencial para emocionar',
      recursos: [
        'Contador de tempo em tempo real',
        'Mensagem especial',
        'Até 8 fotos',
        'Linha do tempo do casal',
        'Conquistas desbloqueáveis',
        'No ar para sempre',
      ],
    },
    {
      id: 'completo',
      nome: 'Completo',
      preco: 34.9,
      maxFotos: 30,
      musica: true,
      retrospectiva: true,
      vitalicio: false,
      destaque: true,
      resumo: 'A experiência completa',
      recursos: [
        'Tudo do plano Simples',
        'Fotos ilimitadas',
        'Música do casal (YouTube)',
        'Retrospectiva animada',
      ],
    },
    {
      id: 'vitalicio',
      nome: 'Vitalício',
      preco: 49.9,
      maxFotos: 30,
      musica: true,
      retrospectiva: true,
      vitalicio: true,
      destaque: false,
      resumo: 'O presente definitivo',
      recursos: [
        'Tudo do plano Completo',
        'Selo "Para sempre 💎" na página',
        'Suporte prioritário no WhatsApp',
      ],
    },
  ],

  // Dados do Pix usados para gerar a chave/QR Code na tela de pagamento.
  // Troque pelos seus dados reais antes de divulgar o site.
  pix: {
    chave: '+5531995764331',              // chave Pix (telefone)
    nome: 'Guilherme Adriano da Silva Correa', // nome cadastrado no Pix
    cidade: 'Belo Horizonte',              // cidade (máx. 15 caracteres, sem acento)
  },

  // Número de WhatsApp para suporte/dúvidas (com DDI + DDD, só números)
  whatsapp: '5531995764331',
};

/* Helpers de plano (disponíveis em todas as páginas que carregam este arquivo) */
function amzGetPlano(id) {
  return AMORIZE_CONFIG.planos.find((p) => p.id === id) || AMORIZE_CONFIG.planos[0];
}

function amzPrecoFormatado(valor) {
  return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}
