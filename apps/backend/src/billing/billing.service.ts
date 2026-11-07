import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PlatformService } from '../platform/platform.service';

const GST_RATE = 0.18;

export function verifyRazorpaySignature(rawBody: string, header: string | undefined, secret: string): boolean {
  if (!header || !secret) return false;
  const digest = createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(digest);
  const b = Buffer.from(header);
  return a.length === b.length && timingSafeEqual(a, b);
}

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly platform: PlatformService,
  ) {}

  async status(restaurantId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { billingAccount: true, saasInvoices: { orderBy: { issuedAt: 'desc' }, take: 12 } },
    });
    return {
      restaurantStatus: restaurant?.status ?? 'ACTIVE',
      plan: restaurant?.plan ?? 'starter',
      billing: restaurant?.billingAccount ?? null,
      invoices: restaurant?.saasInvoices ?? [],
      razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? null,
    };
  }

  async startSubscription(restaurantId: string) {
    const key = process.env.RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const planId = process.env.RAZORPAY_PLAN_ID;
    if (!key || !secret || !planId) {
      throw new BadRequestException('Razorpay is not configured on this server');
    }
    const restaurant = await this.prisma.restaurant.findUniqueOrThrow({
      where: { id: restaurantId },
      include: { users: { where: { role: { name: 'OWNER' } }, take: 1 } },
    });
    const auth = Buffer.from(`${key}:${secret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan_id: planId,
        total_count: 120,
        customer_notify: 1,
        notes: { restaurantId },
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new BadRequestException(`Razorpay refused the subscription: ${text.slice(0, 180)}`);
    }
    const body = (await response.json()) as { id: string; short_url?: string };
    await this.prisma.billingAccount.upsert({
      where: { restaurantId },
      create: { restaurantId, razorpaySubscriptionId: body.id, status: 'TRIAL', plan: 'starter' },
      update: { razorpaySubscriptionId: body.id },
    });
    return { subscriptionId: body.id, shortUrl: body.short_url ?? null, keyId: key, email: restaurant.users[0]?.email ?? null };
  }

  async handleWebhook(rawBody: string, signature: string | undefined) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret || !verifyRazorpaySignature(rawBody, signature, secret)) {
      throw new UnauthorizedException('Invalid Razorpay signature');
    }
    const event = JSON.parse(rawBody) as {
      event?: string;
      payload?: {
        subscription?: { entity?: { id?: string; notes?: { restaurantId?: string } } };
        payment?: { entity?: { id?: string; amount?: number } };
      };
    };
    const subscription = event.payload?.subscription?.entity;
    const restaurantId = subscription?.notes?.restaurantId;
    const subscriptionId = subscription?.id;
    const account = restaurantId
      ? await this.prisma.billingAccount.findUnique({ where: { restaurantId } })
      : subscriptionId
        ? await this.prisma.billingAccount.findFirst({ where: { razorpaySubscriptionId: subscriptionId } })
        : null;
    if (!account) return { ok: true, ignored: true };
    const name = event.event ?? '';
    if (name === 'subscription.charged' || name === 'subscription.activated') {
      await this.prisma.restaurant.update({
        where: { id: account.restaurantId },
        data: { status: 'ACTIVE' },
      });
      await this.prisma.billingAccount.update({
        where: { restaurantId: account.restaurantId },
        data: { status: 'ACTIVE' },
      });
      if (name === 'subscription.charged') {
        const paise = event.payload?.payment?.entity?.amount ?? 0;
        const total = paise / 100;
        const taxable = Math.round((total / (1 + GST_RATE)) * 100) / 100;
        const gst = Math.round((total - taxable) * 100) / 100;
        const number = await this.nextSaasNumber();
        await this.prisma.saasInvoice.create({
          data: {
            restaurantId: account.restaurantId,
            number,
            taxableAmount: new Prisma.Decimal(taxable),
            gstAmount: new Prisma.Decimal(gst),
            total: new Prisma.Decimal(total),
            razorpayPaymentId: event.payload?.payment?.entity?.id,
          },
        });
      }
    } else if (name === 'subscription.pending' || name === 'payment.failed') {
      await this.prisma.restaurant.update({ where: { id: account.restaurantId }, data: { status: 'PAST_DUE' } });
      await this.prisma.billingAccount.update({ where: { restaurantId: account.restaurantId }, data: { status: 'PAST_DUE' } });
    } else if (name === 'subscription.halted' || name === 'subscription.cancelled') {
      await this.platform.setStatus('razorpay', account.restaurantId, 'SUSPENDED');
      await this.prisma.billingAccount.update({ where: { restaurantId: account.restaurantId }, data: { status: 'HALTED' } });
    }
    return { ok: true };
  }

  private async nextSaasNumber(): Promise<string> {
    const rows = await this.prisma.$queryRaw<{ lastNumber: number }[]>`
      INSERT INTO saas_invoice_sequences ("id", "lastNumber")
      VALUES ('saas', 1)
      ON CONFLICT ("id") DO UPDATE SET "lastNumber" = saas_invoice_sequences."lastNumber" + 1
      RETURNING "lastNumber"
    `;
    const year = new Date().getFullYear();
    return `SAAS/${year}/${String(rows[0].lastNumber).padStart(6, '0')}`;
  }
}
