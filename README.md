# Amorize 💕

Site para vender **presentes digitais personalizados** (página surpresa para casais),
com contador de tempo juntos, mensagem especial, fotos, música, linha do tempo,
conquistas e uma retrospectiva animada. Pagamento via Pix (chave/QR Code).

100% estático (HTML/CSS/JS puro) — não precisa de servidor, banco de dados nem login.

## Estrutura

```
index.html          → página de vendas (landing page)
criar.html          → formulário em etapas para montar o presente + pagamento Pix
presente.html       → página final do presente (gerada via link)
assets/css/style.css
assets/js/
  config.js         → configurações da loja (nome, preço, chave Pix, WhatsApp)
  pix.js            → gera o Pix "copia e cola" + QR Code
  milestones.js     → lista de conquistas desbloqueáveis
  encode.js         → codifica/decodifica os dados do presente na URL
  main.js           → corações animados + menu mobile
  criar.js          → lógica do formulário em etapas
  presente.js       → renderiza a página final do presente
```

## Como funciona

1. O cliente preenche os dados em `criar.html` (nomes, data, mensagem, fotos, música,
   linha do tempo e tema visual).
2. Na etapa de pagamento, aparece o QR Code/chave Pix gerados a partir de `config.js`.
3. Após "confirmar o pagamento", o site gera automaticamente um link único
   (`presente.html?d=...`) com todos os dados embutidos — **sem precisar de banco de dados**.
4. O cliente copia o link/QR Code e envia para a pessoa especial.

## Antes de publicar — configure `assets/js/config.js`

```js
const AMORIZE_CONFIG = {
  marca: 'Amorize',
  preco: 19.9,
  pix: {
    chave: 'sua-chave-pix-real',   // e-mail, telefone, CPF/CNPJ ou chave aleatória
    nome: 'SEU NOME OU EMPRESA',   // como está cadastrado no Pix (máx. 25 caracteres)
    cidade: 'SUA CIDADE',          // máx. 15 caracteres, sem acento
  },
  whatsapp: '55DDDNUMERO',         // usado no rodapé/suporte
};
```

> ⚠️ **Importante:** o QR Code é gerado por um serviço público (api.qrserver.com) a partir
> do payload Pix. Teste o pagamento de verdade (com valor baixo) antes de divulgar o site,
> para garantir que a chave está correta.

## Testar localmente

Qualquer servidor estático funciona, por exemplo:

```bash
npx serve .
# ou
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Publicar (gratuito, hoje mesmo)

Qualquer um destes serve, sem precisar configurar nada além do `config.js`:

- **Netlify**: arraste a pasta do projeto em https://app.netlify.com/drop
- **Vercel**: `vercel` (CLI) ou importe o repositório
- **GitHub Pages**: ative em *Settings → Pages* apontando para a branch/pasta do projeto
- **Cloudflare Pages**: importe o repositório, build command vazio, output `/`

## Personalização rápida

- **Cores/tema**: variáveis CSS em `assets/css/style.css` (`:root`) e classes
  `.tema-rosa`, `.tema-vermelho`, `.tema-roxo`, `.tema-dourado`.
- **Preço**: `AMORIZE_CONFIG.preco`.
- **Conquistas**: edite `assets/js/milestones.js`.
- **Textos da landing page**: edite diretamente `index.html` (seções "Recursos",
  "Como funciona", "Depoimentos").

## Avisos

- Os depoimentos em `index.html` são **exemplos** — substitua por avaliações reais
  de clientes antes de divulgar.
- Para anúncios pagos, comece com um orçamento controlado e acompanhe o custo por
  venda nos primeiros dias antes de escalar o investimento.
