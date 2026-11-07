import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { SessionUser } from '@yatrideesk/types';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  effectivePermissions,
  permissionInclude,
} from './effective-permissions';
import { PrismaService } from '../prisma/prisma.service';

interface JwtPayload {
  sub: string;
  kind?: string;
}

const cookieExtractor = (req: {
  cookies?: Record<string, string>;
}): string | null => {
  return req.cookies?.['yatrideesk_session'] ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<SessionUser> {
    if (payload.kind === 'platform') {
      throw new UnauthorizedException('Platform sessions cannot call restaurant routes');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { ...permissionInclude, restaurant: { select: { status: true } } },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Session no longer valid');
    }
    if (user.restaurant.status === 'SUSPENDED') {
      throw new UnauthorizedException('This restaurant is suspended');
    }

    return {
      id: user.id,
      restaurantId: user.restaurantId,
      name: user.name,
      roleId: user.roleId,
      roleName: user.role.name,
      permissions: effectivePermissions(user),
      mustChangePassword: user.mustChangePassword,
    };
  }
}
