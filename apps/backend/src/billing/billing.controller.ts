import { Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import type { SessionUser } from '@yatrideesk/types';
import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BillingService } from './billing.service';

@ApiTags('billing')
@Controller('v1/billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Auth()
  @Get('status')
  status(@CurrentUser() user: SessionUser) {
    return this.billing.status(user.restaurantId);
  }

  @Auth('settings.manage')
  @Post('subscribe')
  subscribe(@CurrentUser() user: SessionUser) {
    return this.billing.startSubscription(user.restaurantId);
  }

  @Post('webhook')
  webhook(@Req() req: Request & { rawBody?: Buffer }, @Headers('x-razorpay-signature') signature?: string) {
    const raw = req.rawBody?.toString('utf8') ?? JSON.stringify(req.body ?? {});
    return this.billing.handleWebhook(raw, signature);
  }
}
