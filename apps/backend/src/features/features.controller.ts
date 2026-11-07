import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SessionUser } from '@yatrideesk/types';
import { z } from 'zod';
import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { UsePipes } from '@nestjs/common';
import { isSaasMode, SAAS_FEATURE_KEYS } from '../common/saas-mode';
import { PrismaService } from '../prisma/prisma.service';

const updateSchema = z.object({
  key: z.enum(SAAS_FEATURE_KEYS),
  enabled: z.boolean(),
});

@ApiTags('features')
@Controller('v1/features')
export class FeaturesController {
  constructor(private readonly prisma: PrismaService) {}

  @Auth()
  @Get()
  async list(@CurrentUser() user: SessionUser) {
    if (!isSaasMode()) {
      return {
        saasMode: false,
        flags: Object.fromEntries(SAAS_FEATURE_KEYS.map((key) => [key, true])),
      };
    }
    const rows = await this.prisma.featureFlag.findMany({
      where: { restaurantId: user.restaurantId },
    });
    const enabled = new Map(rows.map((r) => [r.key, r.enabled]));
    return {
      saasMode: true,
      flags: Object.fromEntries(SAAS_FEATURE_KEYS.map((key) => [key, enabled.get(key) ?? false])),
    };
  }

  @Auth('settings.manage')
  @Put()
  @UsePipes(new ZodValidationPipe(updateSchema))
  async set(@CurrentUser() user: SessionUser, @Body() body: z.infer<typeof updateSchema>) {
    await this.prisma.featureFlag.upsert({
      where: { restaurantId_key: { restaurantId: user.restaurantId, key: body.key } },
      create: { restaurantId: user.restaurantId, key: body.key, enabled: body.enabled },
      update: { enabled: body.enabled },
    });
    return { key: body.key, enabled: body.enabled };
  }
}
