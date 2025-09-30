const mysql = require('mysql2/promise');
const configDB = require('./configDB');

const connexion = mysql.createPool(configDB);

module.exports = connexion;
