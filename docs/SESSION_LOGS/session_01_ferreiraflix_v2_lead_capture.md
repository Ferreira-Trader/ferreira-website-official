# Sessão 01 — FerreiraFlix v2: rota com captura de lead via modal popup

**Data**: 2026-05-23
**Branch**: `main`
**Commits**: `34fe5c7` → `88e9134` (8 commits)
**Tipo**: Implementação
**Área**: Página de vendas, Captura de Lead, Tracking
**Prioridade**: Alta
**Resultado**: Sucesso
**Impacto**: Major
**Tags**: react, vite, typescript, tailwind, gtm, hotmart, datacrazy, apps-script, meta-pixel

---

## Objetivo

Criar a rota `/ferreiraflix-v2` como variação da `/ferreiraflix` em que o botão "Liberar meu acesso agora" abre um modal popup coletando nome, email e telefone com DDI. Após o submit, o lead é gravado em paralelo no Google Apps Script (planilha) e no DataCrazy CRM, eventos GTM são emitidos para o Stape, e o usuário é redirecionado ao Hotmart com os campos pré-populados e UTMs preservadas.

---

## Contexto

A página `/ferreiraflix` (componente `PginaNetflix`) é uma single-page de vendas com CTA direto para Hotmart em [PginaNetflix.tsx:888](../../src/screens/PginaNetflix/PginaNetflix.tsx#L888). O time de marketing precisava de uma versão alternativa para testar captura de lead antes do checkout — mantendo o mesmo layout, mas com retenção do lead no CRM (DataCrazy) e backup em planilha mesmo se o usuário abandonar o checkout.

Padrões usados como referência:
- **Modal/Form**: [galltek-caslu-landing/caslu-landing-v2](../../../../galltek-global-llc/galltek-caslu-landing/caslu-landing-v2/src/App.tsx) (popup + transactionId + analytics dataLayer).
- **Apps Script + DataCrazy**: [ferreira-alfa-lista-espera](../../../ferreira-alfa-lista-espera/src/lib) — mesma URL do Apps Script (`AKfycbzd...`) já roteia leads por `campaign`.

---

## Solução técnica

### Refatoração mínima de PginaNetflix
Adicionada prop opcional `variant?: 'default' | 'v2-lead-form'` ao componente. Apenas o botão final de checkout muda conforme o variant — todos os outros CTAs ("Quero Aprender", "Entrar no FerreiraFlix") continuam fazendo scroll para `#checkout-section` sem alteração. Em `v2-lead-form`, o `<a href="hotmart.com/...">` vira `<button onClick={openModal}>`.

### Modal popup (LeadCaptureModal)
- Provider com Context API expõe `openModal()` via hook `useLeadCapture()` — quando chamado fora do provider, retorna no-op (página default não quebra).
- Inputs: nome (HTML5 required), email (regex rigorosa + `onBlur` + sugestão de typo via Levenshtein), telefone (`react-phone-number-input` com `defaultCountry="BR"`, sem flag `international` para ocultar o `+55` visualmente, mas mantendo o DDI no value).
- Validação em `onBlur` para feedback antes do submit; borda vermelha quando há erro.
- Botão de submit estiliza-se igual ao "Liberar meu acesso agora" original (`bg-[#fc0820]` + `animate-shine`).

### Submit paralelo (Apps Script + DataCrazy)
`Promise.allSettled([submitLead, submitToDataCrazy])` garante que falha de um endpoint não bloqueia o outro nem o redirect. Cada lib tem URL e payload próprios:

| Endpoint | URL | Payload | Headers |
|----------|-----|---------|---------|
| Apps Script (planilha) | `script.google.com/macros/s/AKfycbzd.../exec` | 9 campos ordenados: `utm_*, campaign, name, email, phone` | `text/plain;charset=utf-8` (evita preflight) |
| DataCrazy CRM | `api.datacrazy.io/v1/crm/.../19fbbc11-...` | `{ name, email, whatsapp, source, campaign, utm_* }` | `application/json` |

`campaign='2026-05-ferreiraflix-v2'` (sem sufixo `-vendas`) — confirmado pelo dropdown do GTM/Apps Script. `source='ferreiraflix-v2-modal'`.

### Tracking GTM
Hook `useCampaignId('2026-05-ferreiraflix-v2')` empurra `page_campaign_id` no dataLayer. Lib `analytics.ts` (cópia 1:1 do padrão Caslu) emite no submit:
- `form_start` no primeiro foco
- `form_success` com `transaction_id`, `userData`, UTMs
- `form_error` se ambos os submits falharem
- `form_abandoned` se o usuário sai com campos preenchidos

O `transaction_id` (gerado via `generateTransactionId()` — timestamp36 + random) é o `eventID` que o Stape usa para deduplicar Lead browser ↔ CAPI server-side. **Sem pixel inline** — tudo via GTM web (`GTM-PJGMM2NV`) e GTM server Stape (`yag.ferreiratrader.com.br`).

### Hotmart pré-populado
`buildHotmartCheckoutUrl({ name, email, phone })` injeta `?name=&email=&phonenumber=` na URL base do checkout e delega UTMs/sck ao `getUrlWithUTMs()` refatorado para função pura no `useUTMTracking.ts`.

### Validação de email
Hook `useEmailSuggestion` (replicado do `ferreira-alfa-lista-espera`):
- Lista de 17 domínios populares (gmail, hotmail, outlook, yahoo, uol, bol, terra, ig, globo, live, icloud, me, aol, msn, protonmail, zoho).
- Distância de Levenshtein contra domínio digitado — se for 1-2 caracteres de diferença, sugere botão clicável "Você quis dizer joao@gmail.com? Clique para corrigir".

---

## Arquivos criados/modificados

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/pages/FerreiraFlixV2Page.tsx` | Criado | Wrapper análogo a FerreiraFlixPage com Lenis + useCampaignId + LeadCaptureProvider |
| `src/components/ferreiraflix/LeadCaptureProvider.tsx` | Criado | Context + hook `useLeadCapture()` |
| `src/components/ferreiraflix/LeadCaptureModal.tsx` | Criado | Modal popup com form, validação e estados de loading/sucesso/erro |
| `src/lib/analytics.ts` | Criado | Eventos dataLayer (form_start, form_success, form_error, form_abandoned) |
| `src/lib/leadSubmit.ts` | Criado | POST ao Apps Script com payload de 9 campos |
| `src/lib/dataCrazy.ts` | Criado | POST ao webhook DataCrazy CRM (FerreiraFlix business id) |
| `src/lib/hotmartCheckout.ts` | Criado | `buildHotmartCheckoutUrl` com pré-população e UTMs |
| `src/lib/transactionId.ts` | Criado | `generateTransactionId()` para dedupe Pixel ↔ CAPI |
| `src/hooks/useEmailSuggestion.ts` | Criado | Sugestão de typo em domínio de email via Levenshtein |
| `src/hooks/useUTMTracking.ts` | Modificado | Expõe `getCapturedUTMs()` e `getUrlWithUTMs()` como funções puras (estado de módulo) |
| `src/screens/PginaNetflix/PginaNetflix.tsx` | Modificado | Prop `variant`; botão final renderiza `<button onClick={openModal}>` quando `v2-lead-form` |
| `src/main.tsx` | Modificado | Adiciona rota `<Route path="/ferreiraflix-v2" element={<FerreiraFlixV2Page />} />` |
| `package.json` / `package-lock.json` | Modificado | Adiciona `react-phone-number-input@^3.4.16` |

### Fix paralelo (commit `34fe5c7`)
| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/screens/PginaNetflix/PginaNetflix.tsx` | Fix | Imagem do logo na seção "Conheça o" apontava para arquivo inexistente; trocado por `ferreiraflix-2.svg` (mesmo usado no hero) |

---

## Dependências

- **Nova lib**: `react-phone-number-input@^3.4.16` — mesmo componente usado em ferreira-alfa-lista-espera e galltek-caslu-landing.
- **Endpoints externos** (sem env vars no repo):
  - Apps Script Ferreira (compartilhado com alfa-lista-espera e diagnostico): `https://script.google.com/macros/s/AKfycbzd.../exec`
  - DataCrazy CRM (business id específico do FerreiraFlix): `https://api.datacrazy.io/v1/crm/.../19fbbc11-ce0e-4d06-9996-6f202f06f51b`
- **GTM existente** (sem mudança no repo, configurado em painel):
  - Web container `GTM-PJGMM2NV`
  - Server Stape: `yag.ferreiratrader.com.br`

---

## Configuração externa necessária

1. **GTM web** — tag Meta Pixel `848090680352869` em `All Pages` (ou em rotas `/ferreiraflix*`); tag "Lead Event" com trigger `Custom Event = form_success` lendo `transaction_id` / `userData` do dataLayer.
2. **GTM server (Stape)** — replicar Lead com mesmo `event_id` para dedupe automática com pixel browser.
3. **Cloudflare Pages** — deploy automático via integração Git (sem env vars necessárias para a rota v2 funcionar).

---

## Testes e verificação

- [x] `npm run build` passa sem erros (580kB → 583kB)
- [x] `/ferreiraflix` (rota original) inalterada — regressão zero
- [x] `/ferreiraflix-v2` carrega o layout idêntico
- [x] Botões "Quero Aprender" / "Entrar no FerreiraFlix" continuam scrollando para `#checkout-section`
- [x] Botão "Liberar meu acesso agora" abre o modal
- [x] Form submit grava na planilha Apps Script (testado em produção — lead "Kelvin" recebido)
- [x] Bandeira BR + ocultação do `+55` no input de telefone
- [x] Estilo do input alinhado ao tema escuro
- [x] Validação de email com sugestão de typo
- [ ] Validar lead chegando no DataCrazy CRM (aguardando verificação no painel)
- [ ] Validar dedupe Lead browser ↔ CAPI no Meta Events Manager
- [ ] Validar pré-população real do Hotmart (`name` / `email` / `phonenumber`)

---

## Sequência de commits

| Hash | Mensagem |
|------|----------|
| `34fe5c7` | Corrige imagem quebrada do logo Ferreiraflix na seção "Conheça o" |
| `0a8c3a4` | Adiciona rota /ferreiraflix-v2 com captura de lead via modal popup |
| `7b8a065` | Corrige estilo do input de telefone no modal do FerreiraFlix v2 |
| `27e2fa1` | Oculta DDI do input de telefone no modal do FerreiraFlix v2 |
| `6a87092` | Aponta leadSubmit para Apps Script padrão Ferreira |
| `4878216` | Padroniza código da campanha como 2026-05-ferreiraflix-v2 |
| `e12b4ed` | Integra DataCrazy CRM ao submit do FerreiraFlix v2 |
| `88e9134` | Adiciona validação de email com sugestão de typo e onBlur no telefone |

---

## Notas

- O fluxo segue o padrão "página de vendas + captura" do `GUIA-TRACKING-PADRAO.md` da raiz Ferreira: lead vai para CRM principal (DataCrazy) + backup planilha (Apps Script) + tracking GTM via dataLayer.
- O hook `useEmailSuggestion` e o `react-phone-number-input` são reutilizáveis em qualquer página de vendas futura — não estão acoplados ao FerreiraFlix.
- Não foi adicionado pixel inline em `index.html` por decisão explícita do operador (centralização no GTM/Stape evita duplicação de PageView).
- Próxima sessão potencial: variante A/B no botão CTA (com modal vs sem modal), métricas de conversão Open → Submit → Checkout.
