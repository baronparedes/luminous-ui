import {ProfileAttr, PropertyAccount, TransactionAttr} from '../Api';

export function generateNumberedSeries(n: number): number[] {
  return Array(n)
    .fill(0)
    .map((_, i) => i + 1);
}

export function sum(numbers: number[] | undefined) {
  if (!numbers || numbers.length === 0) return 0;
  return numbers.reduce((p, c) => Number(p) + Number(c));
}

export function calculateAccount(propertyAccount: PropertyAccount) {
  const {balance, transactions} = propertyAccount;
  const currentBalance = sum(
    transactions
      ?.filter(t => t.transactionType === 'charged')
      .map(t => t.amount)
  );
  const collectionBalance = sum(
    transactions
      ?.filter(t => t.transactionType === 'collected')
      .map(t => t.amount)
  );
  const totalAmountDue = currentBalance - collectionBalance;
  const previousBalance = balance - totalAmountDue;
  return {
    previousBalance,
    currentBalance,
    collectionBalance,
    totalAmountDue,
  };
}

export function sanitizeTransaction(transaction: TransactionAttr) {
  const cleaned: TransactionAttr = {
    ...transaction,
    charge: undefined,
    paymentDetailId: transaction.paymentDetailId ?? undefined,
    comments: transaction.comments ?? undefined,
    rateSnapshot: transaction.rateSnapshot ?? undefined,
  };
  return cleaned;
}

export function compareTransaction(a: TransactionAttr, b: TransactionAttr) {
  const nameA = a.property?.code as string;
  const nameB = b.property?.code as string;
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

export function getNames(profiles?: ProfileAttr[]) {
  const assignedTo = (profiles && profiles.map(a => a.name)) ?? [];
  return assignedTo.sort().join(', ');
}
