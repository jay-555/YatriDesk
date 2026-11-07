import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import type { SessionUser } from '@yatrideesk/types';
import { Observable } from 'rxjs';
import { moduleForRequest } from '../common/saas-mode';
import { PrismaService } from '../prisma/prisma.service';
import { FeaturesService } from './features.service';

@Injectable()
export class ModuleGateInterceptor implements NestInterceptor {
  constructor(
    private readonly features: FeaturesService,
    private readonly prisma: PrismaService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest<Request & { user?: SessionUser }>();
    const raw = req.originalUrl || req.url || '';
    const mod = moduleForRequest(req.method, raw);
    if (!mod) return next.handle();

    const restaurantId = await this.restaurantId(req, raw);
    if (!restaurantId) return next.handle();
    await this.features.assertEnabled(restaurantId, mod.key);
    return next.handle();
  }

  private async restaurantId(req: Request & { user?: SessionUser }, raw: string): Promise<string | null> {
    if (req.user?.restaurantId) return req.user.restaurantId;
    if (req.integrationKey?.restaurantId) return req.integrationKey.restaurantId;

    const path = raw.split('?')[0].replace(/^\/api/, '');
    const menu = path.match(/^\/v1\/public\/menu\/([^/]+)\/order$/);
    if (menu && req.method === 'POST') {
      const table = await this.prisma.table.findUnique({
        where: { qrToken: menu[1] },
        select: { floor: { select: { branch: { select: { restaurantId: true } } } } },
      });
      return table?.floor.branch.restaurantId ?? null;
    }
    const kiosk = path.match(/^\/v1\/public\/kiosk\/([^/]+)/);
    if (kiosk) {
      const branch = await this.prisma.branch.findUnique({
        where: { kioskToken: kiosk[1] },
        select: { restaurantId: true },
      });
      return branch?.restaurantId ?? null;
    }
    return null;
  }
}
