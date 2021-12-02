const routes = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROPERTY: (id?: string | number) => `/property/${id}`,
  VOUCHER: (id?: string | number) => `/voucher/${id}`,
  PURCHASE_REQUEST: (id?: string | number) => `/purchase-request/${id}`,
  PURCHASE_ORDER: (id?: string | number) => `/purchase-order/${id}`,
  EXPENSE: '/expense',
  EXPENSE_REQUESTS: '/expense/requests',
  EXPENSE_ORDERS: '/expense/orders',
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
