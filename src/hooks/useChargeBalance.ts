import {useEffect, useState} from 'react';

import {sum} from '../@utils/helpers';
import {useGetAllCollectedCharges, useGetDisbursementBreakdown} from '../Api';
import {DEFAULTS} from '../constants';

export type ChargeBalance = {
  chargeId: number;
  code: string;
  balance: number;
};

export function useChargeBalance() {
  const [availableBalances, setAvailableBalances] = useState<ChargeBalance[]>(
    []
  );
  const [availableCommunityBalance, setAvailableCommunityBalance] =
    useState<ChargeBalance>({
      chargeId: DEFAULTS.COMMUNITY_CHARGE_ID,
      code: DEFAULTS.COMMUNITY_EXPENSE,
      balance: 0,
    });
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

    setAvailableBalances(chargeBalances ?? []);
  }, [charges, disbursements]);

  useEffect(() => {
    const chargesAmounts = charges
      ?.filter(d => !d.charge.passOn)
      .map(d => d.amount);
    const disbursementAmounts = disbursements
      ?.filter(d => !d.passOn)
      .map(d => d.amount);
    const communityBalance = sum(chargesAmounts) - sum(disbursementAmounts);
    setAvailableCommunityBalance(state => {
      return {
        ...state,
        balance: communityBalance,
      };
    });
  }, [charges, disbursements]);

  return {
    availableBalances,
    availableCommunityBalance,
    loading: loadingCharges || loadingDisbursement,
    refetch,
  };
}
