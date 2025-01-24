import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // 检查是否有token
  const token = localStorage.getItem('token');
  
  if (!token) {
    // 如果没有token，重定向到登录页
    return <Navigate to="/login" replace />;
  }

  // 如果有token，渲染受保护的组件
  return children;
};

export default ProtectedRoute;