import { Module } from '@nestjs/common';
import { PlatformModule } from '../platform/platform.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
  imports: [PlatformModule],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
