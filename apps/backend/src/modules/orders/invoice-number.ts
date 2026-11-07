import { randomBytes } from 'node:crypto';
import type { Prisma } from '@prisma/client';

type Tx = Prisma.TransactionClient;

const GSTIN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export function isGstin(value: string): boolean {
  return GSTIN.test(value.trim().toUpperCase());
}

/** India financial year code. 1 Apr 2026 through 31 Mar 2027 is `2627`. */
export function indiaFiscalYearCode(at: Date, timeZone: string): string {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    hourCycle: 'h23',
  });
  const bag: Record<string, string> = {};
  for (const p of fmt.formatToParts(at)) bag[p.type] = p.value;
  const year = Number(bag.year);
  const month = Number(bag.month);
  const start = month >= 4 ? year : year - 1;
  const yy = (n: number) => String(n % 100).padStart(2, '0');
  return `${yy(start)}${yy(start + 1)}`;
}

export function suggestInvoicePrefix(branchName: string): string {
  const cleaned = branchName.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return (cleaned.slice(0, 4) || 'INV1').padEnd(1, 'X');
}

export function formatInvoiceNumber(prefix: string, fiscalYear: string, n: number): string {
  return `${prefix}/${fiscalYear}/${String(n).padStart(6, '0')}`;
}

/**
 * Assigns the financial-year tax invoice number for a fully paid India
 * regular-scheme bill. Composition bills and other tax regimes get nothing.
 * The counter moves inside the caller's transaction.
 */
export async function assignIndiaInvoice(
  tx: Tx,
  orderId: string,
): Promise<string | null> {
  const order = await tx.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { branch: { include: { restaurant: true } } },
  });
  if (order.invoiceNumber) return order.invoiceNumber;
  const branch = order.branch;
  if (branch.taxRegime !== 'INDIA_GST') return null;
  if (branch.gstScheme === 'COMPOSITION') return null;

  const fiscalYear = indiaFiscalYearCode(
    new Date(),
    branch.restaurant.timezone || 'Asia/Kolkata',
  );
  let prefix = branch.invoicePrefix;
  if (!prefix) {
    prefix = await ensurePrefix(tx, branch.id, branch.restaurantId, branch.name);
  }
  const id = `seq_${randomBytes(8).toString('hex')}`;
  const rows = await tx.$queryRaw<{ lastNumber: number }[]>`
    INSERT INTO invoice_sequences ("id", "branchId", "fiscalYear", "lastNumber")
    VALUES (${id}, ${branch.id}, ${fiscalYear}, 1)
    ON CONFLICT ("branchId", "fiscalYear")
    DO UPDATE SET "lastNumber" = invoice_sequences."lastNumber" + 1
    RETURNING "lastNumber"
  `;
  const number = formatInvoiceNumber(prefix, fiscalYear, rows[0].lastNumber);
  await tx.order.update({
    where: { id: orderId },
    data: { invoiceNumber: number, invoicedAt: new Date() },
  });
  return number;
}

async function ensurePrefix(
  tx: Tx,
  branchId: string,
  restaurantId: string,
  branchName: string,
): Promise<string> {
  const taken = new Set(
    (
      await tx.branch.findMany({
        where: { restaurantId, invoicePrefix: { not: null } },
        select: { invoicePrefix: true },
      })
    ).map((b) => b.invoicePrefix),
  );
  const base = suggestInvoicePrefix(branchName);
  let prefix = base.slice(0, 4);
  let n = 1;
  while (taken.has(prefix)) {
    n += 1;
    prefix = `${base.slice(0, 3)}${n}`.slice(0, 4);
  }
  await tx.branch.update({ where: { id: branchId }, data: { invoicePrefix: prefix } });
  return prefix;
}
