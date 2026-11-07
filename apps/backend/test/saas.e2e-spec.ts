/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- supertest bodies are untyped */
// SAAS_E2E=1 SAAS_MODE=true DATABASE_URL=... JWT_SECRET=... PLATFORM_ADMIN_EMAIL=... PLATFORM_ADMIN_PASSWORD=...
// npx jest --config ./test/jest-e2e.json --runInBand saas.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ThrottlerStorage } from '@nestjs/throttler';
import { randomUUID } from 'crypto';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { base32Decode, hotp, stepAt } from '../src/auth/totp';
import { assignIndiaInvoice, indiaFiscalYearCode } from '../src/modules/orders/invoice-number';

const run = process.env.SAAS_E2E ? describe : describe.skip;
const tag = randomUUID().slice(0, 8);

const created = (status: number) => status === 200 || status === 201;

function jar(res: { headers: Record<string, unknown> }) {
  const raw = res.headers['set-cookie'];
  const list = Array.isArray(raw) ? raw : raw ? [String(raw)] : [];
  return list.map((c) => String(c).split(';')[0]).join('; ');
}

run('India SaaS pilot gate (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let platformCookie = '';

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(ThrottlerStorage)
      .useValue({
        increment: () =>
          Promise.resolve({ totalHits: 1, timeToExpire: 60, isBlocked: false, timeToBlockExpire: 0 }),
      })
      .compile();
    app = mod.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    await app.init();
    prisma = app.get(PrismaService);
    const email = process.env.PLATFORM_ADMIN_EMAIL!.trim().toLowerCase();
    await prisma.platformAdmin.updateMany({
      where: { email },
      data: { totpEnabled: false, totpSecret: null, totpLastStep: null },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  async function platformLogin() {
    const email = process.env.PLATFORM_ADMIN_EMAIL!;
    const password = process.env.PLATFORM_ADMIN_PASSWORD!;
    const login = await request(app.getHttpServer())
      .post('/api/v1/platform/login')
      .send({ email, password });
    expect(created(login.status)).toBe(true);
    platformCookie = jar(login);
    const setup = await request(app.getHttpServer())
      .post('/api/v1/platform/totp/setup')
      .set('Cookie', platformCookie);
    expect(created(setup.status)).toBe(true);
    const code = hotp(base32Decode(setup.body.secret), stepAt(Date.now()));
    const enable = await request(app.getHttpServer())
      .post('/api/v1/platform/totp/enable')
      .set('Cookie', platformCookie)
      .send({ code });
    expect(created(enable.status)).toBe(true);
    platformCookie = jar(enable) || platformCookie;
  }

  async function onboard(name: string, gstScheme: 'REGULAR' | 'COMPOSITION' = 'REGULAR') {
    const res = await request(app.getHttpServer())
      .post('/api/v1/platform/restaurants')
      .set('Cookie', platformCookie)
      .send({
        restaurantName: `${name} ${tag}`,
        branchName: 'Main',
        ownerName: `${name} Owner`,
        ownerEmail: `${name}-${tag}@example.com`,
        gstScheme,
      });
    expect(created(res.status)).toBe(true);
    return res.body as {
      restaurantId: string;
      branchId: string;
      ownerEmail: string;
      temporaryPassword: string;
    };
  }

  async function ownerSession(email: string, password: string) {
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password });
    expect(created(login.status)).toBe(true);
    const changed = await request(app.getHttpServer())
      .post('/api/v1/auth/change-password')
      .set('Cookie', jar(login))
      .send({ currentPassword: password, newPassword: 'NewPassword123!' });
    expect(created(changed.status)).toBe(true);
    return jar(changed);
  }

  it('onboards two tenants, numbers an invoice, and isolates a suspension', async () => {
    await platformLogin();
    const staffOnly = await request(app.getHttpServer())
      .get('/api/v1/platform/restaurants')
      .set('Cookie', 'yatrideesk_session=not-a-platform-token');
    expect(staffOnly.status).toBeGreaterThanOrEqual(401);

    const a = await onboard('Alpha');
    const b = await onboard('Beta', 'COMPOSITION');
    const sessionCookie = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: a.ownerEmail, password: a.temporaryPassword });
    const platformOnTenant = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', platformCookie);
    expect(platformOnTenant.status).toBe(401);

    const cookieA = await ownerSession(a.ownerEmail, a.temporaryPassword);
    const cookieB = await ownerSession(b.ownerEmail, b.temporaryPassword);
    expect(created(sessionCookie.status)).toBe(true);

    const category = await prisma.menuCategory.create({
      data: { branchId: a.branchId, name: 'Food' },
    });
    const item = await prisma.menuItem.create({
      data: {
        branchId: a.branchId,
        categoryId: category.id,
        name: 'Thali',
        price: 100,
        taxRatePercent: 0,
        hsnCode: '996331',
      },
    });
    await prisma.branch.update({ where: { id: a.branchId }, data: { invoicePrefix: 'BLR1' } });

    const sell = async () => {
      const order = await request(app.getHttpServer())
        .post(`/api/v1/orders?branchId=${a.branchId}`)
        .set('Cookie', cookieA)
        .send({ type: 'TAKEAWAY', items: [{ menuItemId: item.id, quantity: 1, modifierIds: [] }] });
      expect(created(order.status)).toBe(true);
      const paid = await request(app.getHttpServer())
        .post(`/api/v1/orders/${order.body.id}/checkout?branchId=${a.branchId}`)
        .set('Cookie', cookieA)
        .send({ payments: [{ method: 'CASH', amount: 100 }], requestId: randomUUID() });
      expect(created(paid.status)).toBe(true);
      return paid.body.invoiceNumber as string;
    };

    const numbers = await Promise.all(Array.from({ length: 10 }, () => sell()));
    const sorted = [...numbers].sort();
    const year = indiaFiscalYearCode(new Date(), 'Asia/Kolkata');
    expect(sorted[0]).toBe(`BLR1/${year}/000001`);
    expect(sorted[9]).toBe(`BLR1/${year}/000010`);
    expect(new Set(numbers).size).toBe(10);

    const gap = await prisma.order.create({
      data: {
        branchId: a.branchId,
        orderNumber: `gap-${tag}`,
        type: 'TAKEAWAY',
        status: 'OPEN',
        subtotal: 1,
        totalAmount: 1,
        createdById: (await prisma.user.findFirstOrThrow({ where: { email: a.ownerEmail } })).id,
      },
    });
    const before = await prisma.invoiceSequence.findUnique({
      where: { branchId_fiscalYear: { branchId: a.branchId, fiscalYear: year } },
    });
    await expect(
      prisma.$transaction(async (tx) => {
        await assignIndiaInvoice(tx, gap.id);
        throw new Error('rollback');
      }),
    ).rejects.toThrow('rollback');
    const after = await prisma.invoiceSequence.findUnique({
      where: { branchId_fiscalYear: { branchId: a.branchId, fiscalYear: year } },
    });
    expect(after?.lastNumber).toBe(before?.lastNumber);

    const categoryB = await prisma.menuCategory.create({ data: { branchId: b.branchId, name: 'Food' } });
    const itemB = await prisma.menuItem.create({
      data: { branchId: b.branchId, categoryId: categoryB.id, name: 'Chai', price: 20, taxRatePercent: 5 },
    });
    const orderB = await request(app.getHttpServer())
      .post(`/api/v1/orders?branchId=${b.branchId}`)
      .set('Cookie', cookieB)
      .send({ type: 'TAKEAWAY', items: [{ menuItemId: itemB.id, quantity: 1, modifierIds: [] }] });
    const paidB = await request(app.getHttpServer())
      .post(`/api/v1/orders/${orderB.body.id}/checkout?branchId=${b.branchId}`)
      .set('Cookie', cookieB)
      .send({ payments: [{ method: 'CASH', amount: 20 }], requestId: randomUUID() });
    expect(created(paidB.status)).toBe(true);
    expect(paidB.body.invoiceNumber ?? null).toBeNull();
    const receipt = await request(app.getHttpServer())
      .get(`/api/v1/orders/${orderB.body.id}/receipt?branchId=${b.branchId}`)
      .set('Cookie', cookieB);
    expect(receipt.status).toBe(200);
    expect(receipt.text).toContain('BILL OF SUPPLY');
    expect(receipt.text).not.toContain('CGST');

    const book = await request(app.getHttpServer())
      .get(`/api/v1/reports/gst/workbook?branchId=${a.branchId}&from=2026-04-01&to=2027-03-31`)
      .set('Cookie', cookieA);
    expect(book.status).toBe(200);
    expect(book.headers['content-type']).toContain('spreadsheet');

    await request(app.getHttpServer())
      .post(`/api/v1/platform/restaurants/${a.restaurantId}/status`)
      .set('Cookie', platformCookie)
      .send({ status: 'SUSPENDED' })
      .expect((res) => {
        if (!created(res.status)) throw new Error(`expected 200 or 201, got ${res.status}`);
      });
    const blocked = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: a.ownerEmail, password: 'NewPassword123!' });
    expect(blocked.status).toBe(403);
    const still = await request(app.getHttpServer()).get('/api/v1/auth/me').set('Cookie', cookieB);
    expect(still.status).toBe(200);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE ROLE saas_rls_probe NOLOGIN;
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);
    await prisma.$executeRawUnsafe('GRANT SELECT ON orders, branches TO saas_rls_probe');
    const visible = await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`SET LOCAL ROLE saas_rls_probe`);
      await tx.$executeRaw`SELECT set_config('app.platform', 'off', true)`;
      await tx.$executeRaw`SELECT set_config('app.restaurant_id', ${b.restaurantId}, true)`;
      return tx.$queryRaw<{ id: string }[]>`SELECT id FROM orders WHERE "branchId" = ${a.branchId}`;
    });
    expect(visible).toHaveLength(0);
  }, 120_000);
});
