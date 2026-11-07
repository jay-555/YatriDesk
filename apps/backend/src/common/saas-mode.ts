import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Nest reads `.env` only after the module graph is built. Load it first so
// SAAS_MODE can decide which modules are mounted.
function loadLocalEnv() {
  for (const rel of ['.env', '../../.env']) {
    const path = resolve(process.cwd(), rel);
    if (!existsSync(path)) continue;
    for (const raw of readFileSync(path, 'utf8').split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq < 1) continue;
      const key = line.slice(0, eq).trim();
      if (!/^[A-Z0-9_]+$/.test(key) || process.env[key] !== undefined) continue;
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}
loadLocalEnv();

/** Hosted multi-tenant mode. Unset keeps the self-hosted product unchanged. */
export function isSaasMode(): boolean {
  return process.env.SAAS_MODE === 'true';
}

/** Powers that belong to the machine operator, never to a restaurant owner. */
export const INSTANCE_PERMISSIONS = [
  'backup.manage',
  'system.update',
] as const;

export function withoutInstancePermissions<T extends string>(keys: readonly T[]): T[] {
  if (!isSaasMode()) return [...keys];
  const blocked = new Set<string>(INSTANCE_PERMISSIONS);
  return keys.filter((key) => !blocked.has(key));
}

/** Modules a hosted restaurant does not see until a flag turns them on. */
export const SAAS_FEATURE_KEYS = [
  'inventory',
  'procurement',
  'payroll',
  'referrals',
  'kiosk',
  'equipment',
  'bank',
] as const;

export type SaasFeatureKey = (typeof SAAS_FEATURE_KEYS)[number];
