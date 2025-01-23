const path = require('path');
const fs = require('fs');
const db = require('./database');

// 数据库初始化SQL语句
const initSQL = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    lastMessageTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sessionId INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sessionId) REFERENCES chat_sessions(id) ON DELETE CASCADE
  );`
];

function initializeDatabase() {
  try {
    // 确保数据目录存在
    const dataDir = path.resolve(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('创建数据目录:', dataDir);
    }

    // 连接数据库
    db.connect();
    console.log('数据库文件位置:', db.dbPath);

    // 在一个事务中执行所有建表语句
    const initDb = db.transaction(() => {
      for (const sql of initSQL) {
        db.prepare(sql).run();
        console.log('执行SQL成功:', sql.substring(0, 50) + '...');
      }
    });

    initDb();
    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

module.exports = initializeDatabase;