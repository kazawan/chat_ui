const path = require('path');
const fs = require('fs');
const db = require('./database');
const User = require('./models/User');
const ChatSession = require('./models/ChatSession');
const ChatMessage = require('./models/ChatMessage');

// 数据库初始化函数
async function initializeDatabase() {
  const dbPath = path.join(__dirname, '..', 'data');
  const dbFile = path.join(dbPath, 'database.sqlite');

  // 检查数据目录是否存在，不存在则创建
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  // 检查数据库文件是否存在
  const dbExists = fs.existsSync(dbFile);

  try {
    // 确保数据库连接
    await db.authenticate();
    console.log('数据库连接成功');

    if (!dbExists) {
      // 如果数据库不存在，创建所有表
      console.log('正在初始化数据库...');
      await db.sync({ force: true });
      console.log('数据库初始化完成');
    } else {
      // 如果数据库已存在，仅同步模型（不强制重建表）
      try {
        await db.sync({ alter: false });
        console.log('数据库模型同步完成');
      } catch (syncError) {
        console.error('同步模型时出错，尝试不修改现有表:', syncError);
        // 如果同步失败，尝试不修改现有表结构
        await db.sync({ alter: false });
      }
    }

    // 验证模型是否正确加载
    console.log('已加载的模型:');
    console.log('User:', !!db.models.User);
    console.log('ChatSession:', !!db.models.ChatSession);
    console.log('ChatMessage:', !!db.models.ChatMessage);

  } catch (error) {
    console.error('数据库初始化失败:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('唯一约束冲突，请检查数据完整性');
    }
    throw error;
  }
}

// 导出初始化函数
module.exports = initializeDatabase; 