import express from 'express';
import { createCamera } from '../controllers/cameraController.js';

const router = express.Router();

router.post('/', createCamera);

export default router;
