const routes = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROPERTY: (id?: string | number) => `/property/${id}`,
  ADMIN: '/admin',
  ADMIN_PROFILES: '/admin/profiles',
  ADMIN_PROPERTIES: '/admin/properties',
};

export default routes;
