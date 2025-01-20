import { useState, useEffect, useRef } from 'react';
import HideSidebarIcon from './components/icons/Hide_sidebar_icon';
import ShowSidebarIcon from './components/icons/Show_sidebar_icon';
import ThreeDotIcon from './components/icons/ThreeDot_icon';
import CloseChatDarkIcon from './components/icons/CloseChat_dark_icon';
import CloseChatLightIcon from './components/icons/CloseChat_light_icon';
import LoadingIcon from './components/icons/loading_icon_ani';
import DocIcon from './components/icons/Doc_icon';
import AddChatIcon from './components/icons/AddChat_icon';
import MessageContainer from './components/MessageContainer';
import UserProfile from './components/Sidebar/UserProfile';
import ChatList from './components/Sidebar/ChatList';
import ChatInput from './components/Chat/ChatInput';
import ChatMessages from './components/Chat/ChatMessages';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSidebarButton, setShowSidebarButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const messageContainerRef = useRef(null);

  const showMessage = (type, message) => {
    messageContainerRef.current?.addMessage(message, type);
  };

  useEffect(() => {
    // 页面加载时显示欢迎消息
    showMessage('info', '欢迎使用Deepseek Chat UI！');
  }, []);

  useEffect(() => {
    let hideTimeout;

    const handleMouseMove = (e) => {
      if (!isSidebarOpen) {
        if (e.clientX <= 20) {
          setShowSidebarButton(true);
          clearTimeout(hideTimeout);
        } else {
          hideTimeout = setTimeout(() => {
            setShowSidebarButton(false);
          }, 4000); // 4秒后隐藏
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hideTimeout);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true); // 在宽屏下自动展开侧边栏
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 relative max-w-screen overflow-x-hidden">
      <MessageContainer ref={messageContainerRef} />
      {/* 侧边栏 */}
      <div className={`w-64 bg-gray-800 border-r border-black rounded-none shadow-xl transition-transform duration-300 overflow-hidden flex flex-col h-screen fixed ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'} ${isMobile && !isSidebarOpen ? 'hidden md:flex' : 'flex'} z-50 backdrop-blur-lg bg-opacity-100`}>
        <UserProfile onClose={() => setIsSidebarOpen(false)} />
        <ChatList />
      </div>

      {/* 主聊天区域 */}
      <div className={`flex-1 flex flex-col items-center transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <div className="w-full max-w-[900px] h-full flex flex-col">
          {/* 侧边栏展开按钮 */}
          {!isSidebarOpen && showSidebarButton && (
            <div className={`absolute left-0 top-0 m-4 ${
              showSidebarButton ? 'animate-slide-in' : 'animate-slide-out'
            }`}>
              <button
                className="p-2 bg-black text-white rounded-full hover:bg-gray-700 transition-colors"
                onClick={() => setIsSidebarOpen(true)}
              >
                <ShowSidebarIcon className="h-6 w-6" />
              </button>
            </div>
          )}
          
          <ChatMessages />
          <ChatInput 
            isLoading={isLoading}
            onSend={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 2000);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
