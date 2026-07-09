// Cliente compartilhado da Tag Manager API v2.
// Autentica via service account (arquivo JSON) e resolve account/container alvo.
//
// Variáveis de ambiente (ou defaults):
//   GTM_CREDENTIALS  caminho do JSON da service account   (default: ./service-account.json)
//   GTM_PUBLIC_ID    public id do container                (default: GTM-PJGMM2NV)
//
// A service account precisa ter sido convidada no container (GTM > Admin >
// User Management) com permissão de Edit/Publish.

import { google } from 'googleapis';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CREDENTIALS_PATH = resolve(
  __dirname,
  process.env.GTM_CREDENTIALS || 'service-account.json',
);

// Public id do container web (o que aparece como GTM-XXXX). Usado para
// descobrir o accountId/containerId numéricos exigidos pela API.
export const PUBLIC_ID = process.env.GTM_PUBLIC_ID || 'GTM-PJGMM2NV';

const SCOPES = [
  'https://www.googleapis.com/auth/tagmanager.readonly',
  'https://www.googleapis.com/auth/tagmanager.edit.containers',
  'https://www.googleapis.com/auth/tagmanager.publish',
];

/** Retorna um client autenticado da Tag Manager API v2. */
export function getTagManager() {
  let keyFile;
  try {
    keyFile = JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf8'));
  } catch (err) {
    throw new Error(
      `Não consegui ler a credencial em ${CREDENTIALS_PATH}.\n` +
        `Coloque o JSON da service account lá ou defina GTM_CREDENTIALS. (${err.message})`,
    );
  }

  const auth = new google.auth.GoogleAuth({ credentials: keyFile, scopes: SCOPES });
  return google.tagmanager({ version: 'v2', auth });
}

/**
 * Descobre o container (e seu account) a partir do public id (GTM-XXXX),
 * varrendo as contas que a service account enxerga.
 * Retorna { account, container } com os recursos completos da API.
 */
export async function resolveContainer(tagmanager, publicId = PUBLIC_ID) {
  const { data: accountsData } = await tagmanager.accounts.list();
  const accounts = accountsData.account || [];
  if (!accounts.length) {
    throw new Error(
      'A service account não enxerga nenhuma conta GTM. ' +
        'Convide o email dela em GTM > Admin > User Management.',
    );
  }

  for (const account of accounts) {
    const { data } = await tagmanager.accounts.containers.list({
      parent: account.path,
    });
    const container = (data.container || []).find((c) => c.publicId === publicId);
    if (container) return { account, container };
  }

  throw new Error(
    `Container ${publicId} não encontrado nas contas visíveis para a service account.`,
  );
}

/**
 * Retorna o workspace de trabalho do container. Por padrão usa o "Default
 * Workspace"; passe um nome para escolher outro.
 */
export async function getWorkspace(tagmanager, container, name = 'Default Workspace') {
  const { data } = await tagmanager.accounts.containers.workspaces.list({
    parent: container.path,
  });
  const workspaces = data.workspace || [];
  const ws = workspaces.find((w) => w.name === name) || workspaces[0];
  if (!ws) throw new Error(`Nenhum workspace encontrado em ${container.publicId}.`);
  return ws;
}
