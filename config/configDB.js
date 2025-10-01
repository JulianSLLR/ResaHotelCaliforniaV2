// Configuration de la base de données
import database from './database.ini';


const configDB = {
    host: database.host,
    user: database.user,
    password: database.password,
    database: database.name,
    port: database.port
};

export default configDB;
