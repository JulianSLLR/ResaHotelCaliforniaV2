import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import routes from './src/routes/index.js';
import apiRoutes from './src/api/routes/index.js';
import https from 'https';
import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import morgan from 'morgan';

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

// Middleware pour les logs et la sécurité
app.use(cors());
app.use(morgan('tiny')); 

// Routes
app.use('/', routes);
app.use('/api', apiRoutes);

//middleware 404 
app.use((req, res, next) => {
    res.status(404).render('404');
});

const PORT = 3001;

// Configuration SSL
const sslOptions = {
 key: fs.readFileSync(path.join(__dirname, 'ssl', 'private.key')),
 cert: fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.crt'))
};


// Serveur HTTPS (port 3001)
const httpsServer = https.createServer(sslOptions, app);
httpsServer.listen(PORT, () => {
    console.log(`Serveur sur port ${PORT} et sur l'adresse https://localhost:${PORT}`);
});

export default app;