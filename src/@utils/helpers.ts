import {TransactionAttr} from '../Api';

export function generateNumberedSeries(n: number): number[] {
  return Array(n)
    .fill(0)
    .map((_, i) => i + 1);
}

export function sum(numbers: number[] | undefined) {
  if (!numbers || numbers.length === 0) return 0;
  return numbers.reduce((p, c) => Number(p) + Number(c));
}

export function sumTransactions(transactions: TransactionAttr[] | undefined) {
  if (!transactions || transactions.length === 0) return 0;
  const charged = transactions
    .filter(t => t.transactionType === 'charged')
    .map(t => t.amount);
  const collected = transactions
    .filter(t => t.transactionType === 'collected')
    .map(t => t.amount);
  return sum(charged) - sum(collected);
}
