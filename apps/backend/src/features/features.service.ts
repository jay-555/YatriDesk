import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  effectiveModuleEnabled,
  isSaasMode,
  MODULES,
  SAAS_FEATURE_KEYS,
  type SaasFeatureKey,
} from '../common/saas-mode';

@Injectable()
export class FeaturesService {
  constructor(private readonly prisma: PrismaService) {}

  async effectiveFlags(restaurantId: string): Promise<Record<SaasFeatureKey, boolean>> {
    const [globals, rows] = await Promise.all([
      this.prisma.moduleSwitch.findMany(),
      this.prisma.featureFlag.findMany({ where: { restaurantId } }),
    ]);
    const global = new Map(globals.map((row) => [row.key, row.enabled]));
    const local = new Map(rows.map((row) => [row.key, row.enabled]));
    const saas = isSaasMode();
    return Object.fromEntries(
      SAAS_FEATURE_KEYS.map((key) => [
        key,
        effectiveModuleEnabled(global.get(key), local.has(key) ? local.get(key) : undefined, saas),
      ]),
    ) as Record<SaasFeatureKey, boolean>;
  }

  async assertEnabled(restaurantId: string, key: SaasFeatureKey): Promise<void> {
    const flags = await this.effectiveFlags(restaurantId);
    if (!flags[key]) {
      throw new ForbiddenException('This module is turned off');
    }
  }

  async globalSwitches() {
    const rows = await this.prisma.moduleSwitch.findMany();
    const enabled = new Map(rows.map((row) => [row.key, row.enabled]));
    return MODULES.map((mod) => ({
      key: mod.key,
      label: mod.label,
      enabled: enabled.get(mod.key) ?? true,
    }));
  }

  async setGlobal(key: SaasFeatureKey, enabled: boolean) {
    await this.prisma.moduleSwitch.upsert({
      where: { key },
      create: { key, enabled },
      update: { enabled },
    });
    return { key, enabled };
  }

  async restaurantSwitches(restaurantId: string) {
    const [globals, rows] = await Promise.all([
      this.prisma.moduleSwitch.findMany(),
      this.prisma.featureFlag.findMany({ where: { restaurantId } }),
    ]);
    const global = new Map(globals.map((row) => [row.key, row.enabled]));
    const local = new Map(rows.map((row) => [row.key, row.enabled]));
    const saas = isSaasMode();
    return MODULES.map((mod) => {
      const globalEnabled = global.get(mod.key) ?? true;
      const stored = local.has(mod.key) ? local.get(mod.key)! : undefined;
      return {
        key: mod.key,
        label: mod.label,
        globalEnabled,
        enabled: effectiveModuleEnabled(globalEnabled, stored, saas),
      };
    });
  }

  async setRestaurant(restaurantId: string, key: SaasFeatureKey, enabled: boolean) {
    const global = await this.prisma.moduleSwitch.findUnique({ where: { key } });
    if (global?.enabled === false) {
      throw new ForbiddenException('This module is off for every restaurant');
    }
    await this.prisma.featureFlag.upsert({
      where: { restaurantId_key: { restaurantId, key } },
      create: { restaurantId, key, enabled },
      update: { enabled },
    });
    return { key, enabled };
  }
}
