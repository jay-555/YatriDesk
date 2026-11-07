import { formatInvoiceNumber, indiaFiscalYearCode, isGstin, suggestInvoicePrefix } from './invoice-number';

describe('India invoice numbers', () => {
  it('uses the April financial year in the restaurant timezone', () => {
    expect(indiaFiscalYearCode(new Date('2026-04-01T00:30:00Z'), 'Asia/Kolkata')).toBe('2627');
    expect(indiaFiscalYearCode(new Date('2026-03-31T12:00:00Z'), 'Asia/Kolkata')).toBe('2526');
  });

  it('formats a 6-digit sequence', () => {
    expect(formatInvoiceNumber('BLR1', '2627', 123)).toBe('BLR1/2627/000123');
  });

  it('suggests a short prefix from the branch name', () => {
    expect(suggestInvoicePrefix('Koramangala')).toBe('KORA');
    expect(suggestInvoicePrefix('***')).toBe('INV1');
  });

  it('accepts a GSTIN and rejects a short one', () => {
    expect(isGstin('29ABCDE1234F1Z5')).toBe(true);
    expect(isGstin('29ABC')).toBe(false);
  });
});
