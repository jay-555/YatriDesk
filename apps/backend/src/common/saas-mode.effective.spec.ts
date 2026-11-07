import { effectiveModuleEnabled } from './saas-mode';

describe('effectiveModuleEnabled', () => {
  it('lets a global off win over a restaurant that is on', () => {
    expect(effectiveModuleEnabled(false, true, true)).toBe(false);
    expect(effectiveModuleEnabled(false, true, false)).toBe(false);
  });

  it('keeps a missing restaurant row off in SaaS mode and on otherwise', () => {
    expect(effectiveModuleEnabled(true, undefined, true)).toBe(false);
    expect(effectiveModuleEnabled(undefined, undefined, false)).toBe(true);
  });

  it('lets a restaurant turn a globally on module off', () => {
    expect(effectiveModuleEnabled(true, false, false)).toBe(false);
    expect(effectiveModuleEnabled(true, true, true)).toBe(true);
  });
});
