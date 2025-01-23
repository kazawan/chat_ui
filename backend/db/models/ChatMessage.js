const db = require('../database');

class ChatMessage {
  static create({ sessionId, role, content }) {
    const sql = `
      INSERT INTO chat_messages (sessionId, role, content, updatedAt)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `;
    const params = [sessionId, role, content];
    const result = db.prepare(sql).run(params);
    return result.lastInsertRowid;
  }

  static findBySessionId(sessionId) {
    const sql = `
      SELECT
        id,
        sessionId,
        role,
        content,
        createdAt,
        updatedAt
      FROM chat_messages
      WHERE sessionId = ?
      ORDER BY createdAt ASC
    `;
    return db.prepare(sql).all(sessionId);
  }

  static findById(id) {
    const sql = 'SELECT * FROM chat_messages WHERE id = ?';
    return db.prepare(sql).get(id);
  }

  static update(id, { content }) {
    try {
      const sql = 'UPDATE chat_messages SET content = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
      db.prepare(sql).run(content, id);
    } catch (error) {
      console.error('更新消息失败:', error);
      throw error;
    }
  }

  static delete(conditions) {
    let sql = 'DELETE FROM chat_messages';
    const params = [];
    
    if (conditions) {
      const whereClauses = [];
      if (conditions.sessionId) {
        whereClauses.push('sessionId = ?');
        params.push(conditions.sessionId);
      }
      if (whereClauses.length > 0) {
        sql += ' WHERE ' + whereClauses.join(' AND ');
      }
    }
    
    db.prepare(sql).run(params);
  }
}

module.exports = ChatMessage;