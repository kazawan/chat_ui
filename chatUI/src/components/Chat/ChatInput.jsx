import { useState, useEffect } from 'react';
import DocIcon from '../icons/Doc_icon';
import LoadingIcon from '../icons/loading_icon_ani';

const ChatInput = ({ isLoading, currentChat, onSend }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!message.trim() || isLoading) return;

    const content = message.trim();
    setMessage('');

    try {
      await onSend(content);
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="p-4 bg-gray-200 sticky bottom-0">
      <div className="text-sm text-gray-500 mb-2">
        {currentChat ? `当前聊天：${currentChat.title}` : '请选择一个聊天'}
        <span className="ml-4">⚠️ctrl + i 聚焦到输入框.....</span>
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          disabled={!currentChat || isLoading}
          className="flex-1 p-2 rounded-lg border focus:outline-none focus:border-black"
        />
        <button
          onClick={handleSubmit}
          disabled={!currentChat || !message.trim() || isLoading}
          className="px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center active:scale-95 transition-transform disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <LoadingIcon className="h-5 w-5 animate-spin" />
          ) : (
            '发送'
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput; 