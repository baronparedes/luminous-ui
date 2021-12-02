import {Month, Period, ProfileType, RecordStatus} from './Api';

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
  PR_NOTES: 'PR_NOTES',
  BILLING_CUTOFF_DAY: 'BILLING_CUTOFF_DAY',
};

export const DEFAULTS = {
  COMMUNITY_ID: 1,
  BILLING_CUTOFF_DAY: 30,
  WATER_CHARGE_ID: 6,
  COMMUNITY_EXPENSE: 'COMMUNITY EXPENSE',
  COMMUNITY_CHARGE_ID: 1,
};

export const VERBIAGE = {
  FILE_NAMES: {
    SOA_DOC_TITLE: (propertyCode: string | undefined, period: Period) =>
      `${propertyCode ?? 'Unit'} - SOA - ${period.year} ${period.month}`,
    PAYMENT_HISTORY_DOC_TITLE: (
      propertyCode: string | undefined,
      year: number
    ) => `${propertyCode ?? 'Unit'} - Payment History - ${year}`,
  },
};

export const MONTHS: Month[] = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];
