import { Body, Controller, Delete, Get, Param, Put, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SessionUser } from '@yatrideesk/types';
import { z } from 'zod';
import { Auth } from '../../common/decorators/auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { BranchAccessService } from '../../common/services/branch-access.service';
import { PrismaService } from '../../prisma/prisma.service';

const hoursSchema = z.object({
  windows: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        openTime: z.string().regex(/^\d{2}:\d{2}$/),
        closeTime: z.string().regex(/^\d{2}:\d{2}$/),
      }),
    )
    .max(21),
});

const closureSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().trim().max(120).optional(),
});

@ApiTags('settings')
@Controller('v1/settings/hours')
export class HoursController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly branchAccess: BranchAccessService,
  ) {}

  @Auth('settings.manage')
  @Get()
  async get(@CurrentUser() user: SessionUser, @Query('branchId') branchId: string) {
    await this.branchAccess.assertAccess(user.restaurantId, branchId);
    const [hours, closures, branch] = await Promise.all([
      this.prisma.branchHours.findMany({ where: { branchId }, orderBy: [{ dayOfWeek: 'asc' }, { openTime: 'asc' }] }),
      this.prisma.branchClosure.findMany({
        where: { branchId },
        orderBy: { date: 'asc' },
        take: 60,
      }),
      this.prisma.branch.findUnique({ where: { id: branchId }, select: { temporarilyClosed: true } }),
    ]);
    return { hours, closures, temporarilyClosed: branch?.temporarilyClosed ?? false };
  }

  @Auth('settings.manage')
  @Put()
  @UsePipes(new ZodValidationPipe(hoursSchema))
  async replace(
    @CurrentUser() user: SessionUser,
    @Query('branchId') branchId: string,
    @Body() body: z.infer<typeof hoursSchema>,
  ) {
    await this.branchAccess.assertAccess(user.restaurantId, branchId);
    await this.prisma.$transaction([
      this.prisma.branchHours.deleteMany({ where: { branchId } }),
      this.prisma.branchHours.createMany({
        data: body.windows.map((w) => ({ branchId, ...w })),
      }),
    ]);
    return { ok: true };
  }

  @Auth('settings.manage')
  @Put('closures')
  @UsePipes(new ZodValidationPipe(closureSchema))
  async addClosure(
    @CurrentUser() user: SessionUser,
    @Query('branchId') branchId: string,
    @Body() body: z.infer<typeof closureSchema>,
  ) {
    await this.branchAccess.assertAccess(user.restaurantId, branchId);
    return this.prisma.branchClosure.upsert({
      where: { branchId_date: { branchId, date: new Date(`${body.date}T00:00:00.000Z`) } },
      create: {
        branchId,
        date: new Date(`${body.date}T00:00:00.000Z`),
        reason: body.reason,
      },
      update: { reason: body.reason },
    });
  }

  @Auth('settings.manage')
  @Delete('closures/:id')
  async removeClosure(
    @CurrentUser() user: SessionUser,
    @Query('branchId') branchId: string,
    @Param('id') id: string,
  ) {
    await this.branchAccess.assertAccess(user.restaurantId, branchId);
    await this.prisma.branchClosure.deleteMany({ where: { id, branchId } });
    return { ok: true };
  }
}
