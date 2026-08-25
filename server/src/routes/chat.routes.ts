import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { chatMessageLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/conversations', ChatController.getConversations);
router.post('/conversations', ChatController.getOrCreateConversation);
router.get('/conversations/:conversationId/messages', ChatController.getMessages);
router.post('/conversations/:conversationId/messages', chatMessageLimiter, ChatController.sendMessage);

export default router;
