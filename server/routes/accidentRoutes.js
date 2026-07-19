import express from 'express';
import { createAccident } from '../controllers/accidentController.js';

const router = express.Router();

router.post('/', createAccident);
    
export default router;
