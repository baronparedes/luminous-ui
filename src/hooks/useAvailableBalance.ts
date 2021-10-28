import {useEffect, useState} from 'react';

import {sum} from '../@utils/helpers';
import {useGetAllCollectedCharges, useGetDisbursementBreakdown} from '../Api';

export function useAvailableBalance() {
  const [availableBalance, setAvailableBalance] = useState<number>();
  const {data: charges, loading: loadingCharges} = useGetAllCollectedCharges(
    {}
  );
  const {data: disbursements, loading: loadingDisbursement} =
    useGetDisbursementBreakdown({});

  useEffect(() => {
    if (!charges && !disbursements) {
      setAvailableBalance(undefined);
    }

    const chargesAmounts = charges
      ?.filter(d => !d.charge.passOn)
      .map(d => d.amount);

    const disbursementAmounts = disbursements
      ?.filter(d => d.code === 'COMMUNITY EXPENSE')
      .map(d => d.amount);

    setAvailableBalance(sum(chargesAmounts) - sum(disbursementAmounts));
  }, [charges, disbursements]);

  return {
    data: availableBalance,
    loading: loadingCharges || loadingDisbursement,
  };
}
