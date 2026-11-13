// ============================================================
// CURRENCY CONFIGURATION
// ------------------------------------------------------------
// All monetary values stored in the app (product prices, order totals,
// dashboard revenue figures, etc.) are in USD — that's the backend's
// base currency. These are FIXED, dummy exchange rates for display
// purposes only — there's no live-rate API call here.
//
// To wire this up to a real exchange-rate API later: replace the
// hardcoded `rate` values below with numbers fetched from that API
// (e.g. on an interval, or once at app load), while keeping this same
// shape ({ code, label, symbol, rate }) so CurrencyContext and every
// screen that calls formatMoney() keep working without changes.
// ============================================================

export const BASE_CURRENCY = "USD";

export const CURRENCIES = {
  USD: { code: "USD", label: "US Dollar", symbol: "$", rate: 1 },
  NPR: { code: "NPR", label: "Nepalese Rupee", symbol: "Rs ", rate: 133.5 },
  INR: { code: "INR", label: "Indian Rupee", symbol: "₹", rate: 83.2 },
  EUR: { code: "EUR", label: "Euro", symbol: "€", rate: 0.92 },
};

export const CURRENCY_LIST = Object.values(CURRENCIES);

/**
 * Converts a USD amount into the target currency and formats it with
 * the right symbol — e.g. convertAndFormat(100, "NPR") -> "Rs 13,350".
 * Falls back to USD if an unknown code is passed in.
 */
export const convertAndFormat = (amountUsd, currencyCode) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES[BASE_CURRENCY];
  const amount = Number(amountUsd) || 0;
  const converted = amount * currency.rate;

  // Whole numbers for larger currencies (NPR/INR rates inflate small USD
  // amounts into numbers where cents aren't meaningful); keep 2 decimals
  // for USD/EUR where cents are the norm.
  const decimals = currency.code === "NPR" || currency.code === "INR" ? 0 : 2;

  return `${currency.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};
