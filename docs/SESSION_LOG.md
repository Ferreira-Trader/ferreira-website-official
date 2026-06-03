# SESSION_LOG

Diário de obra do **site oficial do Ferreira Trader** (`ferreira-website-official`).
Toda sessão Claude Code adiciona entrada nova **no topo** (mais recente primeiro) antes de encerrar.
Toda sessão **começa** lendo as duas primeiras entradas daqui + `git log --oneline -10`.

Audit detalhado por sessão fica em [SESSION_LOGS/](SESSION_LOGS/) (formato wave estilo galltek). Este arquivo é o índice cronológico/operacional.

## Formato padrão de entrada

```
## YYYY-MM-DD — <título curto da sessão>

**Objetivo**: uma frase.
**Branch**: branch onde trabalhou (geralmente main).
**Commits**: `sha curto` mensagem (um por linha).
**Tijolos fechados**: bullets do que foi entregue e mergeado.
**Tijolos em andamento / incompletos**: bullets + arquivo:linha onde parou (se aplicável).
**Decisões**: bullets de decisões — se não-óbvio, registrar em comentário no código.
**Pendências pra próxima sessão**: bullets.
**Próximo passo sugerido**: uma frase prescritiva.
```

Se a sessão for **interrompida no meio**, marcar no título `— INCOMPLETA` e explicitar em "Tijolos em andamento" o arquivo:linha exato onde o trabalho parou.

---

## 2026-05-23 — Documentação operacional + template + agents customizados Claude

**Objetivo**: estabelecer estrutura padronizada de documentação Claude para este repo e criar template reutilizável em `~/aiprojects/templates/claude-repo-template/` com agents customizados instaláveis globalmente.

**Branch**: `main`

**Commits**:
- `b940912` Adiciona CLAUDE.md com guia operacional do projeto
- `39b30b3` Adiciona SESSION_LOG cronológico e PROMPT_RETOMADA estilo galltek
- `f731501` Adiciona .claude/settings.json e completa estrutura via init.sh do template

**Tijolos fechados**:
- `CLAUDE.md` raiz com stack, comandos, rotas, big-picture, padrões de tracking/captura, convenções, integrações externas e ritual de início.
- `docs/SESSION_LOG.md` (diário cronológico estilo galltek).
- `docs/PROMPT_RETOMADA.md` com prompt universal + 5 variações (auditoria read-only, feature interrompida, página nova, lead que não chegou, troca de URL Hotmart).
- `docs/SESSION_LOGS/.gitkeep` para o diretório existir mesmo vazio.
- `.claude/settings.json` com 3 níveis (allow/deny/ask) gerado via `init.sh` do template.
- `.gitignore` atualizado para ignorar `.claude/settings.local.json` e `.mcp.json`.
- Template reutilizável criado em `~/aiprojects/templates/claude-repo-template/`: 3 .tpl (CLAUDE/SESSION_LOG/PROMPT_RETOMADA), `.claude/settings.json.tpl`, `.gitignore.tpl`, 3 agents reutilizáveis (session-resumer, session-logger, commit-writer), 3 agents específicos Ferreira (tracking-auditor, lead-debugger, page-cloner), `init.sh`, `install-agents.sh` e `README.md`.
- `~/.claude/settings.json` global refatorado: allow genérico seguro (git read-only, gh read, ls/cat/grep/rg, npm build/test/lint, docker compose up, MCPs aprovados), deny agressivo (rm -rf, sudo, git push --force, git reset --hard, --no-verify, npm publish, supabase db reset, leitura de .env/.credentials), ask para operações destrutivas/deploy (git push/commit, gh pr create/merge, wrangler deploy, vercel deploy).
- Backup do settings antigo salvo em `~/.claude/settings.json.backup-20260603-181528`.
- 6 agents instalados em `~/.claude/agents/` via `install-agents.sh --global --ferreira`.

**Tijolos em andamento / incompletos**: nenhum.

**Decisões**:
- **Padrão galltek de documentação operacional** adotado (CLAUDE.md + SESSION_LOG.md + SESSION_LOGS/ + PROMPT_RETOMADA.md) por ser auditável, versionado e reusável entre máquinas/devs.
- **Template em diretório separado** (`~/aiprojects/templates/claude-repo-template/`) em vez de dentro do repo Ferreira — permite reuso nos demais repos do user (galltek, alfa-lista-espera, diagnostico).
- **Agents Ferreira ficam globais** (`~/.claude/agents/`) e não no repo — servem para todos os sites Ferreira, não só ferreira-website-official.
- **Settings em 3 níveis (allow/deny/ask)** preferível ao "tudo allow" anterior — define autonomia com ressalvas de forma explícita; deny vence ask vence allow.
- **MCPs globais autorizados em massa** (sequential-thinking, brave-search, context7, memory, semgrep, github, ClickUp, Notion, Gmail, Google Drive, Calendar, Figma, SupaBase-CJ, playwright, Meta Ads).

**Pendências pra próxima sessão**:
- Validar em uso real os agents customizados (session-resumer no início, session-logger no fim, commit-writer antes de cada commit).
- Replicar `init.sh` nos outros repos Ferreira (alfa-lista-espera, diagnostico) para herdar a estrutura.
- Considerar versionar `~/aiprojects/templates/claude-repo-template/` num repo privado para sincronizar entre máquinas.

**Próximo passo sugerido**: na próxima sessão neste repo, abrir com "retoma a sessão" e validar que o `session-resumer` é convocado automaticamente.

---

## 2026-05-23 — FerreiraFlix v2: rota com captura de lead via modal popup

**Objetivo**: criar `/ferreiraflix-v2` como variação da `/ferreiraflix` em que o botão "Liberar meu acesso agora" abre modal coletando nome/email/telefone com DDI; submit grava lead no Apps Script + DataCrazy CRM e redireciona ao Hotmart pré-populado preservando UTMs.

**Branch**: `main`

**Commits** (8, em sequência):
- `34fe5c7` Corrige imagem quebrada do logo Ferreiraflix na seção "Conheça o"
- `0a8c3a4` Adiciona rota /ferreiraflix-v2 com captura de lead via modal popup
- `7b8a065` Corrige estilo do input de telefone no modal do FerreiraFlix v2
- `27e2fa1` Oculta DDI do input de telefone no modal do FerreiraFlix v2
- `6a87092` Aponta leadSubmit para Apps Script padrão Ferreira
- `4878216` Padroniza código da campanha como 2026-05-ferreiraflix-v2
- `e12b4ed` Integra DataCrazy CRM ao submit do FerreiraFlix v2
- `88e9134` Adiciona validação de email com sugestão de typo e onBlur no telefone
- `02e7b89` Adiciona session log da implementação do FerreiraFlix v2
- `b940912` Adiciona CLAUDE.md com guia operacional do projeto

**Tijolos fechados**:
- Rota `/ferreiraflix-v2` no ar, layout idêntico à v1.
- Modal popup (Provider + Context + hook `useLeadCapture`) com nome/email/telefone validados.
- Submit paralelo Apps Script + DataCrazy via `Promise.allSettled`.
- Pre-população Hotmart (`name/email/phonenumber`) + UTMs/sck preservadas.
- Eventos dataLayer `form_start`/`form_success`/`form_error`/`form_abandoned` (consumidos por GTM/Stape para Lead + CAPI dedupe via `transaction_id`).
- Refatoração de `useUTMTracking.ts` expondo `getCapturedUTMs()` e `getUrlWithUTMs()` como funções puras.
- DDI oculto no input (`+55` invisível mas preservado no value) — evita usuário leigo apagar.
- Hook `useEmailSuggestion` portado do alfa-lista-espera (correção de typo via Levenshtein).
- Docs: `CLAUDE.md` raiz + `docs/SESSION_LOGS/session_01_*.md` + este `SESSION_LOG.md`.

**Tijolos em andamento / incompletos**: nenhum.

**Decisões**:
- **Sem pixel inline** no `index.html` — GTM web + Stape cuidam de PageView/Lead. Evita duplicação.
- **URL Apps Script reaproveitada** do alfa-lista-espera / diagnostico (`AKfycbzd...`); roteamento por `campaign` no servidor.
- **DataCrazy business id por produto**: FerreiraFlix usa `19fbbc11-ce0e-4d06-9996-6f202f06f51b` (diferente do alfa).
- **Campaign ID `2026-05-ferreiraflix-v2`** (sem `-vendas`) — código confirmado pelo dropdown do GTM. Padrão geral é `YYYY-MM-produto-tipo`, mas quando há `-v2` no nome o `-tipo` é omitido.
- **Variant prop em vez de duplicar página**: PginaNetflix aceita `variant: 'default' | 'v2-lead-form'` — só o botão final muda. Resto reaproveita.

**Pendências pra próxima sessão**:
- Validar Lead chegando no DataCrazy CRM (verificar painel).
- Validar dedupe Lead browser ↔ CAPI no Meta Events Manager (mesmo `transaction_id`).
- Validar pré-população real do Hotmart (`?name=...&email=...&phonenumber=...`).
- Confirmar que GTM web tem tag "Custom Event = form_success" disparando Lead com `eventID` do dataLayer.

**Próximo passo sugerido**: validar funil em produção (Open modal → form_start → form_success → checkout) com dados reais, ajustar se houver gap.

---

## (entradas anteriores)

Histórico pré-CLAUDE.md (commits até `c2340dd`) fica em `git log` apenas. Sessões anteriores não foram registradas porque este arquivo só foi criado em 2026-05-23.
