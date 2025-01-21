const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config');

class ChatMessage extends Model {}

ChatMessage.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  sequelize,
  modelName: 'ChatMessage',
  tableName: 'chat_messages'
});

module.exports = ChatMessage;