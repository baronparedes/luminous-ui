import {useEffect, useState} from 'react';

import {sum} from '../@utils/helpers';
import {useGetAllCollectedCharges, useGetDisbursementBreakdown} from '../Api';

type ChargeBalance = {
  chargeId: number;
  code: string;
  balance: number;
};

export function usePassOnBalance() {
  const [availableBalance, setAvailableBalance] = useState<ChargeBalance[]>([]);
  const {
    data: charges,
    loading: loadingCharges,
    refetch,
  } = useGetAllCollectedCharges({});
  const {data: disbursements, loading: loadingDisbursement} =
    useGetDisbursementBreakdown({});

  useEffect(() => {
    const chargeBalances = charges
      ?.filter(c => c.charge.passOn)
      .map(c => {
        const disbursementAmounts = disbursements
          ?.filter(d => d.code === c.charge.code)
          .map(d => d.amount);
        const result: ChargeBalance = {
          chargeId: Number(c.charge.id),
          code: c.charge.code,
          balance: c.amount - sum(disbursementAmounts),
        };
        return result;
      });

    setAvailableBalance(chargeBalances ?? []);
  }, [charges, disbursements]);

  return {
    data: availableBalance,
    loading: loadingCharges || loadingDisbursement,
    refetch,
  };
}
