import React, { useState, useRef, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import './ChatArea.css';
import {
  RiMenuLine,
  RiCloseLine,
  RiAddLine,
  RiMoreLine,
  RiSendPlaneFill,
  RiDownloadLine,
  RiDeleteBinLine,
  RiFileCopyLine,
  RiCheckLine
} from "react-icons/ri";
import ConversationList from '../ConversationList/ConversationList';
import { useChatStore, chatService } from '../../services/chatService';
import { messageService } from '../../services/messageService';

const ChatArea = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  // 处理复制功能
  const handleCopy = async (text, messageId) => {
    try {
      // 首先尝试使用现代Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // 后备方案：使用传统的document.execCommand方法
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // 防止滚动
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
          document.execCommand('copy');
        } catch (err) {
          throw new Error('复制失败');
        } finally {
          document.body.removeChild(textArea);
        }
      }
      
      // 显示复制成功状态
      setCopiedId(messageId);
      messageService.success('复制成功');
      
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      messageService.error('复制失败，请手动复制');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 使用chatStore管理状态
  const { 
    messages, 
    currentSession,
    loading,
    setCurrentSession,
    setMessages 
  } = useChatStore();

  // markdown解析器
  const md = useRef(new MarkdownIt({
    breaks: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
      return '';
    }
  }));

  // 创建新对话
  const handleNewChat = async () => {
    try {
      await chatService.createSession();
      setInputMessage('');
      messageService.success('新对话已创建');
    } catch (error) {
      messageService.error(error.message);
    }
  };

  // 导出聊天记录
  const handleExportChat = () => {
    setIsDropdownOpen(false);
    if (!currentSession) return;

    const chatContent = messages
      .map(msg => `${msg.role === 'user' ? '用户' : 'AI'}：${msg.content}`)
      .join('\n\n');

    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `对话记录_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // 删除当前对话
  const handleDeleteConversation = async () => {
    setIsDropdownOpen(false);
    if (!currentSession) return;

    try {
      await chatService.deleteSession(currentSession.id);
      setCurrentSession(null);
      setMessages([]);
      messageService.success('对话已删除');
    } catch (error) {
      messageService.error(error.message);
    }
  };

  // 处理标题编辑
  const handleTitleClick = () => {
    if (currentSession && !isEditingTitle) {
      setTitleInput(currentSession.title || '新对话');
      setIsEditingTitle(true);
    }
  };

  const handleTitleSave = async () => {
    if (!currentSession || !titleInput.trim()) return;
    
    try {
      const newTitle = titleInput.trim().slice(0, 20);
      await chatService.updateSessionTitle(currentSession.id, newTitle);
      setIsEditingTitle(false);
      // 更新当前会话的标题
      setCurrentSession({
        ...currentSession,
        title: newTitle
      });
      messageService.success('标题已更新');
    } catch (error) {
      messageService.error(error.message);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTitleInput(currentSession?.title || '新对话');
    }
  };

  // 发送消息
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    try {
      if (!currentSession) {
        // 如果没有当前会话，先创建一个
        const session = await chatService.createSession();
        await chatService.sendMessage(session.id, inputMessage);
      } else {
        await chatService.sendMessage(currentSession.id, inputMessage);
      }
      setInputMessage('');
    } catch (error) {
      messageService.error(error.message);
    }
  };

  // 监听消息变化，自动滚动
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化加载最新会话
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // 获取所有会话
        const sessions = await chatService.getSessions();
        if (sessions.length > 0) {
          // 如果有会话，选择最新的一个
          const latestSession = sessions.reduce((latest, current) => {
            return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
          }, sessions[0]);
          setCurrentSession(latestSession);
        } else {
          // 如果没有会话，创建一个新的
          await handleNewChat();
        }
      } catch (error) {
        messageService.error('初始化会话失败');
      }
    };

    initializeChat();
  }, []); // 仅在组件挂载时执行一次

  // 加载会话消息
  useEffect(() => {
    if (currentSession) {
      chatService.getSessionMessages(currentSession.id)
        .catch(error => messageService.error(error.message));
    }
  }, [currentSession]);

  return (
    <div className="chat-area">
      {/* 遮罩层 */}
      <div
        className={`absolute inset-0 bg-black/5 backdrop-blur-[2px] transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
        style={{ zIndex: 10 }}
      />
      
      {/* 侧边栏 */}
      <div 
        className="absolute left-0 top-0 h-full w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out flex flex-col"
        style={{
          transform: `translateX(${isSidebarOpen ? '0' : '-100%'})`,
          zIndex: 20
        }}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-800">对话列表</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
          >
            <RiCloseLine size={20} className="text-gray-600" />
          </button>
        </div>

        <div 
          className="flex-1 overflow-hidden transition-opacity duration-300"
          style={{
            opacity: isSidebarOpen ? 1 : 0
          }}
        >
          <ConversationList isOpen={isSidebarOpen} />
        </div>
      </div>

      {/* 聊天顶部状态栏 */}
      <div className="chat-header">
        <div className="header-left">
          <button
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsSidebarOpen(true)}
          >
            <RiMenuLine size={20} className="text-gray-600" />
          </button>
          <button 
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            onClick={handleNewChat}
          >
            <RiAddLine size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="header-container">
          <div className="flex flex-col">
            <div
              className="header-title"
              onClick={handleTitleClick}
              style={{ cursor: 'pointer' }}
            >
              {isEditingTitle ? (
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={handleTitleSave}
                  maxLength={20}
                  className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none px-1 w-full"
                  autoFocus
                />
              ) : (
                <div className="hover:bg-gray-100 px-2 py-1 rounded">
                  {currentSession?.title || '新对话'}
                </div>
              )}
            </div>
            {currentSession && (
              <div className="text-xs text-gray-500 mt-1">
                会话ID: {currentSession.clientUUID || '未生成'}
              </div>
            )}
          </div>
        </div>
        <div className="header-right">
          <div className="relative">
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <RiMoreLine size={20} className="text-gray-600" />
            </button>
            {isDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                <button
                  className="dropdown-item"
                  onClick={handleExportChat}
                >
                  <RiDownloadLine size={16} />
                  导出聊天记录
                </button>
                <button
                  className="dropdown-item"
                  onClick={handleDeleteConversation}
                >
                  <RiDeleteBinLine size={16} />
                  删除对话
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 聊天记录区域 */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role === 'user' ? 'message-user' : 'message-ai'}`}
          >
            <article className={`message-content ${message.role === 'assistant' ? 'prose prose-sm prose-slate prose-p:text-black prose-pre:bg-gray-50 max-w-none' : ''}`}>
              {message.status === 'sending' && (
                <div className="text-sm text-gray-500 mb-2">发送中...</div>
              )}
              {message.status === 'receiving' && (
                <div className="text-sm text-gray-500 mb-2">AI思考中...</div>
              )}
              <div className="relative">
                <div
                  className={`whitespace-pre-wrap prose ${message.status === 'receiving' ? 'animate-pulse' : ''}`}
                  dangerouslySetInnerHTML={{
                    __html: md.current.render(message.content || '')
                  }}
                />
                {message.role === 'assistant' && message.status !== 'receiving' && (
                  <button
                    className={`copy-button ${copiedId === message.id ? 'copied' : ''}`}
                    onClick={() => handleCopy(message.content, message.id)}
                    title="复制内容"
                  >
                    {copiedId === message.id ? (
                      <>
                        <RiCheckLine size={16} />
                        <span className="text-xs">已复制</span>
                      </>
                    ) : (
                      <>
                        <RiFileCopyLine size={16} />
                        <span className="text-xs">复制</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              {(message.status === 'failed') && (
                <div className="text-sm text-red-500 mt-2">
                  发送失败，请重试
                </div>
              )}
            </article>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 底部输入框 */}
      <div className="chat-input">
        <form onSubmit={handleSendMessage}>
          <div className="input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="输入消息..."
              rows="1"
              disabled={loading || !currentSession}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button 
              type="submit" 
              className="send-button flex items-center justify-center"
              disabled={loading || !currentSession}
            >
              <RiSendPlaneFill size={20} className="text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;