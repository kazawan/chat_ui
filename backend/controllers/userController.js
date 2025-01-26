const User = require('../db/models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db/database');
const ChatSession = require('../db/models/ChatSession');
const ChatMessage = require('../db/models/ChatMessage');

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // 验证必填字段
    if (!username || !password || !email) {
      return res.status(400).json({
        message: '用户名、密码和邮箱都是必填项'
      });
    }

    // 检查用户名是否已存在
    const existingUser = User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        message: '用户名已存在'
      });
    }

    // 检查邮箱是否已存在
    const existingEmail = User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        message: '邮箱已被注册'
      });
    }

    // 创建新用户
    const userId = User.create({
      username,
      password,
      email
    });

    // 获取新创建的用户
    const user = User.findById(userId);

    // 创建欢迎对话
    const chatSessionId = ChatSession.create({
      userId: user.id,
      title: '欢迎对话'
    });

    // 添加欢迎消息
    ChatMessage.create({
      sessionId: chatSessionId,
      role: 'assistant',
      content: `你好 ${username}！👋\n\n欢迎使用我们的聊天系统。我是你的AI助手，可以为你提供以下帮助：\n\n1. 回答问题和解决问题\n2. 提供信息和建议\n3. 协助学习和工作\n4. 闲聊交谈\n\n有什么我可以帮你的吗？`
    });

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    // 返回用户信息（不包含密码）
    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      message: '注册失败',
      error: error.message
    });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({
        message: '用户名和密码都是必填项'
      });
    }

    // 查找用户
    const user = User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        message: '用户名或密码错误'
      });
    }

    // 验证密码
    const isValidPassword = await User.validatePassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: '用户名或密码错误'
      });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      message: '登录失败',
      error: error.message
    });
  }
};

// 获取用户信息
exports.getProfile = async (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: '用户不存在'
      });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      message: '获取用户信息失败',
      error: error.message
    });
  }
};

// 更新用户信息
exports.updateProfile = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 验证是否有要更新的字段
    if (!email && !password) {
      return res.status(400).json({
        message: '至少需要提供一个要更新的字段'
      });
    }

    // 如果要更新邮箱，检查是否已被使用
    if (email) {
      const existingEmail = User.findByEmail(email);
      if (existingEmail && existingEmail.id !== req.user.id) {
        return res.status(400).json({
          message: '邮箱已被注册'
        });
      }
    }

    // 更新用户信息
    User.update(req.user.id, {
      email,
      password
    });

    // 获取更新后的用户信息
    const user = User.findById(req.user.id);

    res.json({
      message: '更新成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({ 
      message: '更新失败', 
      error: error.message 
    });
  }
};