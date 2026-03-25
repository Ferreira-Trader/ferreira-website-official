# Plano: Aplicar Guia de Tracking GTM em Todas as Páginas

## Contexto

O site Ferreira Trader (React + Vite + TypeScript) tem 2 páginas de vendas (`/neuron` e `/ferreiraflix`) com **zero tracking implementado**. O `GUIA-TRACKING-PADRAO.md` define o padrão completo de rastreamento GTM server-side. Ambas as páginas são do tipo **"Página de Vendas"** (sem formulário) — precisam apenas de GTM + propagação de UTMs para links de checkout.

---

## Arquivos a Criar (3)

### 1. `src/hooks/useUTMTracking.ts`
- Copiar integralmente do guia (linhas 104-323)
- **Customização**: adicionar `EXCLUDED_DOMAINS` (`api.whatsapp.com`, `wa.me`, `ferreiratrader.link`) no `updateAllLinks` para não poluir links WhatsApp/suporte com UTMs inúteis

### 2. `src/hooks/useCampaignId.ts`
- Hook simples que faz `dataLayer.push({ page_campaign_id })` no mount
- Necessário porque é SPA com index.html único — cada página precisa enviar seu campaign_id

### 3. `src/types/global.d.ts`
- Tipagem TypeScript para `window.dataLayer`

---

## Arquivos a Modificar (3)

### 4. `index.html`
Adicionar antes do `</head>`:
- `window.dataLayer` init com campaign_id genérico (`ferreira-trader-spa`)
- Script GTM server-side (`yag.ferreiratrader.com.br`, container `GTM-PJGMM2NV`)

Adicionar no início do `<body>`:
- `<noscript>` fallback do GTM

### 5. `src/screens/Desktop.tsx` (Neuron)
- Import `useUTMTracking` e `useCampaignId`
- Chamar `useCampaignId('2025-03-neuron-vendas')`
- Chamar `const { getUrlWithUTMs } = useUTMTracking()`
- **Linha 1422**: `window.open(plan.url, '_blank')` → `window.open(getUrlWithUTMs(plan.url), '_blank')`
- **Linha 1429**: idem (2 ocorrências)

### 6. `src/pages/FerreiraFlixPage.tsx`
- Import `useUTMTracking` e `useCampaignId`
- Chamar `useCampaignId('2025-03-ferreiraflix-vendas')`
- Chamar `useUTMTracking()` (ativa MutationObserver)
- **Sem alteração nos componentes filhos** — o link Hotmart (`<a href>`) em `PginaNetflix.tsx:888` é atualizado automaticamente pelo MutationObserver

---

## Decisões Técnicas

| Decisão | Justificativa |
|---------|--------------|
| campaign_id genérico no index.html + push dinâmico por página | SPA com React Router, index.html único |
| `getUrlWithUTMs()` + `window.open()` no Neuron | Preserva comportamento de abrir em nova aba |
| MutationObserver cuida do link Hotmart automaticamente | É um `<a href>` — o hook injeta UTMs sem alterar código |
| SCK existente no Hotmart preservado | O hook não sobrescreve params já presentes (`!searchParams.has(key)`) |
| WhatsApp/suporte excluídos do UTM injection | Esses domínios ignoram UTMs, evita poluição de URL |
| `NeuronPage.tsx` não precisa de alteração | É wrapper fino — hooks vão no `Desktop.tsx` que é o componente real |

---

## Ordem de Execução

1. `src/types/global.d.ts` — tipagem
2. `src/hooks/useUTMTracking.ts` — hook core
3. `src/hooks/useCampaignId.ts` — hook auxiliar
4. `index.html` — GTM + dataLayer
5. `src/screens/Desktop.tsx` — integrar Neuron
6. `src/pages/FerreiraFlixPage.tsx` — integrar FerreiraFlix

---

## Verificação

1. `npm run dev` — confirmar que compila sem erros
2. Abrir `/neuron?utm_source=teste&utm_medium=cpc` no browser
3. Console: `window.dataLayer` deve conter `page_campaign_id: '2025-03-neuron-vendas'`
4. Clicar botão "Assinar" — URL aberta deve conter `?utm_source=teste&utm_medium=cpc&sck=...`
5. Abrir `/ferreiraflix?utm_source=teste` — inspecionar o link Hotmart no DOM, deve ter UTMs
6. Confirmar que links WhatsApp **NÃO** receberam UTMs
