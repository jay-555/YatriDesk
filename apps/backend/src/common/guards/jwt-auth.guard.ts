import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { SessionUser } from '@yatrideesk/types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const ok = (await super.canActivate(context)) as boolean;
    const req = context.switchToHttp().getRequest<{ path?: string; url?: string; user?: SessionUser }>();
    const user = req.user;
    if (!user?.mustChangePassword) return ok;
    const path = req.path ?? req.url ?? '';
    const allowed =
      path.includes('/auth/change-password') ||
      path.includes('/auth/me') ||
      path.includes('/auth/logout');
    if (!allowed) {
      throw new ForbiddenException('Change the one-time password before continuing');
    }
    return ok;
  }
}
