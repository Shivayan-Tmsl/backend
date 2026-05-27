import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getPrediction } from '../controllers/aiController.js';

const router = express.Router();

router.get('/prediction', authMiddleware, getPrediction);

export default router;