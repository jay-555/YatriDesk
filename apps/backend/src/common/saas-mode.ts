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
  'onlineOrdering',
] as const;

export type SaasFeatureKey = (typeof SAAS_FEATURE_KEYS)[number];

export interface ModuleDefinition {
  key: SaasFeatureKey;
  label: string;
  /** Dashboard paths this module owns. Longer paths win over shorter ones. */
  navHrefs: readonly string[];
  matches: (method: string, path: string) => boolean;
}

const PROCUREMENT_PREFIXES = [
  '/v1/inventory/suppliers',
  '/v1/inventory/purchase-orders',
  '/v1/inventory/goods-receipts',
  '/v1/inventory/purchase-requests',
  '/v1/inventory/quotations',
  '/v1/inventory/supplier-invoices',
];

/** Nest path without the `/api` prefix or query string. */
export function moduleRequestPath(raw: string): string {
  const path = raw.split('?')[0];
  return path.startsWith('/api/') ? path.slice(4) : path;
}

function starts(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

function isProcurement(path: string): boolean {
  return PROCUREMENT_PREFIXES.some((prefix) => starts(path, prefix));
}

/**
 * Global off wins. A missing global row is on. In SaaS mode a missing
 * restaurant row is off (phased launch). Outside SaaS mode a missing
 * restaurant row is on, so a self-hosted install keeps every module until
 * the platform admin turns one off.
 */
export function effectiveModuleEnabled(
  globalEnabled: boolean | undefined,
  restaurantEnabled: boolean | undefined,
  saasMode: boolean,
): boolean {
  if (globalEnabled === false) return false;
  if (restaurantEnabled === undefined) return !saasMode;
  return restaurantEnabled;
}

export const MODULES: readonly ModuleDefinition[] = [
  {
    key: 'inventory',
    label: 'Inventory',
    navHrefs: ['/inventory'],
    matches: (_method, raw) => {
      const path = moduleRequestPath(raw);
      return starts(path, '/v1/inventory') && !isProcurement(path);
    },
  },
  {
    key: 'procurement',
    label: 'Procurement',
    navHrefs: ['/inventory/procurement', '/inventory/purchase-orders', '/inventory/suppliers'],
    matches: (_method, raw) => isProcurement(moduleRequestPath(raw)),
  },
  {
    key: 'payroll',
    label: 'Payroll',
    navHrefs: [],
    matches: (_method, raw) => starts(moduleRequestPath(raw), '/v1/hr/payroll'),
  },
  {
    key: 'referrals',
    label: 'Referrals',
    navHrefs: [],
    matches: (method, raw) => {
      const path = moduleRequestPath(raw);
      if (/^\/v1\/customers\/[^/]+\/rewards$/.test(path)) return true;
      return method === 'POST' && /^\/v1\/integrations\/locations\/[^/]+\/rewards$/.test(path);
    },
  },
  {
    key: 'kiosk',
    label: 'Kiosk',
    navHrefs: [],
    matches: (_method, raw) => {
      const path = moduleRequestPath(raw);
      return starts(path, '/v1/public/kiosk') || starts(path, '/v1/settings/kiosk');
    },
  },
  {
    key: 'equipment',
    label: 'Operations',
    navHrefs: ['/operations'],
    matches: (_method, raw) => starts(moduleRequestPath(raw), '/v1/operations'),
  },
  {
    key: 'bank',
    label: 'Bank reconciliation',
    navHrefs: [],
    matches: (_method, raw) => starts(moduleRequestPath(raw), '/v1/accounting/bank'),
  },
  {
    key: 'onlineOrdering',
    label: 'Online ordering',
    navHrefs: [],
    matches: (method, raw) => {
      if (method !== 'POST') return false;
      const path = moduleRequestPath(raw);
      return (
        /^\/v1\/public\/menu\/[^/]+\/order$/.test(path) ||
        /^\/v1\/integrations\/locations\/[^/]+\/orders$/.test(path)
      );
    },
  },
];

export function moduleForRequest(method: string, rawPath: string): ModuleDefinition | undefined {
  return MODULES.find((mod) => mod.matches(method.toUpperCase(), rawPath));
}
