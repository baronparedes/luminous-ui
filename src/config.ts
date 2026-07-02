import {Month, Period, ProfileType, RecordStatus} from './Api';

const parseInteger = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const APP_CONFIG = {
  environment: {
    nodeEnv: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
  },
  app: {
    brandName: process.env.REACT_APP_BRAND ?? 'Luminous',
  },
  api: {
    baseUrl: process.env.REACT_APP_API_URI ?? 'http://localhost:3001',
    unauthorizedStatusCode: 401,
  },
  search: {
    debounceMs: parseInteger(process.env.REACT_APP_SEARCH_DEBOUNCE_MS, 300),
  },
  dashboard: {
    yearsToDisplay: parseInteger(process.env.REACT_APP_DASHBOARD_YEARS, 5),
  },
  history: {
    yearsToDisplay: parseInteger(process.env.REACT_APP_HISTORY_YEARS, 3),
  },
  processing: {
    yearsToDisplay: parseInteger(process.env.REACT_APP_PROCESS_YEARS, 2),
  },
  settings: {
    keys: {
      soaNotes: 'SOA_NOTES',
      purchaseRequestNotes: 'PR_NOTES',
      billingCutoffDay: 'BILLING_CUTOFF_DAY',
      waterChargeId: 'WATER_CHARGE_ID',
      communityChargeId: 'COMMUNITY_CHARGE_ID',
      commonChargeId: 'COMMON_CHARGE_ID',
      minimumApprovers: 'MIN_APPROVERS',
      emailBatchLimit: 'EMAIL_BATCH_LIMIT',
    },
    defaults: {
      communityId: 1,
      billingCutoffDay: 30,
      communityExpenseCategoryName: 'COMMUNITY EXPENSE',
      chartMargin: 15,
      minimumApprovers: 3,
      emailBatchLimit: 400,
    },
    constraints: {
      emailBatchLimit: {
        min: 1,
        max: parseInteger(process.env.REACT_APP_EMAIL_BATCH_LIMIT_MAX, 1000),
      },
    },
  },
  profile: {
    availableStatuses: ['active', 'inactive'] as RecordStatus[],
    availableTypes: ['unit owner', 'stakeholder', 'admin'] as ProfileType[],
  },
  ui: {
    statusColors: {
      active: 'text-success',
      inactive: 'text-danger',
    },
    statusVariants: {
      pending: 'primary',
      rejected: 'danger',
      cancelled: 'warning',
      approved: 'success',
    },
    propertyBalanceThreshold: parseInteger(
      process.env.REACT_APP_PROPERTY_BALANCE_THRESHOLD,
      15000
    ),
  },
  dates: {
    months: [
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
    ] as Month[],
  },
  verbiage: {
    fileNames: {
      statementOfAccount: (propertyCode: string | undefined, period: Period) =>
        `${propertyCode ?? 'Unit'} - SOA - ${period.year} ${period.month}`,
      paymentHistory: (propertyCode: string | undefined, year: number) =>
        `${propertyCode ?? 'Unit'} - Payment History - ${year}`,
      transactionHistory: (propertyCode: string | undefined, year: number) =>
        `${propertyCode ?? 'Unit'} - Transaction History - ${year}`,
      expenseOverRevenue: (year: number, month: Month) =>
        `Expense over Revenue - ${year} ${month}`,
    },
  },
};

export const STATUS_COLORS = APP_CONFIG.ui.statusColors;
export const RECORD_STATUS = APP_CONFIG.profile.availableStatuses;
export const PROFILE_TYPE = APP_CONFIG.profile.availableTypes;

export const SETTING_KEYS = {
  SOA_NOTES: APP_CONFIG.settings.keys.soaNotes,
  PR_NOTES: APP_CONFIG.settings.keys.purchaseRequestNotes,
  BILLING_CUTOFF_DAY: APP_CONFIG.settings.keys.billingCutoffDay,
  WATER_CHARGE_ID: APP_CONFIG.settings.keys.waterChargeId,
  COMMUNITY_CHARGE_ID: APP_CONFIG.settings.keys.communityChargeId,
  COMMON_CHARGE_ID: APP_CONFIG.settings.keys.commonChargeId,
  MIN_APPROVERS: APP_CONFIG.settings.keys.minimumApprovers,
  EMAIL_BATCH_LIMIT: APP_CONFIG.settings.keys.emailBatchLimit,
};

export const DEFAULTS = {
  COMMUNITY_ID: APP_CONFIG.settings.defaults.communityId,
  BILLING_CUTOFF_DAY: APP_CONFIG.settings.defaults.billingCutoffDay,
  COMMUNITY_EXPENSE: APP_CONFIG.settings.defaults.communityExpenseCategoryName,
  CHART_MARGIN: APP_CONFIG.settings.defaults.chartMargin,
  MIN_APPROVERS: APP_CONFIG.settings.defaults.minimumApprovers,
  EMAIL_BATCH_LIMIT: APP_CONFIG.settings.defaults.emailBatchLimit,
};

export const VERBIAGE = {
  FILE_NAMES: {
    SOA_DOC_TITLE: APP_CONFIG.verbiage.fileNames.statementOfAccount,
    PAYMENT_HISTORY_DOC_TITLE: APP_CONFIG.verbiage.fileNames.paymentHistory,
    TRANSACTION_HISTORY_DOC_TITLE:
      APP_CONFIG.verbiage.fileNames.transactionHistory,
    EXPENSE_OVER_REVENUE: APP_CONFIG.verbiage.fileNames.expenseOverRevenue,
  },
};

export const MONTHS = APP_CONFIG.dates.months;

export const STATUS_VARIANT = APP_CONFIG.ui.statusVariants;

const config = {
  NODE_ENV: APP_CONFIG.environment.nodeEnv,
  IS_PROD: APP_CONFIG.environment.isProduction,
  IS_TEST: APP_CONFIG.environment.isTest,
  IS_DEV: APP_CONFIG.environment.isDevelopment,
  API_URI: APP_CONFIG.api.baseUrl,
  BRAND: APP_CONFIG.app.brandName,
  DASHBOARD_YEARS: APP_CONFIG.dashboard.yearsToDisplay,
  HISTORY_YEARS: APP_CONFIG.history.yearsToDisplay,
  PROCESS_YEARS: APP_CONFIG.processing.yearsToDisplay,
  SEARCH_DEBOUNCE_MS: APP_CONFIG.search.debounceMs,
  UNAUTHORIZED_STATUS_CODE: APP_CONFIG.api.unauthorizedStatusCode,
  PROPERTY_BALANCE_THRESHOLD: APP_CONFIG.ui.propertyBalanceThreshold,
  EMAIL_BATCH_LIMIT_MAX: APP_CONFIG.settings.constraints.emailBatchLimit.max,
};

export default config;
