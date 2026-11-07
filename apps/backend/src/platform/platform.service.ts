import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import {
  DEFAULT_ROLE_PERMISSIONS,
  PERMISSIONS,
  STAFF_ROLES,
} from '@yatrideesk/types';
import { generateSecret, openSecret, otpauthUrl, sealSecret, verifyTotp } from '../auth/totp';
import { withoutInstancePermissions } from '../common/saas-mode';
import { PrismaService } from '../prisma/prisma.service';

const GSTIN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

@Injectable()
export class PlatformService implements OnModuleInit {
  private readonly logger = new Logger(PlatformService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async onModuleInit() {
    if (process.env.SAAS_MODE !== 'true') return;
    const email = process.env.PLATFORM_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.PLATFORM_ADMIN_PASSWORD;
    if (!email || !password || password.length < 8) return;
    const existing = await this.prisma.platformAdmin.findUnique({ where: { email } });
    if (existing) return;
    await this.prisma.platformAdmin.create({
      data: { email, passwordHash: await bcrypt.hash(password, 12) },
    });
    this.logger.log(`Created platform admin ${email}. Enrol an authenticator on first sign-in.`);
  }

  async login(email: string, password: string, totp?: string) {
    const admin = await this.prisma.platformAdmin.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (!admin || !admin.isActive || !(await bcrypt.compare(password, admin.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!admin.totpEnabled) {
      const token = await this.jwt.signAsync(
        { sub: admin.id, kind: 'platform', enroll: true },
        { expiresIn: '15m' },
      );
      return { token, enrollmentRequired: true as const, email: admin.email };
    }
    if (!totp || !admin.totpSecret) throw new UnauthorizedException('Authenticator code required');
    const secret = openSecret(admin.totpSecret, process.env.JWT_SECRET ?? '');
    const step = verifyTotp(secret, totp.trim());
    if (step === null || (admin.totpLastStep != null && step <= admin.totpLastStep)) {
      throw new UnauthorizedException('Authenticator code is not valid');
    }
    await this.prisma.platformAdmin.update({
      where: { id: admin.id },
      data: { totpLastStep: step },
    });
    const token = await this.jwt.signAsync({ sub: admin.id, kind: 'platform' });
    return { token, enrollmentRequired: false as const, email: admin.email };
  }

  async beginTotp(adminId: string) {
    const admin = await this.prisma.platformAdmin.findUniqueOrThrow({ where: { id: adminId } });
    const secret = generateSecret();
    await this.prisma.platformAdmin.update({
      where: { id: adminId },
      data: { totpSecret: sealSecret(secret, process.env.JWT_SECRET ?? ''), totpEnabled: false },
    });
    return { secret, otpauth: otpauthUrl(secret, admin.email, 'YatriDesk Platform') };
  }

  async enableTotp(adminId: string, code: string) {
    const admin = await this.prisma.platformAdmin.findUniqueOrThrow({ where: { id: adminId } });
    if (!admin.totpSecret) throw new BadRequestException('Start authenticator setup first');
    const secret = openSecret(admin.totpSecret, process.env.JWT_SECRET ?? '');
    const step = verifyTotp(secret, code.trim());
    if (step === null) throw new BadRequestException('That code did not match');
    await this.prisma.platformAdmin.update({
      where: { id: adminId },
      data: { totpEnabled: true, totpLastStep: step },
    });
    const token = await this.jwt.signAsync({ sub: admin.id, kind: 'platform' });
    return { token };
  }

  async listRestaurants() {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const rows = await this.prisma.restaurant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { users: true, branches: true } },
        branches: { select: { id: true } },
      },
    });
    const ids = rows.flatMap((r) => r.branches.map((b) => b.id));
    const recent = ids.length
      ? await this.prisma.order.groupBy({
          by: ['branchId'],
          where: { branchId: { in: ids }, createdAt: { gte: since } },
          _count: { _all: true },
        })
      : [];
    const byBranch = new Map(recent.map((r) => [r.branchId, r._count._all]));
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      status: r.status,
      plan: r.plan,
      branches: r._count.branches,
      users: r._count.users,
      orders30d: r.branches.reduce((n, b) => n + (byBranch.get(b.id) ?? 0), 0),
      createdAt: r.createdAt,
    }));
  }

  async getRestaurant(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        branches: true,
        users: { select: { id: true, name: true, email: true, isActive: true, role: { select: { name: true } } } },
        billingAccount: true,
      },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async onboard(adminId: string, input: {
    restaurantName: string;
    branchName: string;
    ownerName: string;
    ownerEmail: string;
    gstScheme?: 'REGULAR' | 'COMPOSITION';
    timezone?: string;
  }) {
    const email = input.ownerEmail.trim().toLowerCase();
    const taken = await this.prisma.user.findFirst({ where: { email } });
    if (taken) throw new ConflictException('That owner email is already in use');
    const temporaryPassword = randomBytes(9).toString('base64url');
    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    for (const permission of PERMISSIONS) {
      await this.prisma.permission.upsert({
        where: { key: permission.key },
        update: {},
        create: permission,
      });
    }
    const allPermissions = await this.prisma.permission.findMany();
    const byKey = new Map(allPermissions.map((p) => [p.key, p]));

    const restaurant = await this.prisma.$transaction(async (tx) => {
      const created = await tx.restaurant.create({
        data: {
          name: input.restaurantName,
          status: 'TRIAL',
          plan: 'starter',
          maxBranches: 1,
          maxUsers: 25,
          timezone: input.timezone || 'Asia/Kolkata',
          currency: 'INR',
        },
      });
      await tx.branch.create({
        data: {
          restaurantId: created.id,
          name: input.branchName,
          country: 'IN',
          taxRegime: 'INDIA_GST',
          gstScheme: input.gstScheme ?? 'REGULAR',
        },
      });
      let ownerRoleId = '';
      for (const roleName of STAFF_ROLES) {
        const role = await tx.role.create({
          data: {
            restaurantId: created.id,
            name: roleName,
            label: roleName.replace(/_/g, ' '),
          },
        });
        if (roleName === 'OWNER') ownerRoleId = role.id;
        const keys = withoutInstancePermissions(DEFAULT_ROLE_PERMISSIONS[roleName]);
        await tx.rolePermission.createMany({
          data: keys
            .map((key) => byKey.get(key))
            .filter((p): p is NonNullable<typeof p> => Boolean(p))
            .map((permission) => ({ roleId: role.id, permissionId: permission.id })),
        });
      }
      const branch = await tx.branch.findFirstOrThrow({ where: { restaurantId: created.id } });
      const owner = await tx.user.create({
        data: {
          restaurantId: created.id,
          roleId: ownerRoleId,
          name: input.ownerName,
          email,
          passwordHash,
          mustChangePassword: true,
          branches: { create: { branchId: branch.id } },
        },
      });
      await tx.billingAccount.create({
        data: { restaurantId: created.id, status: 'TRIAL', plan: 'starter' },
      });
      return { restaurant: created, ownerId: owner.id, branchId: branch.id };
    });

    await this.audit(adminId, 'restaurant.onboarded', 'Restaurant', restaurant.restaurant.id, {
      email,
    });
    return {
      restaurantId: restaurant.restaurant.id,
      branchId: restaurant.branchId,
      ownerEmail: email,
      temporaryPassword,
    };
  }

  async setStatus(adminId: string, restaurantId: string, status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'SUSPENDED') {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    await this.prisma.restaurant.update({ where: { id: restaurantId }, data: { status } });
    await this.audit(adminId, `restaurant.${status.toLowerCase()}`, 'Restaurant', restaurantId, {});
    return { id: restaurantId, status };
  }

  async assertUserLimit(restaurantId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { maxUsers: true, _count: { select: { users: true } } },
    });
    if (restaurant && restaurant._count.users >= restaurant.maxUsers) {
      throw new ConflictException('This plan has no room for another staff account');
    }
  }

  private audit(adminId: string, action: string, entity: string, entityId: string, metadata: Prisma.InputJsonValue) {
    return this.prisma.platformAuditLog.create({
      data: { adminId, action, entity, entityId, metadata },
    });
  }
}

export function assertGstin(value: string | undefined) {
  if (!value) return;
  if (!GSTIN.test(value.trim().toUpperCase())) throw new BadRequestException('Enter a valid GSTIN');
}
