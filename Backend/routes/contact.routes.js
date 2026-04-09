// routes/contact.routes.js
import express from 'express';
import { addContact } from '../controllers/contact.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/contacts', protectRoute, addContact);

export default router;