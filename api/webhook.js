/* Função serverless (Vercel) — endpoint de notificações do Mercado Pago.
   O Mercado Pago chama esta URL quando há atualização de pagamento.
   Respondemos 200 rapidamente para confirmar o recebimento.

   Observação: neste modelo simples, a liberação do presente acontece na
   página de sucesso (sucesso.html), que confere o pagamento direto na API
   do Mercado Pago via /api/verificar. O webhook fica aqui pronto para uso
   futuro (ex.: registrar vendas, enviar e-mail) quando você quiser. */

module.exports = async (req, res) => {
  // Sempre responder 200 para o Mercado Pago não reenviar indefinidamente.
  res.status(200).send('ok');
};
