/* ============================================================
   CONFIGURAÇÕES DO SITE — edite estes valores antes de publicar
   ============================================================ */
const AMORIZE_CONFIG = {
  marca: 'Amorize',
  slogan: 'Transforme sua história de amor em um presente inesquecível',
  preco: 19.9,

  // Dados do Pix usados para gerar a chave/QR Code na tela de pagamento.
  // Troque pelos seus dados reais antes de divulgar o site.
  pix: {
    chave: 'seuemail@exemplo.com', // chave Pix (e-mail, telefone, CPF/CNPJ ou aleatória)
    nome: 'NOME DO RECEBEDOR',     // nome cadastrado no Pix (máx. 25 caracteres, sem acento)
    cidade: 'SAO PAULO',           // cidade (máx. 15 caracteres, sem acento)
  },

  // Número de WhatsApp para suporte/dúvidas (com DDI + DDD, só números)
  whatsapp: '5511999999999',
};
