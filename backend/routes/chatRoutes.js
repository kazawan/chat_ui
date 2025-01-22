const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// 所有路由都需要认证
router.use(auth);

// 获取提示卡片
router.get('/prompt-cards', chatController.getPromptCards);

// 会话管理
router.post('/sessions', chatController.createSession);
router.get('/sessions', chatController.getSessions);
router.put('/sessions/:sessionId/title', chatController.updateSessionTitle);
router.delete('/sessions/:sessionId', chatController.deleteSession);

// 消息管理
router.get('/sessions/:sessionId/messages', chatController.getSessionMessages);
router.post('/sessions/:sessionId/messages', chatController.sendMessage);
router.post('/sessions/:sessionId/messages/:messageId/regenerate', chatController.regenerateMessage);

module.exports = router; 