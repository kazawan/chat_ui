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
import LoginModal from './components/Auth/LoginModal';
import config from './config';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSidebarButton, setShowSidebarButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [chats, setChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

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

  useEffect(() => {
    // 检查本地存储的token
    const token = localStorage.getItem('token');
    if (token) {
      // 获取用户信息
      fetchUserProfile(token);
    } else {
      // 只有在没有 token 且未登录时才显示登录框
      setShowLoginModal(true);
    }
  }, []); // 仅在组件挂载时执行

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setShowLoginModal(false);
        // 获取用户信息成功后，获取聊天列表
        await fetchChats();
      } else {
        localStorage.removeItem('token');
        setShowLoginModal(true);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      localStorage.removeItem('token');
      setShowLoginModal(true);
    }
  };

  // 获取聊天列表
  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.apiBaseUrl}/api/chat/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('获取聊天列表失败');
      }

      const data = await response.json();
      console.log('获取到的聊天列表:', data);
      setChats(data);

      // 如果有聊天记录，选择最近的一个
      if (data.length > 0) {
        const mostRecent = data[0]; // 假设后端已按时间排序
        setSelectedChat(mostRecent);
        await fetchChatMessages(mostRecent.id);
      } else {
        // 如果没有聊天记录，创建新对话
        await handleNewChat();
      }
    } catch (error) {
      console.error('获取聊天列表失败:', error);
      showMessage('error', '获取聊天列表失败');
      throw error;
    }
  };

  // 获取聊天消息
  const fetchChatMessages = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !chatId) return;

      const response = await fetch(`${config.apiBaseUrl}/api/chat/sessions/${chatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(data);
      }
    } catch (error) {
      console.error('获取聊天消息失败:', error);
      showMessage('error', '获取聊天消息失败');
    }
  };

  // 创建新聊天
  const handleNewChat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.apiBaseUrl}/api/chat/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: '新对话' })
      });

      if (response.ok) {
        const newChat = await response.json();
        setChats(prev => [newChat, ...prev]);
        setSelectedChat(newChat);
        setChatMessages([]);
        return newChat; // 返回新创建的对话
      } else {
        throw new Error('创建新对话失败');
      }
    } catch (error) {
      console.error('创建新对话失败:', error);
      showMessage('error', '创建新对话失败');
      throw error;
    }
  };

  // 选择聊天
  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    await fetchChatMessages(chat.id);
  };

  const handleLogin = async (userData) => {
    try {
      setUser(userData);
      setShowLoginModal(false);
      // 先获取聊天列表
      await fetchChats();
      showMessage('success', '登录成功！');
    } catch (error) {
      console.error('获取聊天列表失败:', error);
      showMessage('error', '获取聊天列表失败');
    }
  };

  const handleLogout = () => {
    // 清除 token
    localStorage.removeItem('token');
    
    // 清空所有状态
    setUser(null);
    setChats([]);
    setSelectedChat(null);
    setChatMessages([]);
    
    // 显示登录框
    setShowLoginModal(true);
    
    // 显示提示消息
    showMessage('info', '已退出登录');
  };

  // 监听选中的聊天变化
  useEffect(() => {
    if (selectedChat) {
      fetchChatMessages(selectedChat.id);
    }
  }, [selectedChat]);

  // 删除聊天
  const handleDeleteChat = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiBaseUrl}/api/chat/sessions/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // 从列表中移除被删除的聊天
        setChats(prev => prev.filter(chat => chat.id !== chatId));
        // 如果删除的是当前选中的聊天，清空选中状态和消息列表
        if (selectedChat?.id === chatId) {
          setSelectedChat(null);
          setChatMessages([]);
        }
        showMessage('success', '删除成功');
      } else {
        throw new Error('删除失败');
      }
    } catch (error) {
      console.error('删除聊天失败:', error);
      showMessage('error', '删除聊天失败');
    }
  };

  // 添加自动获取聊天列表的 effect
  useEffect(() => {
    if (user) {
      fetchChats();
    } else {
      setChats([]); // 用户未登录时清空聊天列表
    }
  }, [user]); // 当用户状态改变时重新获取

  // 添加更新标题的函数
  const handleUpdateTitle = async (chatId, newTitle) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiBaseUrl}/api/chat/sessions/${chatId}/title`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (response.ok) {
        const updatedChat = await response.json();
        setChats(prev => prev.map(chat => 
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        ));
        if (selectedChat?.id === chatId) {
          setSelectedChat(prev => ({ ...prev, title: newTitle }));
        }
        showMessage('success', '标题已更新');
      } else {
        throw new Error('更新标题失败');
      }
    } catch (error) {
      console.error('更新标题失败:', error);
      showMessage('error', '更新标题失败');
    }
  };

  // 添加重新生成消息的函数
  const handleRegenerate = async (messageId) => {
    if (!selectedChat) return;

    setIsLoading(true);
    try {
      // 找到要重新生成的消息及其对应的用户消息
      const messageIndex = chatMessages.findIndex(msg => msg.id === messageId);
      if (messageIndex === -1) return;

      // 获取用户的原始消息
      const userMessage = chatMessages[messageIndex - 1];
      if (!userMessage || userMessage.role !== 'user') return;

      // 删除之前的 AI 回复
      setChatMessages(prev => prev.filter((_, index) => index < messageIndex));

      // 创建新的 AI 消息占位
      const aiMessage = {
        id: Date.now(),
        content: '',
        role: 'assistant'
      };
      setChatMessages(prev => [...prev, aiMessage]);

      // 发送请求重新生成回复
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiBaseUrl}/api/chat/sessions/${selectedChat.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: userMessage.content })
      });

      if (!response.ok) {
        throw new Error('重新生成回复失败');
      }

      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                setChatMessages(prev => 
                  prev.map(msg => 
                    msg.id === aiMessage.id
                      ? { ...msg, content: msg.content + parsed.content }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error('解析响应数据失败:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('重新生成回复失败:', error);
      showMessage('error', '重新生成回复失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative max-w-screen overflow-x-hidden">
      <MessageContainer ref={messageContainerRef} />
      
      {/* 登录模态框 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          // 只有在用户已登录时才允许关闭登录框
          if (user) {
            setShowLoginModal(false);
          }
        }}
        onLogin={handleLogin}
      />

      {/* 侧边栏 */}
      <div className={`w-64 bg-gray-800 border-r border-black rounded-none shadow-xl transition-transform duration-300 overflow-hidden flex flex-col h-screen fixed ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'} ${isMobile && !isSidebarOpen ? 'hidden md:flex' : 'flex'} z-50 backdrop-blur-lg bg-opacity-100`}>
        <UserProfile 
          user={user}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />
        <ChatList 
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onUpdateTitle={handleUpdateTitle}
        />
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
          
          <ChatMessages 
            messages={chatMessages} 
            currentChat={user ? selectedChat : null}
            onRegenerate={handleRegenerate}
            isLoading={isLoading}
          />
          <ChatInput 
            isLoading={isLoading}
            currentChat={user ? selectedChat : null}
            onSend={async (content) => {
              if (!user) {
                showMessage('warning', '请先登录');
                return;
              }
              if (!selectedChat) {
                showMessage('warning', '请先选择或创建一个对话');
                return;
              }

              setIsLoading(true);
              try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.apiBaseUrl}/api/chat/sessions/${selectedChat.id}/messages`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ content })
                });

                if (!response.ok) {
                  throw new Error('发送消息失败');
                }

                // 创建并保存用户消息
                const userMessage = {
                  id: Date.now(),
                  content,
                  role: 'user'
                };
                setChatMessages(prev => [...prev, userMessage]);

                // 创建 AI 消息占位
                const aiMessage = {
                  id: Date.now() + 1,
                  content: '',
                  role: 'assistant'
                };
                setChatMessages(prev => [...prev, aiMessage]);

                // 处理流式响应
                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                  const { value, done } = await reader.read();
                  if (done) break;

                  const chunk = decoder.decode(value);
                  const lines = chunk.split('\n');

                  for (const line of lines) {
                    if (line.startsWith('data: ')) {
                      const data = line.slice(6);
                      if (data === '[DONE]') {
                        break;
                      }

                      try {
                        const parsed = JSON.parse(data);
                        if (parsed.content) {
                          // 更新 AI 消息内容
                          setChatMessages(prev => 
                            prev.map(msg => 
                              msg.id === aiMessage.id
                                ? { ...msg, content: msg.content + parsed.content }
                                : msg
                            )
                          );
                        }
                      } catch (e) {
                        console.error('解析响应数据失败:', e);
                      }
                    }
                  }
                }
              } catch (error) {
                console.error('发送消息失败:', error);
                showMessage('error', '发送消息失败');
              } finally {
                setIsLoading(false);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
