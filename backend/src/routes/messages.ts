import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { createMessage, getConversationMessages, listConversations, } from '../controllers/messageController.js';

const router = Router();

// Conversation summaries (sorted by latest message time)
router.get('/conversations', isAuthenticated, listConversations);

// Messages in a single conversation
router.get('/conversations/:conversationId', isAuthenticated, getConversationMessages);

// Send/store a message
router.post('/new-message', isAuthenticated, createMessage);

export default router;
