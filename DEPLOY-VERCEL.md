# Como publicar no Vercel com Mercado Pago

Este guia coloca o site no ar com pagamento automático pelo Mercado Pago.
O site é estático + 3 funções serverless em `/api`. O Vercel serve tudo junto, de graça.

## 1. Pegar as credenciais do Mercado Pago

1. Acesse <https://www.mercadopago.com.br/developers/panel> e entre na sua conta.
2. Crie uma aplicação (ou use uma existente) → menu **Credenciais**.
3. Você vai usar o **Access Token**:
   - **TESTE** (começa com `TEST-...`) → para validar sem dinheiro real.
   - **Produção** (começa com `APP_USR-...`) → para vender de verdade.

> 🔒 O Access Token é **secreto**. Nunca coloque no código nem mande por chat. Ele só vai no painel do Vercel (passo 3).

## 2. Importar o projeto no Vercel

1. Acesse <https://vercel.com> e faça login **com o GitHub**.
2. **Add New… → Project** e selecione o repositório `g-copiadora-site`.
3. Em *Framework Preset* deixe **Other** (é um site estático + /api). Não precisa de build command.
4. Clique em **Deploy** (vai dar erro de pagamento só porque ainda falta a variável — resolvemos no passo 3).

## 3. Configurar o Access Token (a "caixa-forte")

1. No projeto do Vercel: **Settings → Environment Variables**.
2. Adicione:
   - **Name:** `MP_ACCESS_TOKEN`
   - **Value:** cole seu Access Token de **TESTE** (`TEST-...`)
   - **Environments:** marque Production, Preview e Development.
3. Salve e vá em **Deployments → ... → Redeploy** para aplicar.

## 4. Testar (com credenciais de TESTE)

1. Abra a URL do Vercel (algo como `https://g-copiadora-site.vercel.app`).
2. Crie um presente e clique em **Pagar com Mercado Pago**.
3. Use os [cartões/contas de teste do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards) para simular um pagamento aprovado.
4. Após aprovar, você deve cair em `sucesso.html` e ver o link do presente liberado.

## 5. Ir para produção (dinheiro real)

1. Troque o valor de `MP_ACCESS_TOKEN` pelo Access Token de **produção** (`APP_USR-...`).
2. **Redeploy**.
3. Faça **uma compra real de teste** (valor baixo) para confirmar que o dinheiro cai na sua conta e o link aparece.

## Domínio próprio (opcional, quando comprar)

No Vercel: **Settings → Domains → Add** e siga as instruções de DNS. O HTTPS é automático.

## Observações

- Os dados do presente ficam guardados **no navegador do cliente** entre o pagamento e a
  liberação. Por isso o cliente deve concluir tudo no **mesmo aparelho/navegador**.
- O endpoint `/api/webhook` já está pronto para uso futuro (registrar vendas, enviar e-mail).
- O fluxo antigo de Pix manual (`pix.js`) não é mais usado, mas o arquivo foi mantido no projeto.
