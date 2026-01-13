import express from 'express';
import clientRoutes from './clientRoutes.js'; 
import chambreRoutes from './chambreRoutes.js';
import reservationRoutes from './reservationRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

// route d'authentification
router.use('/', authRoutes);

// route métiers
router.use('/clients', clientRoutes);
router.use('/chambres', chambreRoutes);
router.use('/reservations', reservationRoutes);

export default router;  