import mysql from 'mysql2/promise';
import configDB from './configDB.js';

const connexion = mysql.createPool(configDB);

export default connexion;
