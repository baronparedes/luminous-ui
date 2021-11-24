const routes = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROPERTY: (id?: string | number) => `/property/${id}`,
  VOUCHER: (id?: string | number) => `/voucher/${id}`,
  EXPENSE: '/expense',
  EXPENSE_REQUESTS: '/expense/requests',
  EXPENSE_DISBURSEMENTS: '/expense/disbursements',
  ADMIN: '/admin',
  ADMIN_PROFILES: '/admin/profiles',
  ADMIN_PROPERTIES: '/admin/properties',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_BATCH_TRANSACTIONS: '/admin/batch-transactions',
  ADMIN_BATCH_PRINT_SOA: '/admin/batch-print-soa',
  ADMIN_UPLOAD_WATER_READING: '/admin/upload-water-reading',
};

export default routes;
