import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { RiHome2Line, RiMessage2Line, RiFileTextLine, RiInformationLine, RiUser3Line, RiSettings4Line, RiLogoutBoxRLine } from "react-icons/ri";

// 统一的样式配置
const styles = {
  colors: {
    text: 'rgb(31, 35, 40)',
    border: '#d1d9e0',
    background: '#e4e9ed',
    overlay: 'rgba(255, 255, 255, 0.1)',
    hoverBg: '#f5f5f5'
  },
  shadows: {
    sidebar: `
      0 0 10px rgba(0, 0, 0, 0.05),
      0 0 20px rgba(0, 0, 0, 0.03),
      0 0 30px rgba(0, 0, 0, 0.02)
    `
  },
  common: {
    menuItem: 'block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100',
    iconButton: 'p-2 rounded-md focus:outline-none transition-all duration-200',
    logo: 'h-12 w-12 cursor-pointer transition-transform duration-200 hover:scale-110',
    closeButton: 'p-2 rounded-full transition-all duration-300 ease-in-out hover:bg-gray-100 hover:rotate-90 hover:scale-110',
    pageTitle: 'px-3 py-1.5 bg-gray-100 rounded-md text-sm font-medium ml-2 text-gray-700 cursor-pointer '
  }
};

const MenuIcon = ({ isOpen }) => (
  <svg
    className="h-6 w-6"
    stroke="currentColor"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d={isOpen 
        ? "M3 4h18M3 8h18M3 12h18"
        : "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
      }
    />
  </svg>
);

const CloseIcon = () => (
  <svg 
    className="h-5 w-5" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
  >
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // 获取用户信息
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // 导航菜单项
  const menuItems = [
    { title: '主页', icon: <RiHome2Line className="w-5 h-5" />, path: '/home' },
    { title: '聊天', icon: <RiMessage2Line className="w-5 h-5" />, path: '/chat' },
    { title: '笔记', icon: <RiFileTextLine className="w-5 h-5" />, path: '/notes' },
    { title: '关于项目', icon: <RiInformationLine className="w-5 h-5" />, path: '/about' }
  ];

  // 获取当前页面标题
  const currentPageTitle = useMemo(() => {
    const currentMenuItem = menuItems.find(item => item.path === location.pathname);
    return currentMenuItem?.title || '主页';
  }, [location.pathname]);

  // 处理点击用户菜单
  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{
      backgroundColor: styles.colors.background,
      borderBottom: `1px solid ${styles.colors.border}`,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      {/* 顶部导航栏 */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 左侧菜单按钮和Logo */}
          <div className="flex items-center space-x-2" style={{ marginLeft: '-0.5rem' }}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-l-xl hover:bg-gray-100 focus:outline-none transition-colors duration-200 border"
              style={{ color: styles.colors.text, borderColor: '#000000', borderWidth: '1px' }}
            >
              <MenuIcon isOpen={isOpen} />
            </button>
            <img
              src={logo}
              alt="Logo"
              className={styles.common.logo}
              style={{
                objectFit: 'contain'
              }}
            />
            <span  className={styles.common.pageTitle}>{currentPageTitle}</span>
          </div>

          {/* 右侧用户信息 */}
          <div className="flex items-center space-x-3 relative">
            <span className="text-sm" style={{ color: styles.colors.text }}>{user?.name || 'Guest'}</span>
            <button
              className="focus:outline-none"
              onClick={handleUserMenuClick}
            >
              <img
                src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=guest"}
                alt="avatar"
                className="h-8 w-8 rounded-full object-cover hover:ring-2 hover:ring-gray-300 transition-all duration-200"
              />
            </button>

            {/* 用户下拉菜单 */}
            <div>
              {/* 背景遮罩 */}
              <div
                className={`fixed inset-0 z-40 bg-black/0 transition-opacity duration-200 ${
                  showUserMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setShowUserMenu(false)}
                style={{ pointerEvents: showUserMenu ? 'auto' : 'none' }}
              />

              {/* 下拉菜单内容 */}
              <div
                className={`absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transform transition-all duration-200 ease-out ${
                  showUserMenu
                    ? 'translate-y-0 opacity-100 scale-100'
                    : 'translate-y-[-10px] opacity-0 scale-95 pointer-events-none'
                }`}
                style={{
                  border: `1px solid ${styles.colors.border}`,
                  boxShadow: styles.shadows.sidebar,
                  backgroundColor: '#ffffff'
                }}
              >
                {/* 用户信息 */}
                <div className="px-4 py-2 border-b" style={{ borderColor: styles.colors.border }}>
                  <p className="text-sm font-medium" style={{ color: styles.colors.text }}>{user?.name || 'Guest'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'guest@example.com'}</p>
                </div>

                {/* 用户菜单选项 */}
                <div className="py-1">
                  <a
                    onClick={() => {
                      navigate('/settings/user');
                      setShowUserMenu(false);
                    }}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-150 flex items-center gap-2 cursor-pointer"
                    style={{ color: styles.colors.text }}
                  >
                    <RiUser3Line className="w-4 h-4" />
                    <span>个人设置</span>
                  </a>
                  <a
                    onClick={() => {
                      navigate('/settings/system');
                      setShowUserMenu(false);
                    }}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-150 flex items-center gap-2 cursor-pointer"
                    style={{ color: styles.colors.text }}
                  >
                    <RiSettings4Line className="w-4 h-4" />
                    <span>系统设置</span>
                  </a>
                  <hr className="mx-4 my-2 border-t border-gray-200" style={{ borderColor: styles.colors.border }} />
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150 flex items-center gap-2"
                  >
                    <RiLogoutBoxRLine className="w-4 h-4" />
                    <span>退出登录</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 遮罩层和侧边栏 */}
      <>
        {/* 遮罩层 */}
        <div
          className={`fixed inset-0 transition-opacity duration-300 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsOpen(false)}
          style={{
            backgroundColor: styles.colors.overlay,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            zIndex: 45
          }}
        />
        
        {/* 侧边栏 - 自然阴影效果 */}
        <div
          className="fixed left-0 top-0 h-full w-80 bg-white rounded-r-lg z-50 transition-transform duration-300 ease-in-out flex flex-col"
          style={{
            transform: `translateX(${isOpen ? '0' : '-100%'})`,
            boxShadow: styles.shadows.sidebar
          }}
        >
          {/* 侧边栏头部 */}
          <div className="h-16 flex items-center justify-between px-4 border-b shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-8"
                style={{ objectFit: 'contain' }}
              />
              <span className="text-lg font-semibold" style={{ color: styles.colors.text }}>AI Chat</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.common.closeButton}
              style={{ color: styles.colors.text }}
            >
              <CloseIcon />
            </button>
          </div>

          {/* 菜单项和对话列表 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 快捷菜单 */}
            <nav className="px-2 py-3 space-y-1 border-b" style={{ borderColor: styles.colors.border }}>
              {menuItems.map((item, index) => (
                <a
                  key={item.title}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`${styles.common.menuItem} transition-all duration-300 flex items-center gap-3 cursor-pointer`}
                  style={{
                    color: styles.colors.text,
                    opacity: isOpen ? 1 : 0,
                    transform: `translateX(${isOpen ? '0' : '-10px'})`,
                    transitionDelay: `${index * 50}ms`
                  }}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              ))}
            </nav>

            {/* 占位空间 */}
            <div className="flex-1"></div>

            {/* 版权信息 */}
            <div
              className="p-4 border-t text-xs text-center text-gray-500"
              style={{
                borderColor: styles.colors.border,
                opacity: isOpen ? 1 : 0,
                transition: 'opacity 300ms'
              }}
            >
              <p>© 2025 AI Chat</p>
              <p>All rights reserved</p>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default NavigationBar;