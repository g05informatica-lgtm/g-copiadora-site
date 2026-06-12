/* Função serverless (Vercel) — confere na API do Mercado Pago se um
   pagamento foi realmente aprovado. É isto que "libera" o presente:
   o status vem direto do Mercado Pago, então não dá para falsificar. */

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    res.status(500).json({ erro: 'MP_ACCESS_TOKEN não configurado no servidor' });
    return;
  }

  const id = req.query && req.query.id;
  if (!id) {
    res.status(400).json({ erro: 'Informe o id do pagamento' });
    return;
  }

  try {
    const r = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await r.json();

    if (!r.ok) {
      res.status(502).json({ erro: 'Não foi possível consultar o pagamento', detalhe: data });
      return;
    }

    res.status(200).json({
      status: data.status, // approved, pending, rejected, ...
      status_detail: data.status_detail,
      valor: data.transaction_amount,
      metodo: data.payment_type_id,
    });
  } catch (e) {
    res.status(502).json({ erro: 'Falha de conexão com o Mercado Pago', detalhe: String(e) });
  }
};
