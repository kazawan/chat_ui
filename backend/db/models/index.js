const { Sequelize } = require('sequelize');
const sequelize = require('../config');

const User = require('./User');
const ChatSession = require('./ChatSession');
const ChatMessage = require('./ChatMessage');

// 建立模型之间的关联关系
const setupAssociations = () => {
  // 用户和会话的关联
  User.hasMany(ChatSession, {
    foreignKey: 'userId',
    as: 'sessions',
    onDelete: 'CASCADE'
  });
  ChatSession.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  // 会话和消息的关联
  ChatSession.hasMany(ChatMessage, {
    foreignKey: 'sessionId',
    as: 'messages',
    onDelete: 'CASCADE'
  });
  ChatMessage.belongsTo(ChatSession, {
    foreignKey: 'sessionId',
    as: 'session'
  });
};

// 初始化数据库连接
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 设置关联关系
    setupAssociations();
    
    // 同步数据库模型
    try {
      // 首先尝试使用 alter 模式
      await sequelize.sync({ alter: true });
    } catch (syncError) {
      console.warn('使用 alter 模式同步失败，尝试普通同步:', syncError.message);
      // 如果 alter 失败，使用普通同步
      await sequelize.sync();
    }
    
    console.log('数据库模型同步完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('唯一约束错误：可能存在重复的用户名或邮箱');
    }
    // 不要立即退出进程，让应用继续运行
    console.error('数据库同步出现问题，但应用将继续运行');
  }
};

module.exports = {
  sequelize: sequelize,
  User,
  ChatSession,
  ChatMessage,
  initializeDatabase
}; 