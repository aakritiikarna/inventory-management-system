import { createContext, useContext, useState } from "react";
import { BASE_CURRENCY, CURRENCIES, convertAndFormat } from "../data/currencyConfig";

const CurrencyContext = createContext(null);

/**
 * App-wide currency selection, mirroring how ThemeContext handles dark
 * mode: one piece of state, persisted to localStorage, read by every
 * screen that displays a monetary value. All stored amounts are USD —
 * this context only controls how they're *displayed*.
 */
export const CurrencyProvider = ({ children }) => {
  const [currencyCode, setCurrencyCodeState] = useState(() => {
    const stored = localStorage.getItem("currency");
    return stored && CURRENCIES[stored] ? stored : BASE_CURRENCY;
  });

  const setCurrencyCode = (code) => {
    if (!CURRENCIES[code]) return;
    setCurrencyCodeState(code);
    localStorage.setItem("currency", code);
  };

  // The one function every screen should use instead of its own
  // `${value}` / currency() helper.
  const formatMoney = (amountUsd) => convertAndFormat(amountUsd, currencyCode);

  return (
    <CurrencyContext.Provider
      value={{
        currencyCode,
        setCurrencyCode,
        currency: CURRENCIES[currencyCode],
        formatMoney,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }
  return context;
};
