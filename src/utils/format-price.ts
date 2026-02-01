import { useAuthContext } from 'src/auth/hooks/use-auth-context';

// ----------------------------------------------------------------------

/**
 * Format price with user's currency
 * @param price - Price value (can be string or number)
 * @param options - Formatting options
 * @returns Formatted price string with currency symbol
 */
export function formatPrice(
  price: string | number | null | undefined,
  options?: {
    currency?: string;
    currencySymbol?: string;
    showSymbol?: boolean;
    decimals?: number;
  }
): string {
  if (price == null || price === '') return '0.00';

  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '0.00';

  const decimals = options?.decimals ?? 2;
  const formattedPrice = numPrice.toFixed(decimals);

  // If custom currency symbol provided, use it
  if (options?.currencySymbol) {
    return `${formattedPrice} ${options.currencySymbol}`;
  }

  // If currency code provided, try to format it
  if (options?.currency) {
    try {
      // Try using Intl.NumberFormat for proper currency formatting
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: options.currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(numPrice);
      return formatted;
    } catch (error) {
      console.error('Error formatting currency:', error);
      // Fallback to symbol format
      const symbol = getCurrencySymbol(options.currency);
      return `${symbol} ${formattedPrice}`;
    }
  }

  // Default to USD
  return `$ ${formattedPrice}`;
}

/**
 * Get currency symbol from currency code
 */
function getCurrencySymbol(currencyCode: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EGP: 'EGP',
    EUR: '€',
    GBP: '£',
    AED: 'AED',
    SAR: 'SAR',
  };

  return symbols[currencyCode.toUpperCase()] || currencyCode;
}

/**
 * Hook to get user's currency and format price
 */
export function useFormatPrice() {
  const { user } = useAuthContext();

  const format = (price: string | number | null | undefined, options?: { decimals?: number }) => {
    const currency = user?.currency;
    const currencyCode = currency?.currency || 'USD';
    const currencySymbol = currency?.currency_symbol || '$';

    return formatPrice(price, {
      currency: currencyCode,
      currencySymbol,
      ...options,
    });
  };

  return { format, currency: user?.currency };
}

