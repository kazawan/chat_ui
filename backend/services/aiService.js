const OpenAI = require('openai');
const config = require('../config');

// 创建 OpenAI 客户端实例时显式传入配置
const openai = new OpenAI({
  apiKey: config.deepseek.apiKey,
  baseURL: config.deepseek.baseURL || 'https://api.deepseek.com/v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  defaultQuery: undefined,
  organization: undefined,
  dangerouslyAllowBrowser: false,
});

class AiService {
  static async generateChatResponse(messages) {
    try {
      // console.log('Using API Key:', config.deepseek.apiKey); // 调试用
      // console.log('Using Base URL:', config.deepseek.baseURL); // 调试用
      
      const completion = await openai.chat.completions.create({
        model: 'deepseek-chat',  // 直接使用模型名称
        messages: messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000
      });

      return completion;
    } catch (error) {
      console.error('AI 服务错误:', error);
      throw error;
    }
  }

  static formatMessages(sessionMessages) {
    // 确保消息格式符合 API 要求
    return sessionMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }
}

module.exports = AiService; 