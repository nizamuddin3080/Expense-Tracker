import Decimal from 'decimal.js';

// Configure Decimal.js for financial calculations
Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_UP,
});

/**
 * Creates a Decimal from various input types safely.
 * NEVER use parseFloat or Number() for money.
 */
export function toDecimal(value: string | number | Decimal | { toString(): string }): Decimal {
  return new Decimal(value.toString());
}

/** Add two monetary values */
export function addMoney(a: string | number | Decimal, b: string | number | Decimal): Decimal {
  return toDecimal(a).plus(toDecimal(b));
}

/** Subtract monetary values: a - b */
export function subtractMoney(a: string | number | Decimal, b: string | number | Decimal): Decimal {
  return toDecimal(a).minus(toDecimal(b));
}

/** Multiply money by a factor (e.g., tax rate, quantity) */
export function multiplyMoney(amount: string | number | Decimal, factor: string | number | Decimal): Decimal {
  return toDecimal(amount).times(toDecimal(factor));
}

/** Divide money with safe rounding */
export function divideMoney(amount: string | number | Decimal, divisor: string | number | Decimal): Decimal {
  return toDecimal(amount).dividedBy(toDecimal(divisor));
}

/** Round to 2 decimal places for storage */
export function roundMoney(value: Decimal): Decimal {
  return value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
}

/** Check if a value is zero */
export function isZero(value: string | number | Decimal): boolean {
  return toDecimal(value).isZero();
}

/** Check if a value is positive */
export function isPositive(value: string | number | Decimal): boolean {
  return toDecimal(value).isPositive() && !toDecimal(value).isZero();
}

/** Check if a value is negative */
export function isNegative(value: string | number | Decimal): boolean {
  return toDecimal(value).isNegative();
}

/** Sum an array of monetary values */
export function sumMoney(values: (string | number | Decimal)[]): Decimal {
  return values.reduce<Decimal>((acc, val) => acc.plus(toDecimal(val)), new Decimal(0));
}

/** Compare two money values: returns -1, 0, or 1 */
export function compareMoney(a: string | number | Decimal, b: string | number | Decimal): number {
  return toDecimal(a).comparedTo(toDecimal(b));
}

/** Calculate percentage: (part / total) * 100 */
export function percentOf(part: string | number | Decimal, total: string | number | Decimal): Decimal {
  const totalDec = toDecimal(total);
  if (totalDec.isZero()) return new Decimal(0);
  return toDecimal(part).dividedBy(totalDec).times(100).toDecimalPlaces(1);
}

/** Convert Decimal to string for storage/transport */
export function moneyToString(value: Decimal): string {
  return value.toFixed(2);
}
