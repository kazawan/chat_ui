import { create } from 'zustand';
import axios from 'axios';

// API基础URL
const API_URL = import.meta.env.VITE_BASE_URL + '/api/chat' || 'http://localhost:3001/api/chat';

// 生成UUID的兼容性函数
const generateUUID = () => {
  // 检查是否支持crypto.randomUUID()
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // 降级方案：手动生成UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// 聊天状态管理
const useChatStore = create((set) => ({
  sessions: [],
  currentSession: null,
  messages: [],
  loading: false,
  error: null,

  // 设置加载状态
  setLoading: (loading) => set({ loading }),
  
  // 设置错误
  setError: (error) => set({ error }),
  
  // 设置会话列表
  setSessions: (sessions) => set({ sessions }),
  
  // 设置当前会话
  setCurrentSession: (session) => set(state => {
    const currentSession = session;
    let messages = [];
    if (session) {
      // 如果有当前会话，查找其对应的消息
      const sessionMessages = state.messages.filter(msg => msg.sessionId === session.id);
      if (sessionMessages.length > 0) {
        messages = sessionMessages;
      }
      // 在控制台显示当前会话的UUID
      console.log('Current session UUID:', session.uuid);
    }
    return { currentSession, messages };
  }),
  
  // 设置消息列表
  setMessages: (messages) => set({ messages }),
  
  // 添加新消息
  addMessage: (message) => set(state => ({
    messages: [...state.messages, message]
  })),
  
  // 更新消息
  updateMessage: (messageId, updates) => set(state => ({
    messages: state.messages.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    )
  })),
}));

// 聊天服务
const chatService = {
  // 获取所有会话
  async getSessions() {
    const store = useChatStore.getState();
    store.setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/sessions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // 为每个会话添加clientUUID
      const sessionsWithUUID = response.data.map(session => ({
        ...session,
        clientUUID: generateUUID()
      }));
      store.setSessions(sessionsWithUUID);
      return sessionsWithUUID;
    } catch (error) {
      store.setError(error.response?.data?.message || '获取会话列表失败');
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  // 创建新会话
  async createSession() {
    const store = useChatStore.getState();
    store.setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/sessions`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const sessionData = {
        ...response.data,
        clientUUID: generateUUID()
      };
      store.setCurrentSession(sessionData);
      store.setMessages([]);
      return sessionData;
    } catch (error) {
      store.setError(error.response?.data?.message || '创建会话失败');
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  // 获取会话消息
  async getSessionMessages(sessionId) {
    const store = useChatStore.getState();
    store.setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/sessions/${sessionId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // 确保消息有正确的会话ID
      const messagesWithSessionId = response.data.map(msg => ({
        ...msg,
        sessionId
      }));

      // 更新消息状态
      store.setMessages(messagesWithSessionId);
      return messagesWithSessionId;
    } catch (error) {
      store.setError(error.response?.data?.message || '获取消息失败');
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  // 发送消息
  async sendMessage(sessionId, content) {
    const store = useChatStore.getState();
    const tempMessage = {
      id: Date.now(),
      content,
      role: 'user',
      status: 'sending'
    };
    try {
      store.addMessage(tempMessage);

      const tempAiMessage = {
        id: Date.now() + 1,
        content: '',
        role: 'assistant',
        status: 'receiving'
      };
      store.addMessage(tempAiMessage);

      const response = await fetch(
        `${API_URL}/sessions/${sessionId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ content })
        }
      );

      if (!response.ok) {
        throw new Error('发送消息失败');
      }

      const reader = response.body.getReader();
      let aiMessageContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 将 Uint8Array 转换为字符串
        const chunk = new TextDecoder().decode(value);
        // 处理SSE格式的数据
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              break;
            }
            try {
              const parsedData = JSON.parse(data);
              if (parsedData.content) {
                aiMessageContent += parsedData.content;
                store.updateMessage(tempAiMessage.id, {
                  content: aiMessageContent,
                  status: 'receiving'
                });
              }
            } catch (e) {
              console.error('解析SSE数据失败:', e);
            }
          }
        }
      }

      // 更新临时消息状态
      store.updateMessage(tempMessage.id, {
        status: 'sent'
      });

      // 更新AI消息状态
      store.updateMessage(tempAiMessage.id, {
        status: 'received'
      });

      // 更新会话列表以获取最新的 lastMessage
      await this.getSessions();

      return { success: true };
    } catch (error) {
      // 更新消息状态为失败
      store.updateMessage(tempMessage.id, {
        status: 'failed'
      });
      store.setError(error.response?.data?.message || '发送消息失败');
      throw error;
    }
  },

  // 重新生成消息
  async regenerateMessage(sessionId, messageId) {
    const store = useChatStore.getState();
    store.setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/sessions/${sessionId}/messages/${messageId}/regenerate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // 更新消息列表中的AI响应
      if (response.data.aiMessage) {
        store.updateMessage(messageId, response.data.aiMessage);
      }
      return response.data;
    } catch (error) {
      store.setError(error.response?.data?.message || '重新生成消息失败');
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  // 更新会话标题
  async updateSessionTitle(sessionId, title) {
    const store = useChatStore.getState();
    try {
      const response = await axios.put(
        `${API_URL}/sessions/${sessionId}/title`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // 更新会话列表中的标题
      store.setSessions(store.sessions.map(session => 
        session.id === sessionId ? { ...session, title } : session
      ));
      
      return response.data;
    } catch (error) {
      store.setError(error.response?.data?.message || '更新会话标题失败');
      throw error;
    }
  },

  // 删除会话
  async deleteSession(sessionId) {
    const store = useChatStore.getState();
    try {
      await axios.delete(`${API_URL}/sessions/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // 从会话列表中移除已删除的会话
      const updatedSessions = store.sessions.filter(session => session.id !== sessionId);
      store.setSessions(updatedSessions);
      
      // 如果删除的是当前会话，且还有其他会话存在，则选择最新的会话
      if (store.currentSession?.id === sessionId) {
        if (updatedSessions.length > 0) {
          // 根据创建时间排序，选择最新的会话
          const latestSession = updatedSessions.reduce((latest, current) => {
            return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
          }, updatedSessions[0]);
          
          // 获取最新会话的消息并设置为当前会话
          const messages = await this.getSessionMessages(latestSession.id);
          store.setCurrentSession({
            ...latestSession,
            messages: messages
          });
        } else {
          // 如果没有其他会话，清空当前会话
          store.setCurrentSession(null);
          store.setMessages([]);
        }
      }
    } catch (error) {
      store.setError(error.response?.data?.message || '删除会话失败');
      throw error;
    }
  },

  // 重置所有聊天状态
  resetChatState() {
    const store = useChatStore.getState();
    store.setSessions([]);
    store.setCurrentSession(null);
    store.setMessages([]);
    store.setLoading(false);
    store.setError(null);
  }
};

export { useChatStore, chatService };