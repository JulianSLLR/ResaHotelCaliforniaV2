import express from 'express';
import chambresRoutes from './chambres.js';

const router = express.Router(); 

// Page d'accueil
router.get('/', (req, res) => {
    res.render('accueil');
});

// Routes pour les chambres
router.use('/chambres', chambresRoutes);




export default router;



