const express = require('express');
const path = require('path');
const routes = require('./src/routes/index');

const app = express();

// Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour parser les données des formulaires
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Fichiers statiques (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur sur port ${PORT} et sur l'adresse http://localhost:${PORT}`);
});

//middleware
app.use((req, res, next) => {
    res.status(404).render('404');
});

module.exports = app;