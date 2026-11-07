import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

export interface PlatformPrincipal {
  id: string;
  email: string;
  enroll: boolean;
}

@Injectable()
export class PlatformJwtStrategy extends PassportStrategy(Strategy, 'platform-jwt') {
  constructor(config: ConfigService, private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: { cookies?: Record<string, string> }) =>
          req.cookies?.['yatrideesk_platform'] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub?: string; kind?: string; enroll?: boolean }): Promise<PlatformPrincipal> {
    if (payload.kind !== 'platform' || !payload.sub) {
      throw new UnauthorizedException('Platform session required');
    }
    const admin = await this.prisma.platformAdmin.findUnique({ where: { id: payload.sub } });
    if (!admin || !admin.isActive) throw new UnauthorizedException('Platform session no longer valid');
    return { id: admin.id, email: admin.email, enroll: payload.enroll === true };
  }
}
