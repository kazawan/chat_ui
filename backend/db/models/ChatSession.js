const { DataTypes } = require('sequelize');
const db = require('../database');
const User = require('./User');

const ChatSession = db.define('ChatSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '新对话'
  },
  lastMessageTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
});

// 建立与用户的关联关系
ChatSession.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ChatSession, { foreignKey: 'userId' });

module.exports = ChatSession;