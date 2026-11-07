import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';

/** One JSON line per request, including the tenant when the caller is signed in. */
@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('http');

  intercept(context: ExecutionContext, next: CallHandler) {
    if (context.getType() !== 'http') return next.handle();
    const req = context.switchToHttp().getRequest<{
      method?: string;
      originalUrl?: string;
      url?: string;
      user?: { restaurantId?: string };
    }>();
    const started = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          JSON.stringify({
            method: req.method,
            path: req.originalUrl ?? req.url,
            ms: Date.now() - started,
            restaurantId: req.user?.restaurantId ?? null,
          }),
        );
      }),
    );
  }
}
