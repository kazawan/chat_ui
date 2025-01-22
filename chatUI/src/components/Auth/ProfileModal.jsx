import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../../config';

const ProfileModal = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    password: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const modalRef = useRef(null);

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 验证新密码和确认密码是否匹配
    if (formData.newPassword !== formData.confirmPassword) {
      setError('新密码和确认密码不匹配');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiBaseUrl}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: formData.newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '更新失败');
      }

      // 清空表单并显示成功消息
      setFormData({
        password: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccess(true);
      
      // 2秒后自动关闭
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('更新失败:', error);
      setError(error.message || '更新失败，请稍后重试');
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
        <div className="fixed inset-0 min-h-screen flex items-center justify-center z-[100] transform translate-y-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-[400px] border border-gray-200 relative z-10"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
                修改密码
              </h2>
              
              {error && (
                <div className="mb-4 p-2 bg-red-50 border border-red-500 rounded text-red-600 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-2 bg-green-50 border border-green-500 rounded text-green-600 text-sm">
                  密码修改成功！
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="当前密码"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-gray-50 rounded border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="新密码"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-gray-50 rounded border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="确认新密码"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-gray-50 rounded border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 p-2.5 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 p-2.5 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    确认修改
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal; 