import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../../config';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLoginMode ? '/api/users/login' : '/api/users/register';
      const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isLoginMode ? {
          username: formData.username,
          password: formData.password
        } : formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: '服务器响应错误'
        }));
        throw new Error(errorData.message || '操作失败');
      }

      const data = await response.json().catch(() => {
        throw new Error('无效的服务器响应');
      });

      if (!data.token || !data.user) {
        throw new Error('服务器返回数据格式错误');
      }

      localStorage.setItem('token', data.token);
      onLogin(data.user);
      onClose();
    } catch (error) {
      console.error('操作失败:', error);
      setError(error.message || '操作失败，请稍后重试');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              {isLoginMode ? '登录' : '注册'}
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-500 rounded text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="用户名"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 rounded border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              {!isLoginMode && (
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="邮箱"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 rounded border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
              )}

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="密码"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 rounded border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                {isLoginMode ? '登录' : '注册'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-gray-600 hover:text-black text-sm"
              >
                {isLoginMode ? '没有账号？点击注册' : '已有账号？点击登录'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal; 