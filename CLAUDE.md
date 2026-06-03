# CLAUDE.md

Guia operacional para o Claude Code trabalhar neste repositório.

## O que é este projeto

Site oficial do Ferreira Trader — SPA React que abriga **páginas de vendas** dos produtos. Cada produto vive numa rota independente (`/neuron`, `/ferreiraflix`, `/ferreiraflix-v2`). Stack idêntica entre páginas; o que muda é o copy, assets, checkout (Hotmart) e o tipo de página (vendas direta vs captura de lead).

Repositório irmão (lista de espera, captura de lead "puro"): [ferreira-alfa-lista-espera](../ferreira-alfa-lista-espera). Padrão de tracking compartilhado: ver [GUIA-TRACKING-PADRAO.md](GUIA-TRACKING-PADRAO.md) na raiz.

## Stack

- **Framework**: React 18 + Vite 6 + TypeScript
- **UI**: Tailwind CSS 3.4 + Radix UI (Accordion, Slot) + Lucide Icons
- **Roteamento**: React Router v6 (`BrowserRouter`)
- **Animação**: Lenis (smooth scroll)
- **Carrossel**: Embla (autoscroll, drag)
- **Telefone com DDI**: react-phone-number-input
- **Tracking**: Google Tag Manager (web + server Stape) via `dataLayer` puro — **sem `fbq` inline**
- **Hospedagem**: Cloudflare Pages (auto-deploy via GitHub)

## Comandos

```bash
npm install
npm run dev      # dev server → http://localhost:5173
npm run build    # build produção → dist/
npm run preview  # serve dist/ → http://localhost:4173
```

Não há test runner nem linter no `package.json` ainda. Validação é feita por `npm run build` (TypeScript + Vite).

## Rotas

| Rota | Arquivo | Tipo | Checkout | Lead capture |
|------|---------|------|----------|--------------|
| `/neuron` | [NeuronPage.tsx](src/pages/NeuronPage.tsx) | Vendas direta | Hotmart (3 planos) | — |
| `/ferreiraflix` | [FerreiraFlixPage.tsx](src/pages/FerreiraFlixPage.tsx) | Vendas direta | Hotmart | — |
| `/ferreiraflix-v2` | [FerreiraFlixV2Page.tsx](src/pages/FerreiraFlixV2Page.tsx) | Vendas + captura | Hotmart (pré-populado) | Modal popup |

Rotas são declaradas em [main.tsx](src/main.tsx). Cloudflare Pages faz fallback SPA via [public/_redirects](public/_redirects) (`/* → /index.html 200`).

## Big-picture

### SPA com 2 tipos de página
- **Vendas direta** (`/neuron`, `/ferreiraflix`): botões fazem scroll até `#checkout-section` e linkam direto pro Hotmart. Tracking limitado a `page_campaign_id` + UTMs propagadas via MutationObserver.
- **Vendas + captura** (`/ferreiraflix-v2`): mesmo layout, mas o botão final abre modal coletando nome/email/telefone. Submit grava lead em paralelo no Apps Script (planilha) e no DataCrazy CRM, dispara eventos `form_*` no dataLayer e redireciona ao Hotmart com `?name=&email=&phonenumber=` + UTMs.

A página atual reusa o mesmo componente `<PginaNetflix variant="default" | "v2-lead-form" />` — só o botão de checkout muda conforme a prop. Refatorar sem duplicar 1k+ linhas.

### Tracking GTM (web + server Stape)
- Web container: `GTM-PJGMM2NV` (declarado em [index.html](index.html))
- Server (Stape): `https://yag.ferreiratrader.com.br/gtm.js`
- **Sem pixel inline em `index.html`** — todas as tags Meta/Google são gerenciadas no GTM
- Código React só faz `window.dataLayer.push({ event: '...', ... })` via [src/lib/analytics.ts](src/lib/analytics.ts); o GTM consome e dispara o que precisa

### Captura de lead (padrão Ferreira)
Padrão herdado de [ferreira-alfa-lista-espera](../ferreira-alfa-lista-espera) e replicado em `/ferreiraflix-v2`:
1. **Gera `transactionId`** (timestamp36 + random) — vai no `dataLayer` como `eventID`, permitindo dedupe Lead browser ↔ CAPI server no Stape.
2. **Envia em paralelo** (`Promise.allSettled`):
   - **Apps Script** (planilha — backup): payload de 9 campos `utm_*, campaign, name, email, phone`, `Content-Type: text/plain;charset=utf-8`, `redirect: 'follow'`. URL compartilhada com alfa/diagnostico (`AKfycbzd...`), roteamento por `campaign`.
   - **DataCrazy CRM** (principal): payload `name/email/whatsapp/source/campaign/utm_*`, JSON normal. Business id é único por produto.
3. **Push no `dataLayer`**: `form_start` (primeiro foco), `form_success` (com `transaction_id` + `userData` + UTMs), `form_error`, `form_abandoned` (beforeunload).
4. **Redirect ao Hotmart** com campos pré-populados (`name`, `email`, `phonenumber`) + UTMs/sck via `getUrlWithUTMs()`.

## Arquivos importantes

### Hooks (compartilháveis entre rotas)
- [src/hooks/useUTMTracking.ts](src/hooks/useUTMTracking.ts) — captura UTMs da URL/referrer, gera `sck`, propaga em links/iframes via MutationObserver. Expõe `getCapturedUTMs()` e `getUrlWithUTMs()` como funções puras (uso fora de React).
- [src/hooks/useCampaignId.ts](src/hooks/useCampaignId.ts) — empurra `page_campaign_id` no `dataLayer` (uma por página).
- [src/hooks/useEmailSuggestion.ts](src/hooks/useEmailSuggestion.ts) — sugestão de typo em domínio de email via Levenshtein (gmial→gmail).

### Libs de captura (`/ferreiraflix-v2`)
- [src/lib/analytics.ts](src/lib/analytics.ts) — eventos `form_*` no dataLayer.
- [src/lib/leadSubmit.ts](src/lib/leadSubmit.ts) — POST ao Apps Script.
- [src/lib/dataCrazy.ts](src/lib/dataCrazy.ts) — POST ao webhook DataCrazy.
- [src/lib/hotmartCheckout.ts](src/lib/hotmartCheckout.ts) — `buildHotmartCheckoutUrl({ name, email, phone })`.
- [src/lib/transactionId.ts](src/lib/transactionId.ts) — `generateTransactionId()` para dedupe Pixel ↔ CAPI.

### Componentes
- [src/components/ui/](src/components/ui/) — primitivos (button, card, accordion, badge).
- [src/components/ferreiraflix/](src/components/ferreiraflix/) — específicos da página FerreiraFlix (carrosséis, modal de captura).
- [src/screens/PginaNetflix/PginaNetflix.tsx](src/screens/PginaNetflix/PginaNetflix.tsx) — componente principal (1038 linhas), aceita prop `variant`.
- [src/screens/Desktop.tsx](src/screens/Desktop.tsx) — componente principal da Neuron.

### Documentação operacional
- [docs/SESSION_LOG.md](docs/SESSION_LOG.md) — **diário cronológico** de sessões (mais recente no topo). Toda sessão começa lendo as 2 últimas entradas + `git log --oneline -10` e termina adicionando entrada nova.
- [docs/PROMPT_RETOMADA.md](docs/PROMPT_RETOMADA.md) — prompt copia-cola para retomar contexto no início de cada sessão Claude (universal + variações para casos comuns).
- [docs/SESSION_LOGS/](docs/SESSION_LOGS/) — audit detalhado por sessão (formato wave, um arquivo por entrega grande).
- [GUIA-TRACKING-PADRAO.md](GUIA-TRACKING-PADRAO.md) — guia mestre de tracking Ferreira (referência para qualquer site da família).
- [PLANO-TRACKING-IMPLEMENTACAO.md](PLANO-TRACKING-IMPLEMENTACAO.md) — plano original da implementação GTM.

## Convenções

### Campaign ID
Formato `YYYY-MM-produto[-versão][-tipo]`. Exemplos válidos em uso:
- `2025-03-neuron-vendas`
- `2025-03-ferreiraflix-vendas`
- `2026-05-ferreiraflix-v2` (sem `-vendas` quando há `-v2` no nome — caso especial confirmado pelo dropdown do GTM)

O `campaign` enviado ao Apps Script/DataCrazy e o `page_campaign_id` do `useCampaignId` **devem coincidir**.

### Tracking
- **NUNCA** adicionar `<script>fbq(...)</script>` em `index.html`. Pixel Meta vai no GTM (web + server Stape).
- **NUNCA** chamar `window.fbq()` no código React. O dataLayer event dispara a tag.
- O `transaction_id` empurrado no `form_success` é o mesmo `eventID` do payload de submit — permite Stape deduplicar browser ↔ CAPI.

### Captura de lead
- Sempre usar `Promise.allSettled` ao enviar para múltiplos endpoints — falha de um não bloqueia o outro nem o redirect.
- Sempre dispará `submitLead` (Apps Script) **e** `submitToDataCrazy` (CRM) — não escolher um só.
- Telefone vai como string só-dígitos com DDI (`5511999999999`), sem `+`. O `react-phone-number-input` mantém formato `+5511...` internamente; `replace(/\D/g, '')` antes de enviar.
- DDI deve ser **invisível ao usuário** no input (sem flag `international`, com `countryCallingCodeEditable={false}`) — evita apagar `+55` sem querer.

### Reutilização entre rotas
- Componentes de `src/components/ui/` e hooks de `src/hooks/` são compartilhados — não duplicar.
- Para criar variante de página existente (ex: A/B test), preferir **prop discriminadora** (`variant`) em vez de duplicar arquivos. Só o trecho que muda renderiza condicionalmente.

### Git
- Commits em português, mensagem direta sem prefixos (`feat:`, `fix:`), foco no "porquê".
- Co-Authored-By: Claude no final quando o commit foi assistido.
- `main` é a branch de produção — toda mudança merged vai a produção via Cloudflare Pages.

## Deploy

**Cloudflare Pages** com auto-deploy via integração GitHub.
- Projeto: `ferreira-website-official`
- Domínio: `ferreira-website-official.pages.dev` + domínio customizado
- Build command: `npm run build`
- Output: `dist/`
- Cada push em `main` dispara novo deploy (~1min).

Não há GitHub Actions próprias — Cloudflare Pages observa o repo diretamente. Para verificar status do deploy, usar `wrangler pages deployment list --project-name=ferreira-website-official` (requer login com a conta dona do projeto; conta cacheada em `.wrangler/cache/wrangler-account.json` precisa ter acesso).

### Variáveis de ambiente
Atualmente o projeto **não usa** env vars no build. Todas as URLs sensíveis (Apps Script, DataCrazy) estão hardcoded nas libs em `src/lib/` — o padrão é o mesmo do alfa-lista-espera. Se for adicionar env vars (ex: `VITE_*`), configurar no painel Cloudflare Pages → Settings → Environment variables e refazer build.

## Integrações externas

| Integração | Onde | Credencial / URL |
|------------|------|------------------|
| Hotmart (Neuron) | `Desktop.tsx` | `pay.hotmart.com/J101304792C?off=...` (3 ofertas) |
| Hotmart (FerreiraFlix) | `PginaNetflix.tsx` / `hotmartCheckout.ts` | `pay.hotmart.com/S100822439E?...&sck=9fb8aa2a...` |
| GTM Web | `index.html` | `GTM-PJGMM2NV` via `yag.ferreiratrader.com.br/gtm.js` |
| GTM Server (Stape) | (painel externo) | `yag.ferreiratrader.com.br` |
| Apps Script (planilha lead) | `leadSubmit.ts` | `script.google.com/macros/s/AKfycbzd.../exec` (compartilhado com alfa + diagnostico) |
| DataCrazy CRM (FerreiraFlix v2) | `dataCrazy.ts` | `api.datacrazy.io/v1/crm/.../19fbbc11-...` |
| WhatsApp suporte | `PginaNetflix.tsx` / `Desktop.tsx` | `ferreiratrader.link/suporte?text=...` (excluído da propagação de UTMs) |

## Quando alterar este arquivo

- Quando uma rota nova for criada
- Quando um padrão de captura/tracking mudar
- Quando um endpoint externo trocar (Apps Script, DataCrazy, GTM)
- Quando uma convenção for revogada/criada

Sempre que esse arquivo for alterado, atualizar também:
- [docs/SESSION_LOG.md](docs/SESSION_LOG.md) com entrada nova no topo (diário cronológico)
- [docs/SESSION_LOGS/](docs/SESSION_LOGS/) com session_NN_*.md detalhado se a sessão foi grande

## Iniciando uma sessão Claude

Cole no chat o conteúdo de [docs/PROMPT_RETOMADA.md](docs/PROMPT_RETOMADA.md) §"Prompt universal" antes de pedir qualquer coisa. Garante que o Claude lê SESSION_LOG, confere `git status`/`git log`, e responde com sumário do estado antes de propor próximo passo.
