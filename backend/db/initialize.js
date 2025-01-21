const path = require('path');
const fs = require('fs');
const db = require('./database');
const User = require('./models/User');

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

    // 同步所有模型到数据库
    console.log('正在同步数据库模型...');
    await db.sync({ alter: true }); // 使用 alter 而不是 force 来保留数据
    console.log('数据库模型同步完成');

    if (!dbExists) {
      console.log('数据库初始化完成');
    } else {
      console.log('数据库已存在，完成同步');
    }
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

module.exports = initializeDatabase; 