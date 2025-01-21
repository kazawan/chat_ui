const User = require('../db/models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      where: {
        username: username
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 创建新用户
    const user = await User.create({
      username,
      password,
      email
    });

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

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
    res.status(500).json({ message: '注册失败', error: error.message });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 更新最后登录时间
    await user.update({ lastLoginAt: new Date() });

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
    res.status(500).json({ message: '登录失败', error: error.message });
  }
};

// 获取用户信息
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'lastLoginAt']
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '获取用户信息失败', error: error.message });
  }
};

// 更新用户信息
exports.updateProfile = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByPk(req.user.id);

    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    res.json({
      message: '更新成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: '更新失败', error: error.message });
  }
}; 