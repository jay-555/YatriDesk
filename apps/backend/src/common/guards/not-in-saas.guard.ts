import { CanActivate, ForbiddenException, Injectable } from '@nestjs/common';
import { isSaasMode } from '../saas-mode';

/** Blocks self-hosted maintenance routes on the hosted service. */
@Injectable()
export class NotInSaasGuard implements CanActivate {
  canActivate(): boolean {
    if (isSaasMode()) {
      throw new ForbiddenException('This action is not available on the hosted service');
    }
    return true;
  }
}
