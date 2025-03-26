import { Router } from 'express';
import { createPayPalOrder, capturePayPalOrder } from './paypalController.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = Router();

router.post('/create-order', verifyToken, createPayPalOrder);
router.post('/capture-order', verifyToken, capturePayPalOrder);

export default router; 