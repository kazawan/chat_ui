const ChatSession = require('../db/models/ChatSession');
const ChatMessage = require('../db/models/ChatMessage');
const AiService = require('../services/aiService');
const db = require('../db/database');

// 创建新的聊天会话
exports.createSession = async (req, res) => {
  try {
    // 创建会话
    const sessionId = ChatSession.create({
      userId: req.user.id,
      title: req.body.title || '新对话'
    });

    // 获取创建的会话完整信息
    const session = ChatSession.findById(sessionId);
    
    // 格式化返回数据以匹配前端期望的格式
    const formattedSession = {
      id: session.id,
      userId: session.userId,
      title: session.title,
      lastMessageTime: session.lastMessageTime,
      createdAt: session.createdAt,
      messages: [] // 新会话没有消息
    };

    res.status(201).json(formattedSession);
  } catch (error) {
    console.error('创建会话失败:', error);
    res.status(500).json({ message: '创建会话失败', error: error.message });
  }
};

// 获取用户的所有聊天会话
exports.getSessions = async (req, res) => {
  try {
    const sessions = ChatSession.findByUserId(req.user.id);
    
    // 格式化返回数据
    const formattedSessions = sessions.map(session => ({
      id: session.id,
      userId: session.userId,
      title: session.title,
      lastMessageTime: session.lastMessageTime,
      createdAt: session.createdAt,
      messages: session.lastMessage ? [{
        content: session.lastMessage,
        role: 'assistant'
      }] : []
    }));

    res.json(formattedSessions);
  } catch (error) {
    console.error('获取会话列表失败:', error);
    res.status(500).json({ message: '获取会话列表失败', error: error.message });
  }
};

// 获取特定会话的消息历史
exports.getSessionMessages = async (req, res) => {
  try {
    // 验证会话归属权
    const session = ChatSession.findById(req.params.sessionId);
    
    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ message: '会话不存在' });
    }

    // 获取会话的所有消息
    const messages = ChatMessage.findBySessionId(req.params.sessionId);

    // 格式化消息以匹配前端期望的格式
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      sessionId: msg.sessionId,
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt
    }));

    res.json(formattedMessages);
  } catch (error) {
    console.error('获取消息历史失败:', error);
    res.status(500).json({ message: '获取消息历史失败', error: error.message });
  }
};

// 发送新消息
exports.sendMessage = async (req, res) => {
  const { content } = req.body;
  const sessionId = req.params.sessionId;

  try {
    // 验证会话归属权
    const session = ChatSession.findById(sessionId);
    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ message: '会话不存在' });
    }

    // 使用事务来确保数据一致性
    const sendMessageTx = db.transaction(() => {
      // 创建用户消息
      ChatMessage.create({
        sessionId,
        role: 'user',
        content
      });

      // 更新会话最后消息时间
      ChatSession.updateLastMessageTime(sessionId);
    });

    sendMessageTx();

    // 获取会话历史消息
    const messages = ChatMessage.findBySessionId(sessionId);
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // 设置响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let aiMessageContent = '';

    try {
      const stream = await AiService.generateChatResponse(formattedMessages);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          aiMessageContent += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // 保存 AI 回复
      const saveMsgTx = db.transaction(() => {
        ChatMessage.create({
          sessionId,
          role: 'assistant',
          content: aiMessageContent
        });
        ChatSession.updateLastMessageTime(sessionId);
      });

      saveMsgTx();

      res.write('data: [DONE]\n\n');
    } catch (error) {
      console.error('AI 响应错误:', error);
      res.write(`data: ${JSON.stringify({ error: '生成回复时发生错误' })}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('处理消息错误:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: '发送消息失败', error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: '发送消息失败' })}\n\n`);
      res.end();
    }
  }
};

// 删除会话
exports.deleteSession = async (req, res) => {
  try {
    // 首先验证会话归属权
    const session = ChatSession.findById(req.params.sessionId);
    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ message: '会话不存在' });
    }

    // 使用事务删除会话及其消息
    const deleteTx = db.transaction(() => {
      // 删除所有相关的消息
      ChatMessage.delete({
        sessionId: req.params.sessionId
      });

      // 删除会话
      ChatSession.delete(req.params.sessionId);
    });

    deleteTx();

    res.json({ message: '会话已删除' });
  } catch (error) {
    console.error('删除会话失败:', error);
    res.status(500).json({ message: '删除会话失败', error: error.message });
  }
};

// 更新会话标题
exports.updateSessionTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const session = ChatSession.findById(req.params.sessionId);
    
    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ message: '会话不存在' });
    }

    ChatSession.update(req.params.sessionId, { title });
    
    // 获取更新后的会话
    const updatedSession = ChatSession.findById(req.params.sessionId);
    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: '更新会话标题失败', error: error.message });
  }
};

// 重新生成消息
exports.regenerateMessage = async (req, res) => {
  const { messageId } = req.params;
  const sessionId = req.params.sessionId;

  try {
    // 验证会话归属权
    const session = ChatSession.findById(sessionId);
    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ message: '会话不存在' });
    }

    // 获取要重新生成的消息
    const message = ChatMessage.findById(messageId);
    if (!message || message.sessionId !== parseInt(sessionId) || message.role !== 'assistant') {
      return res.status(404).json({ message: '消息不存在' });
    }

    // 获取历史消息
    const messages = ChatMessage.findBySessionId(sessionId);
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // 设置响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let aiMessageContent = '';

    try {
      const stream = await AiService.generateChatResponse(formattedMessages);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          aiMessageContent += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // 更新消息内容
      ChatMessage.update(messageId, { content: aiMessageContent });

      res.write('data: [DONE]\n\n');
    } catch (error) {
      console.error('AI 响应错误:', error);
      res.write(`data: ${JSON.stringify({ error: '生成回复时发生错误' })}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('重新生成消息错误:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: '重新生成消息失败', error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: '重新生成消息失败' })}\n\n`);
      res.end();
    }
  }
};

// 获取提示卡片
exports.getPromptCards = async (req, res) => {
  try {
    // 这里定义一些示例提示卡片
    const promptCards = [
      {
        id: 1,
        title: '写作助手',
        prompts: [
          '帮我写一篇关于人工智能的文章',
          '如何提高我的写作技巧？',
          '帮我修改一下这段文字的语法和表达'
        ]
      },
      {
        id: 2,
        title: '代码专家',
        prompts: [
          '解释一下这段代码是什么意思',
          '帮我优化这个算法的性能',
          '如何解决这个编程问题？'
        ]
      },
      {
        id: 3,
        title: '学习顾问',
        prompts: [
          '推荐一些学习编程的资源',
          '如何制定有效的学习计划？',
          '帮我分析一下这个知识点'
        ]
      },
      {
        id: 4,
        title: '创意激发',
        prompts: [
          '给我一些创新的项目想法',
          '如何提高创造力？',
          '帮我头脑风暴一个主题'
        ]
      }
    ];

    res.json(promptCards);
  } catch (error) {
    console.error('获取提示卡片失败:', error);
    res.status(500).json({ message: '获取提示卡片失败', error: error.message });
  }
}; 