import { CurrencyConfig } from '../types';

export function formatPrice(amountInBaseCurrency: number, currency: CurrencyConfig): string {
  const converted = Math.round(amountInBaseCurrency * currency.rate);
  const locale = currency.code === 'INR' ? 'en-IN' : 'en-US';
  return `${currency.symbol}${converted.toLocaleString(locale)}`;
}

export function formatRawAmount(amountInTargetCurrency: number, currency: CurrencyConfig): string {
  const locale = currency.code === 'INR' ? 'en-IN' : 'en-US';
  return `${currency.symbol}${Math.round(amountInTargetCurrency).toLocaleString(locale)}`;
}
