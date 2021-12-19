const config = {
  NODE_ENV: process.env.NODE_ENV,
  IS_PROD: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
  IS_DEV: process.env.NODE_ENV === 'development',
  API_URI: process.env.REACT_APP_API_URI ?? 'http://localhost:3001',
  BRAND: process.env.REACT_APP_BRAND ?? 'Luminous',
};

export default config;
