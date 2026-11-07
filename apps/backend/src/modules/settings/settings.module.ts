import { Module } from '@nestjs/common';
import { AuditModule } from '../../audit/audit.module';
import { BranchAccessService } from '../../common/services/branch-access.service';
import { HoursController } from './hours.controller';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [AuditModule],
  controllers: [SettingsController, HoursController],
  providers: [SettingsService, BranchAccessService],
})
export class SettingsModule {}
