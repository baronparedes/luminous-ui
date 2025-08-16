import {useEffect, useState} from 'react';

import {DEFAULTS, SETTING_KEYS} from '../constants';
import {useRootState} from '../store';

export type ChargeIds = {
  waterChargeId?: number;
  communityChargeId?: number;
};

export type Settings = {
  minApprovers: number;
  chargeIds: ChargeIds;
  billingCutoffDay: number;
  loading: boolean;
};

export function useSettings(): Settings {
  const [waterChargeId, setWaterChargeId] = useState<number>();
  const [communityChargeId, setCommunityChargeId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);

  const settings = useRootState(state => state.setting.values);

  // Helper function to parse integer setting with fallback
  const getIntegerSetting = (key: string, defaultValue: number): number => {
    const setting = settings.find(s => s.key === key);
    if (setting?.value) {
      const parsed = parseInt(setting.value);
      return !isNaN(parsed) ? parsed : defaultValue;
    }
    return defaultValue;
  };

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
    minApprovers: getIntegerSetting(
      SETTING_KEYS.MIN_APPROVERS,
      DEFAULTS.MIN_APPROVERS
    ),
    chargeIds: {
      waterChargeId,
      communityChargeId,
    },
    billingCutoffDay: getIntegerSetting(
      SETTING_KEYS.BILLING_CUTOFF_DAY,
      DEFAULTS.BILLING_CUTOFF_DAY
    ),
    loading,
  };
}
