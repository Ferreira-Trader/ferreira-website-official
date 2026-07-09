// Lê (read-only) a estrutura do container GTM e imprime um inventário:
// conta, container, workspace, tags, triggers e variáveis.
// Use para "enxergar" o container antes de aplicar qualquer mudança.
//
//   npm run inspect

import { getTagManager, resolveContainer, getWorkspace, PUBLIC_ID } from './gtm.mjs';

async function main() {
  const tagmanager = getTagManager();

  const { account, container } = await resolveContainer(tagmanager, PUBLIC_ID);
  console.log(`\n# Conta:     ${account.name} (${account.accountId})`);
  console.log(`# Container: ${container.name} — ${container.publicId} (${container.containerId})`);

  const ws = await getWorkspace(tagmanager, container);
  console.log(`# Workspace: ${ws.name} (${ws.workspaceId})\n`);

  const parent = ws.path;
  const [tags, triggers, variables] = await Promise.all([
    tagmanager.accounts.containers.workspaces.tags.list({ parent }),
    tagmanager.accounts.containers.workspaces.triggers.list({ parent }),
    tagmanager.accounts.containers.workspaces.variables.list({ parent }),
  ]);

  console.log('## TAGS');
  for (const t of tags.data.tag || []) {
    const firing = (t.firingTriggerId || []).join(', ') || '—';
    const blocking = (t.blockingTriggerId || []).join(', ');
    const block = blocking ? `  | exceptions: ${blocking}` : '';
    console.log(`  [${t.tagId}] ${t.name}  (${t.type})  fire: ${firing}${block}`);
  }

  console.log('\n## TRIGGERS');
  for (const tr of triggers.data.trigger || []) {
    console.log(`  [${tr.triggerId}] ${tr.name}  (${tr.type})`);
  }

  console.log('\n## VARIABLES');
  for (const v of variables.data.variable || []) {
    console.log(`  [${v.variableId}] ${v.name}  (${v.type})`);
  }
  console.log('');
}

main().catch((err) => {
  console.error('\n[erro]', err.message, '\n');
  process.exit(1);
});
