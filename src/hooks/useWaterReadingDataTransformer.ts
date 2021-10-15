import {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

import {toTransactionPeriod} from '../@utils/dates';
import {ChargeAttr, Period, PropertyAttr, TransactionAttr} from '../Api';
import {DEFAULTS} from '../constants';
import {WaterReadingData} from './useWaterReadingFile';

function toTransaction(
  data: WaterReadingData,
  property: PropertyAttr,
  charge: ChargeAttr,
  period: Period,
  batchId: string
) {
  const transactionPeriod = toTransactionPeriod(
    period.year,
    period.month
  ).toISOString();
  const usage = Number(data.presentReading) - Number(data.previousReading);
  const amount = Number(data.rate) * usage;
  const chargeComments = {
    previousReading: data.previousReading,
    presentReading: data.presentReading,
    usage,
  };
  const transaction: TransactionAttr = {
    chargeId: Number(charge?.id),
    propertyId: Number(property.id),
    amount,
    transactionPeriod,
    transactionType: 'charged',
    rateSnapshot: Number(data.rate),
    comments: JSON.stringify(chargeComments),
    charge,
    property,
    batchId,
  };

  return transaction;
}

function getMismatch(
  properties: PropertyAttr[] | null,
  data: WaterReadingData[]
) {
  const masterlist = properties?.map(p => p.code) ?? [];
  const mismatch = data
    .filter(d => d.unitNumber && !masterlist.includes(d.unitNumber))
    .map(d => d.unitNumber as string);
  return mismatch;
}

export function useWaterReadingDataTransformer(
  data: WaterReadingData[],
  charges?: ChargeAttr[] | null,
  properties?: PropertyAttr[] | null,
  period?: Period
) {
  const batchId = uuidv4();
  const [error, setError] = useState<string>();
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [parseMismatch, setParseMismatch] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<TransactionAttr[]>([]);
  const [charge, setCharge] = useState<ChargeAttr>();

  useEffect(() => {
    const targetCharge = charges?.find(c => c.id === DEFAULTS.WATER_CHARGE_ID);
    setCharge(targetCharge);
  }, [JSON.stringify(charges?.map(p => p.id))]);

  useEffect(() => {
    if (charge === undefined) {
      setError('unable to locate charge for water utility');
    } else {
      setError(undefined);
    }
  }, [charge]);

  useEffect(() => {
    if (charge && properties && period && data.length > 0) {
      const errors: string[] = [];
      const result: TransactionAttr[] = [];
      for (const property of properties) {
        const item = data.find(d => d.unitNumber === property.code);
        if (!item) {
          errors.push(property.code);
          continue;
        }
        const transaction = toTransaction(
          item,
          property,
          charge,
          period,
          batchId
        );
        result.push(transaction);
      }
      setTransactions(result);
      setParseErrors(errors);
      setParseMismatch(getMismatch(properties, data));
    } else {
      setTransactions([]);
      setParseErrors([]);
      setParseMismatch([]);
    }
  }, [
    JSON.stringify(properties?.map(p => p.id)),
    JSON.stringify(data.map(d => d.unitNumber)),
    charge,
    period,
  ]);

  return {
    charge,
    transactions,
    parseErrors,
    parseMismatch,
    error,
  };
}
