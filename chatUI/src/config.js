const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  apiBaseUrl: isDevelopment ? 'http://localhost:3001' : '/api',
  // 其他配置项...
};

export default config; 