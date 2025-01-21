const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// 所有路由都需要认证
router.use(auth);

// 会话管理
router.post('/sessions', chatController.createSession);
router.get('/sessions', chatController.getSessions);
router.put('/sessions/:sessionId/title', chatController.updateSessionTitle);
router.delete('/sessions/:sessionId', chatController.deleteSession);

// 消息管理
router.get('/sessions/:sessionId/messages', chatController.getSessionMessages);
router.post('/sessions/:sessionId/messages', chatController.sendMessage);

module.exports = router; 