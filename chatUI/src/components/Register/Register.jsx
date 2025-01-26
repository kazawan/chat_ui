import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';
import { messageService } from '../../services/messageService';
import '../Auth/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 表单验证
    if (!formData.username.trim() || !formData.password || !formData.email) {
      messageService.warning('请填写所有必填字段');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      messageService.warning('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      messageService.warning('密码长度至少为6个字符');
      return;
    }

    setLoading(true);

    try {
      // 调用真实注册API
      await register(formData.username, formData.password, formData.email);

      // 注册成功提示
      messageService.success('注册成功，请登录');
      
      // 注册成功，跳转到登录页
      navigate('/login');
      
    } catch (err) {
      messageService.error(err.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">注册账号</h1>
          <p className="login-subtitle">创建您的AI助手账号</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="请输入用户名"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入邮箱地址"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入密码（至少6位）"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="请再次输入密码"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <div className="register-link">
          已有账号？
          <Link to="/login">立即登录</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;