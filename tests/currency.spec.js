
/* eslint-env jest */

const { currency } = require('../currency.ts');

describe('currency', () => {
  it('formats USD by default', () => {
    expect(currency(1234.56)).toBe('$1,234.56');
  });

  it('formats with custom currency code', () => {
    expect(currency(1234.56, 'EUR')).toBe('€1,234.56');
  });

  it('formats with custom decimals', () => {
    expect(currency(1234.5, 'USD', 0)).toBe('$1,235');
    expect(currency(1234.567, 'USD', 3)).toBe('$1,234.567');
  });

  it('formats with custom locale', () => {
    expect(currency(1234.56, 'EUR', 2, 'de-DE')).toBe('1.234,56 €');
  });

  it('handles negative values', () => {
    expect(currency(-1234.56)).toBe('-$1,234.56');
  });

  it('returns empty string for null/undefined/NaN', () => {
    expect(currency(null)).toBe('');
    expect(currency(undefined)).toBe('');
    expect(currency(NaN)).toBe('');
  });

  it('falls back for invalid currency code', () => {
    expect(currency(1234.56, 'INVALID')).toBe('1234.56 INVALID');
  });
});
