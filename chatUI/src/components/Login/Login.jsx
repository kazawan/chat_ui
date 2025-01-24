import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockLogin } from '../../services/mockAuth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // 表单验证
    if (!formData.username.trim() || !formData.password) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);
    
    try {
      // 使用模拟登录服务
      const { token, user } = await mockLogin(formData.username, formData.password);

      // 存储token和用户信息
      localStorage.setItem('token', token);
      if (formData.rememberMe) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      // 登录成功后跳转到聊天页面
      navigate('/chat');
      
    } catch (err) {
      setError(err.message || '登录过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">欢迎使用</h1>
          <p className="login-subtitle">请登录您的账号</p>
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
              placeholder="请输入用户名（admin 或 test）"
              autoComplete="username"
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
              placeholder="请输入密码（admin123 或 test123）"
              autoComplete="current-password"
            />
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe">记住我</label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="register-link">
          还没有账号？
          <Link to="/register">立即注册</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;