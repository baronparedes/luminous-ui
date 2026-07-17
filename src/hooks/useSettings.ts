import {DEFAULTS, SETTING_KEYS} from '../config';
import {useRootState} from '../store';

export type ChargeIds = {
  waterChargeId?: number;
  communityChargeId?: number;
  commonChargeId?: number;
};

export type Settings = {
  minApprovers: number;
  chargeIds: ChargeIds;
  billingCutoffDay: number;
  loading: boolean;
};

export function useSettings(): Settings {
  const settings = useRootState(state => state.setting.values);

  // Helper function to parse integer setting with fallback
  const getIntegerSetting = (key: string, defaultValue: number): number => {
    const setting = settings.find(s => s.key === key);
    if (setting?.value) {
      const parsed = parseInt(setting.value, 10);
      return !isNaN(parsed) ? parsed : defaultValue;
    }
    return defaultValue;
  };

  const getOptionalIntegerSetting = (key: string): number | undefined => {
    const setting = settings.find(s => s.key === key);
    if (!setting?.value) {
      return undefined;
    }

    const parsed = parseInt(setting.value, 10);
    return isNaN(parsed) ? undefined : parsed;
  };

  const waterChargeId = getOptionalIntegerSetting(SETTING_KEYS.WATER_CHARGE_ID);
  const communityChargeId = getOptionalIntegerSetting(
    SETTING_KEYS.COMMUNITY_CHARGE_ID
  );
  const commonChargeId = getOptionalIntegerSetting(
    SETTING_KEYS.COMMON_CHARGE_ID
  );
  // Keeps existing behavior: settings are considered loading until the first values arrive.
  const loading = settings.length === 0;

  return {
    minApprovers: getIntegerSetting(
      SETTING_KEYS.MIN_APPROVERS,
      DEFAULTS.MIN_APPROVERS
    ),
    chargeIds: {
      waterChargeId,
      communityChargeId,
      commonChargeId,
    },
    billingCutoffDay: getIntegerSetting(
      SETTING_KEYS.BILLING_CUTOFF_DAY,
      DEFAULTS.BILLING_CUTOFF_DAY
    ),
    loading,
  };
}
