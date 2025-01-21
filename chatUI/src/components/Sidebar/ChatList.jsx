import CloseChatDarkIcon from '../icons/CloseChat_dark_icon';
import AddChatIcon from '../icons/AddChat_icon';
import EditIcon from '../icons/Edit_icon';
import { useState } from 'react';

const ChatList = ({ chats, selectedChat, onSelectChat, onNewChat, onDeleteChat, onUpdateTitle }) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (chat) => {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = async (chatId) => {
    if (editTitle.trim()) {
      await onUpdateTitle(chatId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleKeyPress = (e, chatId) => {
    if (e.key === 'Enter') {
      handleSaveEdit(chatId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditTitle('');
    }
  };

  const handleDelete = async (e, chatId) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发选择聊天
    onDeleteChat(chatId);
  };

  return (
    <div className="flex flex-col flex-1">
      {/* 新增聊天按钮 */}
      <div className="p-2 bg-gray-700">
        <button 
          onClick={onNewChat}
          className="w-full p-2 bg-black text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-700 active:scale-95 active:bg-gray-600 transition-all duration-100"
        >
          <AddChatIcon className="h-6 w-6" />
          <span>新增聊天</span>
        </button>
      </div>

      {/* 聊天列表 */}
      <div className="p-4 bg-gray-700 text-black flex-1">
        <div className="space-y-2">
          {Array.isArray(chats) && chats.length > 0 ? (
            chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isSelected={selectedChat?.id === chat.id}
                isEditing={editingId === chat.id}
                editTitle={editTitle}
                onEditTitle={setEditTitle}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onKeyPress={handleKeyPress}
                onClick={() => onSelectChat(chat)}
                onDelete={(e) => handleDelete(e, chat.id)}
              />
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">
              暂无聊天记录
            </div>
          )}
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
};

function ChatItem({ 
  chat, 
  isSelected, 
  isEditing,
  editTitle,
  onEditTitle,
  onStartEdit,
  onSaveEdit,
  onKeyPress,
  onClick, 
  onDelete 
}) {
  return (
    <div
      className={`p-2 rounded border border-black flex justify-between items-center cursor-pointer transition-colors
        ${isSelected ? 'bg-black text-white' : 'bg-white text-black'}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => onEditTitle(e.target.value)}
            onBlur={() => onSaveEdit(chat.id)}
            onKeyDown={(e) => onKeyPress(e, chat.id)}
            className="bg-white text-black px-2 py-1 rounded w-full mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <>
            <span className="truncate">{chat.title}</span>
            <div className="flex items-center space-x-1">
              <button
                className="text-gray-500 hover:text-blue-500 p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartEdit(chat);
                }}
                title="编辑标题"
              >
                <EditIcon className="h-4 w-4" />
              </button>
              <button
                className="text-gray-500 hover:text-red-500 p-1"
                onClick={onDelete}
                title="删除对话"
              >
                <CloseChatDarkIcon className="h-4 w-3" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatList; 