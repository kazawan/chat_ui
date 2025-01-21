const OpenAI = require('openai');
const config = require('../config');

const openai = new OpenAI({
  apiKey: config.deepseek.apiKey,
  baseURL: config.deepseek.baseURL
});

class AiService {
  static async generateChatResponse(messages) {
    try {
      const completion = await openai.chat.completions.create({
        model: config.deepseek.model,
        messages: messages,
        stream: true,
        temperature: 0.7
      });

      return completion;
    } catch (error) {
      console.error('AI 服务错误:', error);
      throw error;
    }
  }

  static formatMessages(sessionMessages) {
    return sessionMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }
}

module.exports = AiService; 