# Prompt de Retomada de Sessão

**Problema**: ao iniciar uma nova sessão do Claude Code, o `CLAUDE.md` raiz é carregado automaticamente — mas o **estado dinâmico** (último commit, SESSION_LOG, deploys recentes no Cloudflare Pages, leads chegando) **não é**. Resultado: os primeiros minutos são gastos com o Claude se orientando em vez de trabalhar.

**Solução**: copiar e colar o prompt abaixo no início de cada nova sessão. Ele força o Claude a ler o estado antes de propor qualquer coisa.

---

## Prompt universal (copiar e colar)

```
Retomando trabalho no site oficial do Ferreira Trader.
Repo: /home/kelvinbrit0/aiprojects/clients/ferreira-trader/ferreira-website-official

**Não proponha nada ainda.** Primeiro execute esta rotina de contextualização:

0. **Branch obrigatória**: este projeto trabalha direto em `main` (Cloudflare Pages faz auto-deploy a cada push). Antes de qualquer leitura:
   - `git branch --show-current` — se já for `main`, siga pro passo 1.
   - Caso contrário: `git status` e me pergunte o que fazer com o working tree.
   - Se tiver alteração não-commitada em `main`, **PARE e me pergunte** — não rode `stash`, `restore` ou `checkout -f` por conta própria.

1. Leia as 2 últimas entradas de docs/SESSION_LOG.md (mais recente no topo).
2. Leia docs/SESSION_LOGS/ — pegue o session_*.md mais recente para entender o último contexto detalhado.
3. Rode em paralelo:
   - `git log --oneline -10`
   - `git status`
   - `git fetch origin && git log main..origin/main --oneline`  # vê se origin tem commits que local não tem
4. Confira CLAUDE.md raiz se vai mexer em algo de tracking/captura/Hotmart — as convenções estão lá.
5. Se a sessão for sobre página nova ou variante, abrir antes:
   - GUIA-TRACKING-PADRAO.md (padrão Ferreira: vendas direta vs captura)
   - src/lib/leadSubmit.ts + src/lib/dataCrazy.ts (padrão de submit de lead)
   - src/hooks/useUTMTracking.ts (UTM + sck)

Depois, me responda em português (pt-BR) com esta estrutura:

**Onde paramos**: 1 parágrafo resumindo o "Próximo passo sugerido" da última entrada do SESSION_LOG.

**Estado do código**:
- Branch atual + sincronização com origin
- Working tree limpo ou com alterações pendentes
- Último commit (sha + mensagem)
- Commits novos em origin/main que local não tem (se houver)

**Rotas afetadas / em foco**: bullets de quais rotas (/neuron, /ferreiraflix, /ferreiraflix-v2, ...) entram em escopo do que vou pedir.

**Integrações relevantes**: bullets das integrações externas que podem ser tocadas (Hotmart, GTM web/server, Apps Script, DataCrazy CRM) — só as que importam pra próxima ação.

**Anomalia detectada** (se houver): qualquer coisa que destoe do esperado (arquivo modificado sem commit, deploy travado no Cloudflare Pages, link Hotmart quebrado, etc.).

**Próximo passo sugerido**: uma frase prescritiva. NÃO execute. Espere minha confirmação.

**Sessão sugerida (copia-e-cola)**: na última linha, sugira em formato `AAAA-MM-DD — <título curto descritivo>` (data de hoje + título refletindo o "Próximo passo sugerido" — 4-8 palavras). Esse string serve como header da próxima entrada do SESSION_LOG e título de session_log auditável.

Só depois que eu confirmar é que você começa a trabalhar.
```

---

## Variações (casos menos comuns)

### Só auditar, não mexer em nada

Acrescente no final do prompt:

```
Modo read-only: apenas me reporte o estado. Não faça edits, não rode build,
não dê push. Objetivo é só eu entender onde está o projeto.
```

### Retomar feature interrompida no meio

Acrescente:

```
A última sessão ficou INCOMPLETA na feature <nome>. Antes de propor próximo
passo, leia a entrada correspondente no SESSION_LOG e me mostre exatamente
em qual arquivo:linha o trabalho parou e qual seria o próximo comando a
executar.
```

### Trabalhar em página nova (clone de uma existente)

Acrescente:

```
Vou criar uma nova rota /<slug>. Antes de propor estrutura, leia:
- src/pages/FerreiraFlixV2Page.tsx (modelo mais completo: Lenis + Campaign + UTMs + LeadCaptureProvider)
- src/screens/PginaNetflix/PginaNetflix.tsx (componente principal com prop variant)
- CLAUDE.md §"Convenções" e §"Padrão de captura de lead"

E me explique se a página nova é "vendas direta" (estilo /ferreiraflix) ou
"vendas + captura" (estilo /ferreiraflix-v2), porque o esqueleto é diferente.
```

### Investigar lead que não chegou

Acrescente:

```
Recebi reclamação de que um lead não chegou. Antes de propor causa:
1. Confira src/lib/leadSubmit.ts (Apps Script) e src/lib/dataCrazy.ts (CRM) — URLs hardcoded.
2. Confira src/lib/analytics.ts para ver quais eventos dataLayer disparam.
3. Veja se o submit usa Promise.allSettled (falha de um não bloqueia o outro).
4. Veja qual `campaign` está sendo enviado e se ele bate com o registrado no Apps Script / DataCrazy.

Me reporte o que checou antes de chutar diagnóstico.
```

### Trocar URL de checkout Hotmart

Acrescente:

```
Vou trocar a URL do Hotmart de <produto>. Antes de fazer:
1. Liste TODAS as ocorrências da URL atual (use grep) — pode aparecer em
   src/lib/hotmartCheckout.ts, src/screens/PginaNetflix/PginaNetflix.tsx, src/screens/Desktop.tsx.
2. Confirme que o `sck` antigo (se houver) também deve sair.
3. Me apresente a lista antes de editar.
```
