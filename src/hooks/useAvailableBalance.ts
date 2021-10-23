import {useEffect, useState} from 'react';

import {sum} from '../@utils/helpers';
import {useGetAllCollectedCharges} from '../Api';

export function useAvailableBalance() {
  const [availableBalance, setAvailableBalance] = useState<number>();
  const {data, loading, error} = useGetAllCollectedCharges({});

  useEffect(() => {
    if (!data) {
      setAvailableBalance(undefined);
    }
    const balance = data?.filter(d => !d.charge.passOn).map(d => d.amount);
    setAvailableBalance(sum(balance));
  }, [data]);

  return {
    data: availableBalance,
    loading,
    error,
  };
}
