const { Sequelize } = require('sequelize');
const path = require('path');

// 创建 Sequelize 实例
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false // 设置为 true 可以看到 SQL 查询日志
});

module.exports = sequelize; 