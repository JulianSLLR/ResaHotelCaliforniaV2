import express from 'express';
import clientRoutes from './clientRoutes.js'; 
import chambreRoutes from './chambreRoutes.js';
import reservationRoutes from './reservationRoutes.js';

const router = express.Router();

router.use('/clients', clientRoutes);
router.use('/chambres', chambreRoutes);
router.use('/reservations', reservationRoutes);
export default router;  