// routes/groupChat.routes.js
import express from 'express';
import { createGroupChat } from '../controllers/groupChat.controller.js';
import protectRoute from '../middleware/protectRoute.js'; 

const router = express.Router();

router.post('/', protectRoute, createGroupChat);

export default router;