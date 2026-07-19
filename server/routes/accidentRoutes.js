import express from 'express';
import { createAccident, getAccidents } from '../controllers/accidentController.js';

const router = express.Router();

router.post('/', createAccident);
router.get('/', getAccidents);
    
export default router;
