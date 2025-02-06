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

// 设置CORS
app.use(cors());

// 添加额外的安全头部，但放宽限制
app.use((req, res, next) => {
  // 允许使用剪贴板API
  res.setHeader('Permissions-Policy', 'clipboard-write=self');
  // 放宽CSP限制
  res.setHeader(
    'Content-Security-Policy', 
    "default-src 'self' *; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' *;"
  );
  next();
});

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