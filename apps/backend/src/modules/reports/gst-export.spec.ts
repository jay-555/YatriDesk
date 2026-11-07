import { lineFromInclusive, summarizeGst } from './gst-export';

describe('GST workbook', () => {
  it('splits an inclusive line and groups B2C by rate', () => {
    const line = lineFromInclusive(105, 5, 1, '');
    expect(line.hsn).toBe('996331');
    expect(line.taxable).toBe(100);
    expect(line.tax).toBe(5);
    const sheets = summarizeGst([
      {
        invoiceNumber: 'BLR1/2627/000001',
        invoicedAt: new Date('2026-04-02'),
        customerGstin: null,
        customerLegalName: null,
        totalAmount: 105,
        lines: [line],
      },
    ]);
    expect(sheets.b2c).toHaveLength(1);
    expect(sheets.b2c[0].tax).toBe(5);
    expect(sheets.b2c[0].cgst + sheets.b2c[0].sgst).toBeCloseTo(5, 2);
    expect(sheets.b2b).toHaveLength(0);
    expect(sheets.docs[0]).toMatchObject({ from: 'BLR1/2627/000001', count: 1 });
  });

  it('puts a buyer GSTIN on the B2B sheet', () => {
    const sheets = summarizeGst([
      {
        invoiceNumber: 'BLR1/2627/000002',
        invoicedAt: new Date('2026-04-03'),
        customerGstin: '29ABCDE1234F1Z5',
        customerLegalName: 'Acme',
        totalAmount: 118,
        lines: [lineFromInclusive(118, 18, 2, '2106')],
      },
    ]);
    expect(sheets.b2b[0].gstin).toBe('29ABCDE1234F1Z5');
    expect(sheets.hsn[0].hsn).toBe('2106');
    expect(sheets.b2c).toHaveLength(0);
  });
});
