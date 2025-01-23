require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const openai = require('openai');
const db = require('./db/database');
const initializeDatabase = require('./db/initialize');
const User = require('./db/models/User');
const ChatSession = require('./db/models/ChatSession');
const ChatMessage = require('./db/models/ChatMessage');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const path = require('path');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// 添加用户路由
app.use('/api/users', userRoutes);

// 添加聊天路由
app.use('/api/chat', chatRoutes);

// 启动服务器
const PORT = process.env.PORT || 3001;

// 初始化数据库
initializeDatabase();

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});