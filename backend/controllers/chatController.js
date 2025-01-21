const ChatSession = require('../db/models/ChatSession');
const ChatMessage = require('../db/models/ChatMessage');
const AiService = require('../services/aiService');
const { Op } = require('sequelize');
const { sequelize } = require('../db/models/index');

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
    console.log('获取用户会话, 用户ID:', req.user.id); // 添加日志

    const sessions = await ChatSession.findAll({
      where: { userId: req.user.id },
      order: [['lastMessageTime', 'DESC']],
      include: [{
        model: ChatMessage,
        as: 'messages',
        limit: 1,
        order: [['createdAt', 'DESC']]
      }]
    });

    console.log('找到的会话数量:', sessions.length); // 添加日志
    res.json(sessions);
  } catch (error) {
    console.error('获取会话列表失败:', error);
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

    // 更新会话最后消息时间
    await session.update({ lastMessageTime: new Date() });

    // 获取会话历史消息用于上下文
    const sessionMessages = await ChatMessage.findAll({
      where: { sessionId },
      order: [['createdAt', 'ASC']],
      limit: 20 // 限制上下文长度
    });

    // 格式化消息历史
    const messages = sessionMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

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

      // 发送结束标记
      res.write('data: [DONE]\n\n');
    } catch (error) {
      console.error('AI 响应错误:', error);
      res.write(`data: ${JSON.stringify({ error: '生成回复时发生错误' })}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('处理消息错误:', error);
    // 如果还没有开始流式响应，返回普通的错误响应
    if (!res.headersSent) {
      res.status(500).json({ message: '发送消息失败', error: error.message });
    } else {
      // 如果已经开始流式响应，发送错误事件
      res.write(`data: ${JSON.stringify({ error: '发送消息失败' })}\n\n`);
      res.end();
    }
  }
};

// 删除会话
exports.deleteSession = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    // 首先删除所有相关的消息
    await ChatMessage.destroy({
      where: {
        sessionId: req.params.sessionId
      },
      transaction: t
    });

    // 然后删除会话
    const result = await ChatSession.destroy({
      where: {
        id: req.params.sessionId,
        userId: req.user.id
      },
      transaction: t
    });

    if (result === 0) {
      await t.rollback();
      return res.status(404).json({ message: '会话不存在' });
    }

    await t.commit();
    res.json({ message: '会话已删除' });
  } catch (error) {
    await t.rollback();
    console.error('删除会话失败:', error);
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