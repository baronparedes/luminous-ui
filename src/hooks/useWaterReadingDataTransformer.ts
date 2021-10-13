import {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

import {toTransactionPeriod} from '../@utils/dates';
import {ChargeAttr, Period, PropertyAttr, TransactionAttr} from '../Api';
import {DEFAULTS} from '../constants';
import {WaterReadingData} from './useWaterReadingFile';

export function useWaterReadingDataTransformer(
  data: WaterReadingData[],
  charges?: ChargeAttr[] | null,
  properties?: PropertyAttr[] | null,
  period?: Period
) {
  const batchId = uuidv4();
  const [error, setError] = useState<string>();
  const [parseErrors, setParseErrors] = useState<string[]>([]);
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
        if (item) {
          const transactionPeriod = toTransactionPeriod(
            period.year,
            period.month
          ).toISOString();
          const usage =
            Number(item.presentReading) - Number(item.previousReading);
          const amount = Number(item.rate) * usage;
          const chargeComments = {
            previousReading: item.previousReading,
            presentReading: item.presentReading,
            usage,
          };
          const transaction: TransactionAttr = {
            chargeId: Number(charge?.id),
            propertyId: Number(property.id),
            amount,
            transactionPeriod,
            transactionType: 'charged',
            rateSnapshot: Number(item.rate),
            comments: JSON.stringify(chargeComments),
            charge,
            property,
            batchId,
          };
          result.push(transaction);
        } else {
          errors.push(property.code);
        }
      }
      setTransactions(result);
      setParseErrors(errors);
    } else {
      setTransactions([]);
      setParseErrors([]);
    }
  }, [
    JSON.stringify(properties?.map(p => p.id)),
    period,
    charge,
    JSON.stringify(data.map(d => d.unitNumber)),
  ]);

  return {
    charge,
    transactions,
    parseErrors,
    error,
  };
}
