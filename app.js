import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import routes from './src/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Middleware 404 (doit être AVANT app.listen)
app.use((req, res, next) => {
    res.status(404).render('404');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur sur port ${PORT} et sur l'adresse http://localhost:${PORT}`);
});

export default app;