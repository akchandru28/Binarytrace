import { Router } from 'express';
import { getMetrics, getLogs } from '../controllers/metrics.controller.js';

const router = Router();
router.get('/metrics', getMetrics);
router.get('/logs', getLogs);
export default router;
