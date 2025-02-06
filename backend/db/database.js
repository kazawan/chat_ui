const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DB {
  constructor() {
    this.dbPath = path.resolve(__dirname, '..', 'data', 'database.sqlite');
    this.db = null;
  }

  connect() {
    if (this.db) return; // 如果已经连接，则直接返回
    
    try {
      // 确保数据目录存在
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      this.db = new Database(this.dbPath);
      
      // 启用外键约束
      this.db.pragma('foreign_keys = ON');
    } catch (error) {
      console.error('连接数据库失败:', error);
      throw error;
    }
  }

  prepare(sql) {
    if (!this.db) this.connect();
    return this.db.prepare(sql);
  }

  transaction(cb) {
    if (!this.db) this.connect();
    return this.db.transaction(cb);
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

module.exports = new DB();