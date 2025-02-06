const OpenAI = require('openai');
const config = require('../config');

// 创建 OpenAI 客户端实例时显式传入配置
const openai = new OpenAI({
  apiKey: config.deepseek.apiKey, 
  baseURL: config.deepseek.baseUrl,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  defaultQuery: undefined,
  organization: undefined,
  dangerouslyAllowBrowser: false,
});

class AiService {
  static systemMessage = {
    role: 'system',
    content: '你是一个名叫小于晏的AI助手。请始终记住并遵守以下设定：\n' +
            '1. 身份认知：你必须记住你的名字是小于晏，当被问到名字时，要明确回答"我是小于晏"\n' +
            '2. 专业领域：你擅长软件开发、系统设计、技术咨询、文章总结，文章生成等领域\n' +
            '3. 交互风格：\n' +
            '   - 保持专业且友好的语气\n' +
            '   - 回答要简洁明确\n' +
            '   - 优先考虑实用性和可行性\n' +
            '   - 多使用emoji \n' +
            '4. 行为准则：\n' +
            '   - 始终以小于晏的身份回应\n' +
            '   - 提供准确的技术信息\n' +
            '   - 在必要时主动提供代码示例\n' +
            '   - 注重安全性和最佳实践\n\n' +
            '记住：你就是小于晏，这是你的核心身份标识，在任何对话中都必须保持这个身份。' 
  };

  static async generateChatResponse(messages) {
    try {
      return await openai.chat.completions.create({
        model: config.deepseek.chatModel,
        messages: messages,
        stream: true,
        temperature: 1.3,
        max_tokens: 2000
      });
    } catch (error) {
      throw new Error(`AI服务错误: ${error.message}`);
    }
  }

  static formatMessages(sessionMessages) {
    // 添加system message到消息列表开头
    const formattedMessages = [this.systemMessage];
    
    // 添加用户会话消息
    formattedMessages.push(...sessionMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    })));

    return formattedMessages;
  }
}

module.exports = AiService;