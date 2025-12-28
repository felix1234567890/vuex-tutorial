/**
 * Currency formatting utilities
 */

/**
 * Format a number as currency
 *
 * @param value - The value to format
 * @param currencyCode - ISO 4217 currency code (e.g., 'USD', 'EUR')
 * @param decimals - Number of decimal places to show
 * @param locale - BCP 47 language tag (e.g., 'en-US', 'fr-FR')
 * @returns Formatted currency string
 */
function currency(value: number | null | undefined, currencyCode: string = 'USD', decimals: number = 2, locale: string = 'en-US'): string {
  // Handle null, undefined, or NaN values
  if (value == null || isNaN(value)) return '';

  try {
    // Use the Intl.NumberFormat API for localized currency formatting
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  } catch (e) {
    // Fallback for invalid currency codes or locales
    console.warn(`Currency formatting error: ${(e as Error).message}`);
    return Number(value).toFixed(decimals) + ' ' + currencyCode;
  }
}

/**
 * Format a price with a specific currency symbol
 *
 * @param value - The value to format
 * @param symbol - Currency symbol to use
 * @param decimals - Number of decimal places
 * @returns Formatted price string
 */
function formatPrice(value: number | null | undefined, symbol: string = '$', decimals: number = 2): string {
  if (value == null || isNaN(value)) return '';
  return `${symbol}${Number(value).toFixed(decimals)}`;
}

export { currency, formatPrice };
