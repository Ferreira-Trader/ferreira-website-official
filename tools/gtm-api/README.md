# Tooling GTM API v2

Pacote **isolado** (fora do bundle Vite do site) para ler e editar o container
web `GTM-PJGMM2NV` via [Tag Manager API v2](https://developers.google.com/tag-platform/tag-manager/api/v2).
Serve para versionar/automatizar mudanças no GTM em vez de clicar no painel.

> ⚠️ **Credenciais nunca são commitadas.** O `.gitignore` daqui bloqueia
> `service-account.json`, `.env` etc. Confirme antes de qualquer commit.

## Fase 1 — Criar o acesso à API (ações no navegador)

### 1. Projeto + API no Google Cloud
1. Abra <https://console.cloud.google.com/> e crie (ou escolha) um projeto.
2. Menu → **APIs e serviços → Biblioteca** → procure **Tag Manager API** → **Ativar**.

### 2. Service account + chave JSON
1. **APIs e serviços → Credenciais → Criar credenciais → Conta de serviço**.
2. Dê um nome (ex: `gtm-automation`) → **Concluir** (não precisa conceder papel no projeto).
3. Clique na conta criada → aba **Chaves → Adicionar chave → Criar nova chave → JSON**.
4. Baixe o arquivo e salve aqui como:
   ```
   tools/gtm-api/service-account.json
   ```
5. Copie o **email** da service account (algo como
   `gtm-automation@SEU-PROJETO.iam.gserviceaccount.com`).

### 3. Convidar a service account no GTM
1. Abra <https://tagmanager.google.com/> → container `GTM-PJGMM2NV`.
2. **Admin → Gerenciamento de usuários** (User Management) → **+** →
   **Adicionar usuários**.
3. Cole o email da service account.
4. Permissão da **conta**: Usuário. Permissão do **container**: **Editar** e
   **Publicar** (precisamos de publish para subir a mudança).
5. Convidar.

Pronto — sem isso a API responde "nenhuma conta visível".

## Fase 2 — Instalar e inspecionar

```bash
cd tools/gtm-api
npm install
npm run inspect
```

`inspect` imprime conta, container, workspace e a lista de **tags / triggers /
variáveis** com seus IDs. É o retrato que usamos para identificar o pixel padrão
e montar a condicional do FerreiraFlix.

## Fase 3 — Aplicar a condicional do FerreiraFlix

Objetivo: em qualquer rota que comece com `/ferreiraflix` (pega `/ferreiraflix`
e `/ferreiraflix-v2`), disparar um pixel alternativo **no lugar** do pixel padrão.

Será um script `apply-ferreiraflix-pixel.mjs` que:
1. cria um trigger Page View com filtro `Page Path` RegEx `^/ferreiraflix`;
2. cria a tag do novo pixel com esse trigger;
3. adiciona o trigger como **exception** (blocking) na tag do pixel padrão.

Nada é publicado automaticamente — a mudança fica no workspace para você revisar
no painel e publicar (ou a gente publica via API depois de conferir).

### Variáveis de ambiente (opcionais)
- `GTM_CREDENTIALS` — caminho do JSON (default `./service-account.json`)
- `GTM_PUBLIC_ID` — public id do container (default `GTM-PJGMM2NV`)
