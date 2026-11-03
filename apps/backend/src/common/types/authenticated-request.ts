import type { SessionUser } from '@yatrideesk/types';
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: SessionUser;
}
