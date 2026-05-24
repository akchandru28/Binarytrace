import { Router } from 'express';
import { piiRedact } from '../middleware/piiRedact.js';
import { sendMessage, getConversations, getConversation, deleteConversation } from '../controllers/chat.controller.js';

const router = Router();
router.post('/chat', piiRedact, sendMessage);
router.get('/conversations', getConversations);
router.get('/conversation/:id', getConversation);
router.delete('/conversation/:id', deleteConversation);
export default router;
