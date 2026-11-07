import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SessionUser } from '@yatrideesk/types';
import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { isSaasMode } from '../common/saas-mode';
import { FeaturesService } from './features.service';

@ApiTags('features')
@Controller('v1/features')
export class FeaturesController {
  constructor(private readonly features: FeaturesService) {}

  @Auth()
  @Get()
  async list(@CurrentUser() user: SessionUser) {
    return {
      saasMode: isSaasMode(),
      flags: await this.features.effectiveFlags(user.restaurantId),
    };
  }
}
