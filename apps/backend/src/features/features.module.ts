import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
import { ModuleGateInterceptor } from './module-gate.interceptor';

@Module({
  controllers: [FeaturesController],
  providers: [
    FeaturesService,
    { provide: APP_INTERCEPTOR, useClass: ModuleGateInterceptor },
  ],
  exports: [FeaturesService],
})
export class FeaturesModule {}
