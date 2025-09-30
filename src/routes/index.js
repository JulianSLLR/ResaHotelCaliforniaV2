const express = require('express');
const chambresRoutes = require('./chambres');

const router = express.Router();

// Page d'accueil
router.get('/', (req, res) => {
    res.render('accueil');
});

// Routes pour les chambres
router.use('/chambres', chambresRoutes);

module.exports = router;
