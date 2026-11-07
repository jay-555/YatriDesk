import { Global, Module } from '@nestjs/common';
import { BranchHoursService } from './services/branch-hours.service';

@Global()
@Module({
  providers: [BranchHoursService],
  exports: [BranchHoursService],
})
export class SaasCommonModule {}
