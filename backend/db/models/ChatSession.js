const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config');

class ChatSession extends Model {}

ChatSession.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '新对话'
  },
  lastMessageTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'ChatSession',
  tableName: 'chat_sessions'
});

module.exports = ChatSession;