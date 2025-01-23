const db = require('../database');

class ChatSession {
  static create({ userId, title }) {
    const sql = `
      INSERT INTO chat_sessions (userId, title, lastMessageTime)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `;
    const params = [userId, title];
    const result = db.prepare(sql).run(params);
    return result.lastInsertRowid;
  }

  static findByUserId(userId) {
    const sql = `
      SELECT
        cs.*,
        (SELECT content FROM chat_messages
         WHERE sessionId = cs.id
         AND role = 'assistant'
         ORDER BY createdAt DESC
         LIMIT 1) as lastMessage
      FROM chat_sessions cs
      WHERE cs.userId = ?
      ORDER BY cs.lastMessageTime DESC
    `;
    return db.prepare(sql).all(userId);
  }

  static findById(id) {
    const sql = `
      SELECT
        cs.*,
        (SELECT content FROM chat_messages
         WHERE sessionId = cs.id
         ORDER BY createdAt DESC
         LIMIT 1) as lastMessage
      FROM chat_sessions cs
      WHERE cs.id = ?
    `;
    return db.prepare(sql).get(id);
  }

  static update(id, { title }) {
    const sql = 'UPDATE chat_sessions SET title = ? WHERE id = ?';
    db.prepare(sql).run(title, id);
  }

  static updateLastMessageTime(id) {
    const sql = 'UPDATE chat_sessions SET lastMessageTime = CURRENT_TIMESTAMP WHERE id = ?';
    db.prepare(sql).run(id);
  }

  static delete(id) {
    const sql = 'DELETE FROM chat_sessions WHERE id = ?';
    db.prepare(sql).run(id);
  }
}

module.exports = ChatSession;