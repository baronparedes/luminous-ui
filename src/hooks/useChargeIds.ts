import {useEffect, useState} from 'react';

import {SETTING_KEYS} from '../constants';
import {useRootState} from '../store';

export type ChargeIds = {
  waterChargeId?: number;
  communityChargeId?: number;
  loading: boolean;
};

export function useChargeIds(): ChargeIds {
  const [waterChargeId, setWaterChargeId] = useState<number>();
  const [communityChargeId, setCommunityChargeId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);

  const settings = useRootState(state => state.setting.values);

  useEffect(() => {
    const waterChargeIdSetting = settings.find(
      s => s.key === SETTING_KEYS.WATER_CHARGE_ID
    );
    const communityChargeIdSetting = settings.find(
      s => s.key === SETTING_KEYS.COMMUNITY_CHARGE_ID
    );

    if (waterChargeIdSetting) {
      const parsedValue = parseInt(waterChargeIdSetting.value);
      if (!isNaN(parsedValue)) {
        setWaterChargeId(parsedValue);
      }
    }

    if (communityChargeIdSetting) {
      const parsedValue = parseInt(communityChargeIdSetting.value);
      if (!isNaN(parsedValue)) {
        setCommunityChargeId(parsedValue);
      }
    }

    // If settings are loaded (array has items), we're not loading anymore
    setLoading(settings.length === 0);
  }, [settings]);

  return {
    waterChargeId,
    communityChargeId,
    loading,
  };
}
