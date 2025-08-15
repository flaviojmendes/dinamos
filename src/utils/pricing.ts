export interface PricingData {
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  currency: string;
  currencySymbol: string;
  locale: string;
}

export interface CurrencyConfig {
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  currencySymbol: string;
  locale: string;
}

// Currency configurations based on region/language
const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  'pt-BR': {
    originalPrice: 499,
    discountedPrice: 179,
    currency: 'BRL',
    currencySymbol: 'R$',
    locale: 'pt-BR'
  },
  'en-US': {
    originalPrice: 89,
    discountedPrice: 30,
    currency: 'USD',
    currencySymbol: '$',
    locale: 'en-US'
  },
  'en-EU': {
    originalPrice: 89,
    discountedPrice: 30,
    currency: 'EUR',
    currencySymbol: '€',
    locale: 'en-EU'
  },
  'en-IN': {
    originalPrice: 4999,
    discountedPrice: 1700,
    currency: 'INR',
    currencySymbol: '₹',
    locale: 'en-IN'
  }
};

/**
 * Detects user's currency preference based on browser language and location
 */
export function detectUserCurrency(): string {
  // Try to get user's timezone and language
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language || 'en-US';

  // Debug logging to help troubleshoot detection issues
  console.log(`Currency Detection - Timezone: ${timeZone}, Language: ${language}`);

  // European timezones -> EUR
  const europeanTimezones = [
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 
    'Europe/Madrid', 'Europe/Amsterdam', 'Europe/Brussels', 'Europe/Vienna',
    'Europe/Stockholm', 'Europe/Copenhagen', 'Europe/Helsinki', 'Europe/Oslo',
    'Europe/Warsaw', 'Europe/Prague', 'Europe/Budapest', 'Europe/Zurich',
    'Europe/Dublin', 'Europe/Lisbon', 'Europe/Athens', 'Europe/Luxembourg',
    'Europe/Monaco', 'Europe/Andorra', 'Europe/Vatican', 'Europe/San_Marino',
    'Europe/Malta', 'Europe/Vilnius', 'Europe/Riga', 'Europe/Tallinn',
    'Europe/Ljubljana', 'Europe/Zagreb', 'Europe/Sarajevo', 'Europe/Skopje',
    'Europe/Podgorica', 'Europe/Belgrade', 'Europe/Bucharest', 'Europe/Sofia',
    'Europe/Tirane', 'Europe/Kiev', 'Europe/Chisinau', 'Europe/Minsk'
  ];

  // European language codes that should use EUR regardless of timezone
  const europeanLanguageCodes = [
    'de', 'fr', 'es', 'it', 'nl', 'sv', 'da', 'no', 'fi', 'pl', 'cs', 'hu',
    'el', 'et', 'lv', 'lt', 'sl', 'sk', 'hr', 'bg', 'ro', 'mt', 'ga'
  ];

  // Indian timezone -> INR
  const indianTimezones = [
    'Asia/Kolkata', 'Asia/Calcutta'
  ];

  // Brazilian timezone -> BRL
  const brazilianTimezones = [
    'America/Sao_Paulo', 'America/Fortaleza', 'America/Recife', 
    'America/Bahia', 'America/Manaus', 'America/Rio_Branco'
  ];

  // Check timezone and language for Brazil
  if (brazilianTimezones.includes(timeZone) || language.startsWith('pt')) {
    console.log('Detected currency: Brazilian Real (pt-BR)');
    return 'pt-BR';
  }
  
  // Check timezone and language for India
  if (indianTimezones.includes(timeZone) || language.startsWith('hi') || language.startsWith('ta') || language.startsWith('te')) {
    console.log('Detected currency: Indian Rupee (en-IN)');
    return 'en-IN';
  }
  
  // Check timezone for Europe
  if (europeanTimezones.includes(timeZone)) {
    console.log('Detected currency: Euro (en-EU) - based on timezone');
    return 'en-EU';
  }

  // Check language for Europe (fallback for VPN users or incorrect timezone)
  const languageCode = language.split('-')[0].toLowerCase();
  if (europeanLanguageCodes.includes(languageCode)) {
    console.log('Detected currency: Euro (en-EU) - based on language');
    return 'en-EU';
  }

  // Special case for English speakers in Europe (en-IE, en-GB, etc.)
  if (language.toLowerCase().includes('ie') || language.toLowerCase().includes('gb')) {
    console.log('Detected currency: Euro (en-EU) - based on locale');
    return 'en-EU';
  }

  // Default to USD for US and other regions
  console.log('Detected currency: US Dollar (en-US) - default');
  return 'en-US';
}

/**
 * Gets currency configuration by key
 */
export function getCurrencyConfig(currencyKey: string): CurrencyConfig {
  return CURRENCY_CONFIGS[currencyKey] || CURRENCY_CONFIGS['en-US'];
}

/**
 * Calculates pricing data for a given currency
 */
export function calculatePricing(currencyKey?: string): PricingData {
  // If no currency specified, detect automatically
  const detectedCurrency = currencyKey || detectUserCurrency();
  const config = getCurrencyConfig(detectedCurrency);
  
  const discount = Math.round(((config.originalPrice - config.discountedPrice) / config.originalPrice) * 100);
  
  return {
    originalPrice: config.originalPrice,
    discountedPrice: config.discountedPrice,
    discount,
    currency: config.currency,
    currencySymbol: config.currencySymbol,
    locale: config.locale
  };
}

/**
 * Formats price with proper currency symbol and locale
 */
export function formatPrice(amount: number, currencyData: PricingData): string {
  try {
    return new Intl.NumberFormat(currencyData.locale, {
      style: 'currency',
      currency: currencyData.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    // Fallback to simple formatting
    return `${currencyData.currencySymbol}${amount}`;
  }
}

/**
 * Gets all available currency options for manual selection
 */
export function getAvailableCurrencies(): Array<{ key: string; label: string; config: CurrencyConfig }> {
  return [
    { 
      key: 'pt-BR', 
      label: 'Brazil (R$ Real)', 
      config: CURRENCY_CONFIGS['pt-BR'] 
    },
    { 
      key: 'en-US', 
      label: 'United States ($ Dollar)', 
      config: CURRENCY_CONFIGS['en-US'] 
    },
    { 
      key: 'en-EU', 
      label: 'Europe (€ Euro)', 
      config: CURRENCY_CONFIGS['en-EU'] 
    },
    { 
      key: 'en-IN', 
      label: 'India (₹ Rupee)', 
      config: CURRENCY_CONFIGS['en-IN'] 
    }
  ];
}
