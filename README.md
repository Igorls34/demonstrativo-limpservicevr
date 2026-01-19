# Demonstrativo — Site Institucional

Pequeno projeto front-end estático (HTML/CSS/JS) para um site institucional com conteúdo alimentado por JSON.

## Estrutura do projeto
- `index.html` — marcação principal (BEM).
- `style.css` — estilos, incluindo responsividade e modal/menus.
- `script.js` — lógica: carrega `content.json`, popula o DOM, gerencia menu mobile, modal de captação de leads, e ícones.
- `content.json` — todo o conteúdo do site (brand, navegação, hero, serviços, depoimentos, empresas, contato e links sociais).
- `README.md` — este arquivo.

## Principais funcionalidades
- Conteúdo dinâmico via `content.json` (texto, imagens, links).
- Loading overlay enquanto o JSON carrega.
- Menu lateral para mobile com animação de hambúrguer → X.
- Botão flutuante do WhatsApp (configurável em `content.json`).
- Modal de captação de leads acionado por tempo, exit-intent ou clique em CTAs.
- Ícones via Lucide (CDN). O projeto também tenta carregar SVGs oficiais via CDN (`simple-icons`) para logotipos sociais.

## Como testar localmente
1. Abra `index.html` em um navegador (funciona como site estático). Algumas funcionalidades (fetch de `content.json` e ícones via CDN) podem requerer servir via HTTP:

   - Usando Python (padrão):

```bash
# Python 3
cd c:\trabalhos\demonstrativo
python -m http.server 8000
# Acesse http://localhost:8000
```

   - Ou use uma extensão de Live Server no VS Code.

2. Recarregue a página; `script.js` fará `fetch('content.json')` e populará o site automaticamente.

## Onde personalizar
- Conteúdo/textos/imagens/links sociais: editar `content.json`.
- Estilos: `style.css` (BEM classes usadas em `index.html`).
- Comportamento do modal: `script.js` — existem constantes como `DELAY_MS` e lógica de `exit-intent` e `localStorage` para debouncing.
- Integração de formulário (lead): `script.js` contém um `leadForm` handler que atualmente apenas `console.log()` o lead e mostra um `alert()`; substitua por um `fetch()` para enviar a um endpoint (API/CRM) se desejar.

## Ícones e logos
- Os ícones padrão são gerados por `lucide.createIcons()` (CDN importado em `index.html`).
- O código também tenta buscar SVGs oficiais via `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/<platform>.svg` e injetá-los inline nos elementos com `data-platform`.
- Se o CDN bloquear por CORS ou o usuário preferir, pode-se salvar os SVGs localmente (pasta `assets/icons/`) e ajustar `script.js` para `fetch()` a partir de `assets/icons/<platform>.svg`.

## Acessibilidade e SEO
- Tags `aria-*` básicas foram adicionadas ao modal e botões. Melhore labels, alt texts e contrastes conforme necessário.
- Para SEO, prefira gerar conteúdo estático no build (ou usar SSR) se o site for indexado automaticamente.

## Notas para produção
- Minificar `style.css` e `script.js` para performance.
- Otimizar imagens (usar WebP, CDN, lazy-loading).
- Proteger endpoints de formulário e adicionar validação/recaptcha se for público.

## Próximos passos sugeridos
- Integrar o lead form a um endpoint real (ex.: Zapier, Pipedrive, API própria).
- Salvar logos SVG localmente como fallback confiável.
- Adicionar testes básicos e pipeline de build.

Se quiser, eu posso:
- Inserir SVGs oficiais localmente em `assets/icons/` e ajustar `script.js` para carregar localmente.
- Configurar um pequeno servidor Node/Python para demo.
- Gerar uma versão minificada dos arquivos.

---
Feito por você com ajuda do assistente — diga o que quer ajustar a seguir.