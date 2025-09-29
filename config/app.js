const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

const routes = require('../src/routes');
app.get('/', routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur sur port ${PORT} connecter sur http://localhost:3000`);
});

module.exports = app;