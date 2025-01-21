const db = require('./database');
const User = require('./models/User');
const ChatSession = require('./models/ChatSession');
const ChatMessage = require('./models/ChatMessage');

async function initializeDatabase() {
  try {
    // 创建所有表
    await User.createTable();
    await ChatSession.createTable();
    await ChatMessage.createTable();
    
    console.log('数据库表创建成功');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  } finally {
    db.close();
  }
}

initializeDatabase();