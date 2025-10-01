import express from 'express';
import chambresRoutes from './chambres.js';
import clientsRoutes from './clients.js';

const router = express.Router();

// Page d'accueil
router.get('/', (req, res) => {
    res.render('accueil');
});

// Routes pour les chambres
router.use('/chambres', chambresRoutes);
// Routes pour les clients
router.use('/clients', clientsRoutes);

export default router;



