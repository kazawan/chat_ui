const ChatSession = require('../db/models/ChatSession');
const ChatMessage = require('../db/models/ChatMessage');
const AiService = require('../services/aiService');
const { Op } = require('sequelize');

// 创建新的聊天会话
exports.createSession = async (req, res) => {
  try {
    const session = await ChatSession.create({
      userId: req.user.id,
      title: req.body.title || '新对话'
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: '创建会话失败', error: error.message });
  }
};

// 获取用户的所有聊天会话
exports.getSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.findAll({
      where: { userId: req.user.id },
      order: [['lastMessageTime', 'DESC']],
      include: [{
        model: ChatMessage,
        limit: 1,
        order: [['createdAt', 'DESC']]
      }]
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: '获取会话列表失败', error: error.message });
  }
};

// 获取特定会话的消息历史
exports.getSessionMessages = async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      where: {
        id: req.params.sessionId,
        userId: req.user.id
      }
    });

    if (!session) {
      return res.status(404).json({ message: '会话不存在' });
    }

    const messages = await ChatMessage.findAll({
      where: { sessionId: req.params.sessionId },
      order: [['createdAt', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: '获取消息历史失败', error: error.message });
  }
};

// 发送新消息
exports.sendMessage = async (req, res) => {
  const { content } = req.body;
  const sessionId = req.params.sessionId;

  try {
    // 验证会话归属权
    const session = await ChatSession.findOne({
      where: {
        id: sessionId,
        userId: req.user.id
      }
    });

    if (!session) {
      return res.status(404).json({ message: '会话不存在' });
    }

    // 创建用户消息
    const userMessage = await ChatMessage.create({
      content,
      role: 'user',
      sessionId
    });

    // 获取会话历史消息
    const sessionMessages = await ChatMessage.findAll({
      where: { sessionId },
      order: [['createdAt', 'ASC']],
      limit: 20 // 限制上下文长度
    });

    // 格式化消息历史
    const messages = AiService.formatMessages(sessionMessages);

    // 设置响应头，支持流式输出
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let aiMessageContent = '';

    try {
      const stream = await AiService.generateChatResponse(messages);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          aiMessageContent += content;
          // 发送数据块
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // 保存完整的 AI 响应
      const aiMessage = await ChatMessage.create({
        content: aiMessageContent,
        role: 'assistant',
        sessionId
      });

      // 更新会话最后消息时间
      await session.update({ lastMessageTime: new Date() });

      // 发送结束标记
      res.write('data: [DONE]\n\n');
    } catch (error) {
      console.error('AI 响应错误:', error);
      res.write(`data: ${JSON.stringify({ error: '生成回复时发生错误' })}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('处理消息错误:', error);
    res.status(500).json({ message: '发送消息失败', error: error.message });
  }
};

// 删除会话
exports.deleteSession = async (req, res) => {
  try {
    const result = await ChatSession.destroy({
      where: {
        id: req.params.sessionId,
        userId: req.user.id
      }
    });

    if (result === 0) {
      return res.status(404).json({ message: '会话不存在' });
    }

    res.json({ message: '会话已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除会话失败', error: error.message });
  }
};

// 更新会话标题
exports.updateSessionTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const session = await ChatSession.findOne({
      where: {
        id: req.params.sessionId,
        userId: req.user.id
      }
    });

    if (!session) {
      return res.status(404).json({ message: '会话不存在' });
    }

    await session.update({ title });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: '更新会话标题失败', error: error.message });
  }
}; 