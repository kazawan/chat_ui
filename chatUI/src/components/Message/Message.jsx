import React, { useEffect } from 'react';

const Message = ({ message, type = 'default', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getTypeStyles = () => {
    const baseStyles = 'fixed top-5 right-5 px-4 py-2 rounded-lg bg-opacity-90 text-sm font-medium shadow-lg transition-all duration-300 ease-in-out z-50';
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-white`;
      case 'info':
        return `${baseStyles} bg-blue-500 text-white`;
      default:
        return `${baseStyles} bg-gray-700 text-white`;
    }
  };

  return (
    <div className={getTypeStyles()}>
      {message}
    </div>
  );
};

export default Message;