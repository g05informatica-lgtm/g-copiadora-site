/* Função serverless (Vercel) — cria uma cobrança no Mercado Pago (Checkout Pro).
   O Access Token fica numa variável de ambiente segura (MP_ACCESS_TOKEN),
   NUNCA no código do site. */

// Tabela de preços no servidor — o preço é definido aqui, nunca confiando
// no valor enviado pelo navegador (evita fraude).
const PLANOS = {
  simples: { nome: 'Simples', preco: 19.9 },
  completo: { nome: 'Completo', preco: 34.9 },
  vitalicio: { nome: 'Vitalício', preco: 49.9 },
};

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.status(405).json({ erro: 'Método não permitido' });
    return;
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    res.status(500).json({ erro: 'MP_ACCESS_TOKEN não configurado no servidor' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const plano = PLANOS[body.planoId];
  if (!plano) {
    res.status(400).json({ erro: 'Plano inválido' });
    return;
  }

  const origin = req.headers.origin || `https://${req.headers.host}`;
  const externalRef = `amz_${Date.now()}`;

  const preference = {
    items: [
      {
        title: `Amorize — Plano ${plano.nome}`,
        description: 'Presente digital personalizado para casal',
        quantity: 1,
        unit_price: plano.preco,
        currency_id: 'BRL',
      },
    ],
    external_reference: externalRef,
    back_urls: {
      success: `${origin}/sucesso.html`,
      pending: `${origin}/sucesso.html`,
      failure: `${origin}/criar.html`,
    },
    auto_return: 'approved',
    notification_url: `${origin}/api/webhook`,
  };

  try {
    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });
    const data = await r.json();

    if (!r.ok) {
      res.status(502).json({ erro: 'Erro ao criar pagamento no Mercado Pago', detalhe: data });
      return;
    }

    // Com token de TESTE, o Mercado Pago também devolve um link de sandbox
    // (simulador) que permite escolher Aprovado/Rejeitado/Pendente sem
    // precisar logar com uma conta de teste. Priorizamos esse link quando
    // disponível — com token de produção ele não vem, então cai no normal.
    res.status(200).json({
      init_point: data.sandbox_init_point || data.init_point,
      sandbox_init_point: data.sandbox_init_point,
      id: data.id,
      external_reference: externalRef,
    });
  } catch (e) {
    res.status(502).json({ erro: 'Falha de conexão com o Mercado Pago', detalhe: String(e) });
  }
};
