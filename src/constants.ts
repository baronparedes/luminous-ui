import {Period, ProfileType, RecordStatus} from './Api';

export const STATUS_COLORS = {
  active: 'text-success',
  inactive: 'text-danger',
};

export const RECORD_STATUS: RecordStatus[] = ['active', 'inactive'];
export const PROFILE_TYPE: ProfileType[] = [
  'unit owner',
  'stakeholder',
  'admin',
];

export const SETTING_KEYS = {
  SOA_NOTES: 'SOA_NOTES',
  BILLING_CUTOFF_DAY: 'BILLING_CUTOFF_DAY',
};

export const DEFAULTS = {
  BILLING_CUTOFF_DAY: 30,
  WATER_CHARGE_ID: 6,
};

export const VERBIAGE = {
  SOA: {
    DOC_TITLE: (propertyCode: string | undefined, period: Period) =>
      `${propertyCode ?? 'Unit'} - SOA - ${period.year} ${period.month}`,
  },
};
