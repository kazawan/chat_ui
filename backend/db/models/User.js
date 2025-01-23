const db = require('../database');
const bcrypt = require('bcryptjs');

class User {
  static create({ username, email, password }) {
    // 加密密码
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const sql = `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `;
    const params = [username, email, hashedPassword];
    const result = db.prepare(sql).run(params);
    return result.lastInsertRowid;
  }

  static findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    return db.prepare(sql).get(username);
  }

  static findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    return db.prepare(sql).get(email);
  }

  static findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return db.prepare(sql).get(id);
  }

  static update(id, { email, password }) {
    try {
      // 构建更新字段和参数
      const updates = [];
      const params = [];

      // 只有在提供了相应字段时才更新
      if (email) {
        updates.push('email = ?');
        params.push(email);
      }

      if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        updates.push('password = ?');
        params.push(hashedPassword);
      }

      // 如果没有要更新的字段，直接返回
      if (updates.length === 0) {
        return;
      }

      // 添加 WHERE 条件的参数
      params.push(id);

      const sql = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = ?
      `;

      db.prepare(sql).run(params);
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  }

  static delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.prepare(sql).run(id);
  }

  // 添加密码验证方法
  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }
}

module.exports = User;