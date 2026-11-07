import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { SAAS_FEATURE_KEYS } from '../common/saas-mode';
import { FeaturesService } from '../features/features.service';
import { PlatformAuthGuard } from './platform.guard';
import { PlatformService } from './platform.service';
import type { PlatformPrincipal } from './platform.strategy';

const PLATFORM_COOKIE = 'yatrideesk_platform';
const cookieBase = () => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.COOKIE_SECURE === 'true',
  path: '/',
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  totp: z.string().trim().min(6).max(12).optional(),
});
const codeSchema = z.object({ code: z.string().trim().min(6).max(8) });
const onboardSchema = z.object({
  restaurantName: z.string().min(1).max(80),
  branchName: z.string().min(1).max(80).default('Main'),
  ownerName: z.string().min(1).max(80),
  ownerEmail: z.string().email(),
  gstScheme: z.enum(['REGULAR', 'COMPOSITION']).optional(),
  timezone: z.string().min(1).max(64).optional(),
});
const statusSchema = z.object({
  status: z.enum(['TRIAL', 'ACTIVE', 'PAST_DUE', 'SUSPENDED']),
});
const moduleSchema = z.object({
  key: z.enum(SAAS_FEATURE_KEYS),
  enabled: z.boolean(),
});

type PlatformRequest = Request & { user: PlatformPrincipal };

@ApiTags('platform')
@Controller('v1/platform')
export class PlatformController {
  constructor(
    private readonly platform: PlatformService,
    private readonly features: FeaturesService,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() body: z.infer<typeof loginSchema>, @Res({ passthrough: true }) res: Response) {
    const result = await this.platform.login(body.email, body.password, body.totp);
    res.cookie(PLATFORM_COOKIE, result.token, {
      ...cookieBase(),
      maxAge: result.enrollmentRequired ? 15 * 60 * 1000 : 12 * 60 * 60 * 1000,
    });
    return { email: result.email, enrollmentRequired: result.enrollmentRequired };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(PLATFORM_COOKIE, cookieBase());
    return { ok: true };
  }

  @UseGuards(PlatformAuthGuard)
  @Post('totp/setup')
  setup(@Req() req: PlatformRequest) {
    return this.platform.beginTotp(req.user.id);
  }

  @UseGuards(PlatformAuthGuard)
  @Post('totp/enable')
  @UsePipes(new ZodValidationPipe(codeSchema))
  async enable(
    @Req() req: PlatformRequest,
    @Body() body: z.infer<typeof codeSchema>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.platform.enableTotp(req.user.id, body.code);
    res.cookie(PLATFORM_COOKIE, result.token, { ...cookieBase(), maxAge: 12 * 60 * 60 * 1000 });
    return { ok: true };
  }

  @UseGuards(PlatformAuthGuard)
  @Get('modules')
  modules() {
    return this.features.globalSwitches();
  }

  @UseGuards(PlatformAuthGuard)
  @Put('modules')
  @UsePipes(new ZodValidationPipe(moduleSchema))
  setModule(@Body() body: z.infer<typeof moduleSchema>) {
    return this.features.setGlobal(body.key, body.enabled);
  }

  @UseGuards(PlatformAuthGuard)
  @Get('restaurants/:id/modules')
  restaurantModules(@Param('id') id: string) {
    return this.features.restaurantSwitches(id);
  }

  @UseGuards(PlatformAuthGuard)
  @Put('restaurants/:id/modules')
  @UsePipes(new ZodValidationPipe(moduleSchema))
  setRestaurantModule(@Param('id') id: string, @Body() body: z.infer<typeof moduleSchema>) {
    return this.features.setRestaurant(id, body.key, body.enabled);
  }

  @UseGuards(PlatformAuthGuard)
  @Get('restaurants')
  list() {
    return this.platform.listRestaurants();
  }

  @UseGuards(PlatformAuthGuard)
  @Get('restaurants/:id')
  one(@Param('id') id: string) {
    return this.platform.getRestaurant(id);
  }

  @UseGuards(PlatformAuthGuard)
  @Post('restaurants')
  @UsePipes(new ZodValidationPipe(onboardSchema))
  onboard(@Req() req: PlatformRequest, @Body() body: z.infer<typeof onboardSchema>) {
    return this.platform.onboard(req.user.id, body);
  }

  @UseGuards(PlatformAuthGuard)
  @Post('restaurants/:id/status')
  @UsePipes(new ZodValidationPipe(statusSchema))
  status(
    @Req() req: PlatformRequest,
    @Param('id') id: string,
    @Body() body: z.infer<typeof statusSchema>,
  ) {
    return this.platform.setStatus(req.user.id, id, body.status);
  }
}
