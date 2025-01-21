module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
    model: 'deepseek-chat'
  },
  // 其他配置项...
}; 