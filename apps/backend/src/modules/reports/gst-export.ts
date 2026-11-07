export interface GstLine {
  hsn: string;
  rate: number;
  taxable: number;
  tax: number;
  quantity: number;
  value: number;
}

export interface GstOrder {
  invoiceNumber: string | null;
  invoicedAt: Date | null;
  customerGstin: string | null;
  customerLegalName: string | null;
  totalAmount: number;
  lines: GstLine[];
}

export interface GstSheets {
  b2c: { rate: number; invoices: number; taxable: number; cgst: number; sgst: number; tax: number; value: number }[];
  b2b: { gstin: string; legalName: string; invoiceNumber: string; date: string; rate: number; taxable: number; cgst: number; sgst: number; value: number }[];
  hsn: { hsn: string; rate: number; quantity: number; taxable: number; cgst: number; sgst: number; value: number }[];
  docs: { series: string; from: string; to: string; count: number }[];
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const SAC = '996331';

export function lineFromInclusive(gross: number, rate: number, quantity: number, hsn?: string | null): GstLine {
  const taxable = rate > 0 ? round2(gross / (1 + rate / 100)) : round2(gross);
  return {
    hsn: hsn && hsn.trim() ? hsn.trim() : SAC,
    rate,
    taxable,
    tax: round2(gross - taxable),
    quantity,
    value: round2(gross),
  };
}

/** GSTR-1 shaped sheets. Refunds are not subtracted; they stay on the original invoice. */
export function summarizeGst(orders: GstOrder[]): GstSheets {
  const invoiced = orders.filter((o) => o.invoiceNumber);
  const b2cMap = new Map<number, GstSheets['b2c'][number]>();
  const b2b: GstSheets['b2b'] = [];
  const hsnMap = new Map<string, GstSheets['hsn'][number]>();

  for (const order of invoiced) {
    const b2bBill = Boolean(order.customerGstin);
    const rates = new Map<number, { taxable: number; tax: number; value: number }>();
    for (const line of order.lines) {
      const bucket = rates.get(line.rate) ?? { taxable: 0, tax: 0, value: 0 };
      bucket.taxable = round2(bucket.taxable + line.taxable);
      bucket.tax = round2(bucket.tax + line.tax);
      bucket.value = round2(bucket.value + line.value);
      rates.set(line.rate, bucket);
      const hk = `${line.hsn}|${line.rate}`;
      const h = hsnMap.get(hk) ?? {
        hsn: line.hsn,
        rate: line.rate,
        quantity: 0,
        taxable: 0,
        cgst: 0,
        sgst: 0,
        value: 0,
      };
      h.quantity += line.quantity;
      h.taxable = round2(h.taxable + line.taxable);
      h.cgst = round2(h.cgst + line.tax / 2);
      h.sgst = round2(h.sgst + (line.tax - line.tax / 2));
      h.value = round2(h.value + line.value);
      hsnMap.set(hk, h);
    }
    for (const [rate, bucket] of rates) {
      const half = round2(bucket.tax / 2);
      if (b2bBill) {
        b2b.push({
          gstin: order.customerGstin!,
          legalName: order.customerLegalName ?? '',
          invoiceNumber: order.invoiceNumber!,
          date: (order.invoicedAt ?? new Date()).toISOString().slice(0, 10),
          rate,
          taxable: bucket.taxable,
          cgst: half,
          sgst: round2(bucket.tax - half),
          value: bucket.value,
        });
      } else {
        const row = b2cMap.get(rate) ?? {
          rate,
          invoices: 0,
          taxable: 0,
          cgst: 0,
          sgst: 0,
          tax: 0,
          value: 0,
        };
        row.invoices += 1;
        row.taxable = round2(row.taxable + bucket.taxable);
        row.tax = round2(row.tax + bucket.tax);
        row.cgst = round2(row.cgst + half);
        row.sgst = round2(row.sgst + (bucket.tax - half));
        row.value = round2(row.value + bucket.value);
        b2cMap.set(rate, row);
      }
    }
  }

  const bySeries = new Map<string, string[]>();
  for (const order of invoiced) {
    const number = order.invoiceNumber!;
    const series = number.split('/').slice(0, 2).join('/');
    const list = bySeries.get(series) ?? [];
    list.push(number);
    bySeries.set(series, list);
  }
  const docs = [...bySeries.entries()].map(([series, numbers]) => {
    const sorted = [...numbers].sort();
    return { series, from: sorted[0], to: sorted[sorted.length - 1], count: sorted.length };
  });

  return {
    b2c: [...b2cMap.values()].sort((a, b) => a.rate - b.rate),
    b2b,
    hsn: [...hsnMap.values()],
    docs,
  };
}
