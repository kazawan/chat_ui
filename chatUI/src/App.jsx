import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar/NavigationBar';
import ChatArea from './components/ChatArea/ChatArea';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import Notes from './components/Notes/Notes';
import About from './components/About/About';
import UserSettings from './components/Settings/UserSettings';
import SystemSettings from './components/Settings/SystemSettings';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import MessageContainer from './components/Message/MessageContainer';

function App() {
  return (
    <Router>
      <MessageContainer />
      <Routes>
        {/* 登录和注册路由 - 无需保护 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 主聊天页面 */}
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
                <NavigationBar />
                <div className="flex-1 overflow-hidden flex justify-center">
                  <div className="w-full max-w-[1280px] h-full">
                    <ChatArea />
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />

        {/* 主页 */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
                <NavigationBar />
                <Home />
              </div>
            </ProtectedRoute>
          } 
        />

        {/* 笔记页面 */}
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
                <NavigationBar />
                <Notes />
              </div>
            </ProtectedRoute>
          } 
        />
        
        {/* 关于页面 */}
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
                <NavigationBar />
                <About />
              </div>
            </ProtectedRoute>
          }
        />

        {/* 个人设置页面 */}
        <Route
          path="/settings/user"
          element={
            <ProtectedRoute>
              <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
                <NavigationBar />
                <UserSettings />
              </div>
            </ProtectedRoute>
          }
        />

        {/* 系统设置页面 */}
        <Route
          path="/settings/system"
          element={
            <ProtectedRoute>
              <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
                <NavigationBar />
                <SystemSettings />
              </div>
            </ProtectedRoute>
          }
        />

        {/* 默认重定向到聊天页面 */}
        <Route 
          path="/" 
          element={<Navigate to="/chat" replace />} 
        />
        
        {/* 404重定向到聊天页面 */}
        <Route 
          path="*" 
          element={<Navigate to="/chat" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
