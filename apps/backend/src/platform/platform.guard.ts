import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PlatformAuthGuard extends AuthGuard('platform-jwt') {
  handleRequest<T>(err: Error | null, user: T, _info: unknown, context: ExecutionContext): T {
    if (err || !user) throw err ?? new ForbiddenException('Platform sign-in required');
    const req = context.switchToHttp().getRequest<{ path?: string; url?: string }>();
    const path = req.path ?? req.url ?? '';
    const enrollOnly = (user as { enroll?: boolean }).enroll === true;
    const totpPath = path.includes('/platform/totp');
    if (enrollOnly && !totpPath) {
      throw new ForbiddenException('Set up an authenticator before using the console');
    }
    return user;
  }
}
