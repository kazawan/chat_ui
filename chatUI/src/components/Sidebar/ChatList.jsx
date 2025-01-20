import CloseChatDarkIcon from '../icons/CloseChat_dark_icon';
import AddChatIcon from '../icons/AddChat_icon';

import { useState } from 'react';

export default function ChatList({ selectedChat, onSelectChat }) {

  return (
    <div className="flex flex-col flex-1">
      {/* 新增聊天按钮 */}
      <div className="p-2 bg-gray-700">
        <button className="w-full p-2 bg-black text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-700 active:scale-95 active:bg-gray-600 transition-all duration-100">
          <AddChatIcon className="h-6 w-6" />
          <span>新增聊天</span>
        </button>
      </div>

      {/* 聊天列表 */}
      <div className="p-4 bg-gray-700 text-black flex-1">
        <div className="space-y-2">
          <ChatItem
            title="聊天1"
            isSelected={selectedChat === '聊天1'}
            onClick={() => onSelectChat('聊天1')}
          />
          <ChatItem
            title="聊天2"
            isSelected={selectedChat === '聊天2'}
            onClick={() => onSelectChat('聊天2')}
          />
        </div>
      </div>

      {/* 版权信息 */}
      <div className="p-4 text-center text-gray-400 text-sm bg-gray-800">
        © 2025 DeepseekChatUI. All rights reserved.<br />
        <a href="https://github.com/kazawan/deepseekChatUI" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
          kazawan/deepseekChatUI
        </a>
      </div>
    </div>
  );
}

function ChatItem({ title, isSelected, onClick }) {
  return (
    <div
      className={`p-2 rounded border border-black flex justify-between items-center cursor-pointer transition-colors
        ${isSelected ? 'bg-black text-white' : 'bg-white text-black'}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full">
        <span>{title}</span>
        <div className="flex items-center text-gray-500 hover:text-red-500 cursor-pointer">
          <CloseChatDarkIcon className="h-4 w-3" />
        </div>
      </div>
    </div>
  );
} 