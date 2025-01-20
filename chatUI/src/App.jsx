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
        {/* 顶部导航栏 */}
        <div className="flex items-center justify-between p-4 bg-black rounded-none">
          <div className="flex flex-col space-y-1 relative w-full">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 flex items-center justify-center text-white font-semibold border-2 border-white">
                K
              </div>
              <div className="bg-black px-3 py-1 rounded-full text-white">
                kazawan
              </div>
            </div>
            <div className="w-full">
              <div className="text-green-500 text-sm">700/1000 tokens</div>
              <div className="w-full bg-gray-600 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{width: '30%'}}></div>
              </div>
            </div>
            <button
              className="absolute right-0 top-0 text-white hover:text-gray-300 transition-colors border-2 border-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <HideSidebarIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* 新增聊天按钮 */}
        <div className="p-2 bg-gray-700">
          <button
            className="w-full p-2 bg-black text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-700 transition-colors"
          >
            <AddChatIcon className="h-6 w-6" />
            <span>新增聊天</span>
          </button>
        </div>

        {/* 聊天列表 */}
        <div className="p-4 bg-gray-700 text-black">
          <div className="space-y-2">
            {/* 聊天项 */}
            <div className="p-2 bg-white rounded border border-black flex justify-between items-center">
              <div className="flex items-center justify-between w-full">
                <span>聊天1</span>
                <div className="flex items-center text-gray-500 hover:text-red-500 cursor-pointer">
                  <CloseChatDarkIcon className="h-4 w-3" />
                </div>
              </div>
            </div>
            <div className="p-2 bg-white rounded border border-black flex justify-between items-center">
              <div className="flex items-center justify-between w-full">
                <span>聊天2</span>
                <div className="flex items-center text-gray-500 hover:text-red-500 cursor-pointer">
                  <CloseChatDarkIcon className="h-4 w-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 测试容器 */}
        <div className="p-4 bg-gray-700">
          <h3 className="text-white mb-2">测试...</h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              className="p-2 bg-gray-800 text-white rounded"
              onClick={() => showMessage('default', '默认消息')}
            >
              默认
            </button>
            <button
              className="p-2 bg-green-500 text-white rounded"
              onClick={() => showMessage('info', '信息消息')}
            >
              信息
            </button>
            <button
              className="p-2 bg-yellow-500 text-black rounded"
              onClick={() => showMessage('warning', '警告消息')}
            >
              警告
            </button>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="p-4 text-center text-gray-400 text-sm mt-auto sticky bottom-0 bg-gray-800">
          © 2025 DeepseekChatUI. All rights reserved.<br />
          <a href="https://github.com/kazawan/deepseekChatUI" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            kazawan/deepseekChatUI
          </a>
        </div>
        
      </div>

      {/* 添加遮罩层 */}
      {/* {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )} */}

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
          {/* 聊天记录 */}
          <div className="flex-1 p-4 bg-white overflow-y-auto max-w-full overflow-x-hidden">
            <div className="bg-gray p-4 rounded-lg mb-4">
              <div className="text-gradient text-sm text-center">
                欢迎使用deepseekChatUI
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-end">
                  <div className="bg-black p-2 rounded-lg max-w-[70%] text-white text-sm">用户消息</div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-black text-white p-2 rounded-lg max-w-[70%] text-sm">
                    # python打印 hello world 函数 <br />
                    ``` python <br />
                    def hello_world(): <br />
                      print('hello world') <br />
                    ``` <br />
                    
                    
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 输入框 */}
          <div className="p-4 bg-gray-200 sticky bottom-0">
            <div className="text-sm text-gray-500 mb-2">
            ⚠️ctrl + i 聚焦到输入框.....
            </div>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                title="添加文档"
              >
                <DocIcon className="h-5 w-5" />
              </button>
              <input
                type="text"
                placeholder="输入消息..."
                className="flex-1 p-2 rounded-lg border"
              />
              <button
                className="px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 2000); // 模拟2秒加载
                }}
              >
                {isLoading ? (
                  <LoadingIcon className="h-5 w-5 animate-spin" />
                ) : (
                  '发送'
                )}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
