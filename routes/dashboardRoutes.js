import express from 'express';
import { getDashboardData } from '../controllers/dashboardControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/data',authMiddleware, getDashboardData);

export default router;