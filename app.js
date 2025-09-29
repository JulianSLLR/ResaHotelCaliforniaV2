const express = require('./node_modules/express');
const path = require('./node_modules/path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const routes = require('./src/routes');
app.use('/', routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur sur port ${PORT}`);
});

module.exports = app;