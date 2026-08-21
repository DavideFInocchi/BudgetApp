// src/utils/currency.js

export function formatCurrency(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value ?? 0);
}

export function roundCurrency(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}