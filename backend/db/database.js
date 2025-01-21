const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // 设置为 true 可以在控制台看到 SQL 查询
});

module.exports = sequelize;