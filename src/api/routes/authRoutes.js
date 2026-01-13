import express from 'express';
import CtrlAuth from '../controllers/authController.js';

const router = express.Router();

// route de login pour l’API
router.post('/login', CtrlAuth.login);

export default router;