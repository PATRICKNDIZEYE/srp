import express from 'express';
import { getAllDailySales, createDailySale, updateDailySale, deleteDailySale, updateDailySaleStatus } from '../models/dailySaleModel.js';

const router = express.Router();

router.get('/', getAllDailySales);
router.post('/', createDailySale);
router.patch('/:id', updateDailySale);
router.delete('/:id', deleteDailySale);
router.patch('/:id/status', updateDailySaleStatus);

export default router; 