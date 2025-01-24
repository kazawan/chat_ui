import React, { useState, useRef } from 'react';
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
  RiDeleteBinLine
} from "react-icons/ri";
import ConversationList from '../ConversationList/ConversationList';

const ChatArea = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleExportChat = () => {
    setIsDropdownOpen(false);
    // TODO: 实现导出聊天记录逻辑
    console.log('导出聊天记录');
  };

  const handleDeleteConversation = () => {
    setIsDropdownOpen(false);
    // TODO: 实现删除对话逻辑
    console.log('删除对话');
  };
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
      return ''; // use external default escaping
    }
  }));

  const [messages, setMessages] = useState([
    { id: 1, type: 'user', content: '你好，请给我一个简单的Python Hello World示例。' },
    { id: 2, type: 'ai', content: `当然可以！以下是一个简单的 Python 函数，用于打印 "Hello, World!"：

\`\`\`python
def print_hello_world():
    # 这个函数打印 "Hello, World!"
    print("Hello, World!")

# 调用函数
print_hello_world()
\`\`\`

在这个示例中，我们定义了一个名为 \`print_hello_world\` 的函数。该函数使用 \`print\` 语句输出 "Hello, World!"。然后，我们调用这个函数来执行打印操作。

你可以将这段代码复制到你的 Python 环境中运行，看看效果。` },
  ]);

  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

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
        {/* 侧边栏头部 */}
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

        {/* 对话列表 */}
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
          {/* 侧边栏和新对话按钮 */}
          <button
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsSidebarOpen(true)}
          >
            <RiMenuLine size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200">
            <RiAddLine size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="header-container">
          <div className="header-title">
            新对话
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
            className={`message ${message.type === 'user' ? 'message-user' : 'message-ai'}`}
          >
            <article  className={`message-content ${message.type === 'ai' ? 'prose prose-sm prose-slate prose-p:text-black prose-pre:bg-gray-50 max-w-none' : ''}`}>
              <div
                className="whitespace-pre-wrap prose"
                dangerouslySetInnerHTML={{
                  __html: md.current.render(message.content)
                }}
              />
            </article >
            
          </div>
        ))}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button type="submit" className="send-button flex items-center justify-center">
              <RiSendPlaneFill size={20} className="text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;