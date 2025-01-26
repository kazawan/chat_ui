import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';

const ProtectedRoute = ({ children }) => {
  // 使用authService检查认证状态
  if (!isAuthenticated()) {
    // 如果未认证，重定向到登录页
    return <Navigate to="/login" replace />;
  }

  // 如果已认证，渲染受保护的组件
  return children;
};

export default ProtectedRoute;