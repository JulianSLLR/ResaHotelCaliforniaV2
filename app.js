const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const routes = require('./src/routes');
app.use('/', routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur sur port ${PORT} : adresse http://localhost:${PORT}`);
});

module.exports = app;