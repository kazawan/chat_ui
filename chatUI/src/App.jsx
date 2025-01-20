import { useState, useEffect } from 'react';
import HideSidebarIcon from './components/icons/Hide_sidebar_icon';
import ShowSidebarIcon from './components/icons/Show_sidebar_icon';
import ThreeDotIcon from './components/icons/ThreeDot_icon';
import CloseChatDarkIcon from './components/icons/CloseChat_dark_icon';
import CloseChatLightIcon from './components/icons/CloseChat_light_icon';
import LoadingIcon from './components/icons/loading_icon_ani';
import DocIcon from './components/icons/Doc_icon';
import AddChatIcon from './components/icons/AddChat_icon';
import MessageBox from './components/MessageBox';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSidebarButton, setShowSidebarButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);

  const showMessage = (type, message) => {
    setMessages(prev => {
      const newMessages = [...prev, { id: Date.now(), type, message }];
      return newMessages;
    });
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

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <div className="fixed top-0 left-0 w-full z-[9999]">
        {messages.map(msg => (
          <MessageBox
            key={msg.id}
            type={msg.type}
            message={msg.message}
            onClose={() => setMessages(prev => prev.filter(m => m.id !== msg.id))}
          />
        ))}
      </div>
      {/* 侧边栏 */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-gray-800 border-r border-black rounded-none shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-screen`}>
        {/* 顶部导航栏 */}
        <div className="flex items-center justify-between p-4 bg-black rounded-none">
          <div className="flex flex-col space-y-1 relative w-full">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 flex items-center justify-center text-white font-semibold">
                K
              </div>
              <div className="bg-black px-3 py-1 rounded-full text-gray-500">
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
              className="absolute right-0 top-0 text-gray-500 hover:text-white transition-colors"
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
        <div className="p-4 text-center text-gray-400 text-sm">
          © 2025 DeepseekChatUI. All rights reserved.<br />
          <a href="https://github.com/kazawan/deepseekChatUI" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            kazawan/deepseekChatUI
          </a>
        </div>
        
      </div>

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col">
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
        <div className="flex-1 p-4 bg-white overflow-y-auto">
          <div className="text-gradient text-sm text-center mb-4">
            欢迎使用deepseekChatUI
          </div>
          <div className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-end">
                <div className="bg-gray p-2 rounded-lg max-w-[70%] text-sm">用户消息</div>
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
        <div className="p-4 bg-gray-200">
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
  );
}

export default App;
