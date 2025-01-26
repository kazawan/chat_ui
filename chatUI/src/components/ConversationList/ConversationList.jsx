import React, { useEffect } from 'react';
import { RiMessage2Line, RiTimeLine, RiStarLine } from "react-icons/ri";
import { useChatStore, chatService } from '../../services/chatService';
import { messageService } from '../../services/messageService';

const ConversationList = ({ isOpen, onSelectSession }) => {
  const { 
    sessions,
    currentSession,
    setCurrentSession,
    setSessions
  } = useChatStore();

  // 加载会话列表
  useEffect(() => {
    const loadSessions = async () => {
      if (isOpen) {
        try {
          const loadedSessions = await chatService.getSessions();
          // 如果存在会话且当前没有选中的会话，则选择最新的会话
          if (loadedSessions.length > 0 && !currentSession) {
            // 根据创建时间排序，选择最新的会话
            const latestSession = loadedSessions.reduce((latest, current) => {
              return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
            }, loadedSessions[0]);
            handleSelectSession(latestSession);
          }
        } catch (error) {
          messageService.error('获取会话列表失败');
        }
      }
    };
    loadSessions();
  }, [isOpen]); // 只在isOpen变化时触发

  // 选择会话
  const handleSelectSession = async (session) => {
    try {
      // 先获取消息，再设置当前会话
      const messages = await chatService.getSessionMessages(session.id);
      // 设置当前会话和其消息
      setCurrentSession({
        ...session,
        messages: messages
      });
    } catch (error) {
      messageService.error('获取会话消息失败');
    }
  };

  // 切换会话星标状态
  const handleToggleStarred = async (e, session) => {
    e.stopPropagation(); // 防止触发会话选择
    try {
      await chatService.updateSessionTitle(session.id, {
        ...session,
        isStarred: !session.isStarred
      });
      
      // 更新本地状态
      setSessions(sessions.map(s => 
        s.id === session.id 
          ? { ...s, isStarred: !s.isStarred }
          : s
      ));
    } catch (error) {
      messageService.error('更新会话状态失败');
    }
  };

  // 格式化时间戳
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays <= 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto conversation-list">
      <div className="space-y-2 p-4">
        {sessions.map((session, index) => (
          <div
            key={session.id}
            onClick={() => handleSelectSession(session)}
            className={`p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-300 transform group ${
              currentSession?.id === session.id ? 'bg-gray-100' : ''
            }`}
            style={{
              opacity: isOpen ? 1 : 0,
              transform: `translateX(${isOpen ? '0' : '-20px'})`,
              transitionDelay: `${(index + 2) * 50}ms`
            }}
          >
            {/* 主要内容区 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <RiMessage2Line className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate pr-2">
                    {session.title || '新对话'}
                  </h3>
                  <button 
                    onClick={(e) => handleToggleStarred(e, session)}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      session.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <RiStarLine className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {session.lastMessage || '暂无消息'}
                </p>
                <div className="mt-1 flex items-center text-xs text-gray-400">
                  <RiTimeLine className="w-3 h-3 mr-1" />
                  <span>{formatTimestamp(session.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;