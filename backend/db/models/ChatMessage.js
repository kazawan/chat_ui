const { DataTypes } = require('sequelize');
const db = require('../database');
const ChatSession = require('./ChatSession');

const ChatMessage = db.define('ChatMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'assistant'),
    allowNull: false
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: ChatSession,
      key: 'id'
    }
  }
});

// 建立与会话的关联关系
ChatMessage.belongsTo(ChatSession, { foreignKey: 'sessionId' });
ChatSession.hasMany(ChatMessage, { foreignKey: 'sessionId' });

module.exports = ChatMessage;