require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'cat',
  nodeEnv: process.env.NODE_ENV || 'development',
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseUrl: process.env.DEEPSEEK_BASE_URL
  },
  db: {
    path: process.env.DB_PATH || 'data/database.sqlite'
  }
}; 