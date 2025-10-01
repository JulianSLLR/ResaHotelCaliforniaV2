import db from '../../config/connexion.js';

class Client {
    
    /**
     * Constructeur de la classe Client
     * @param {Object} data - Les données du client
     * @param {number} data.idClient - L'ID du client
     * @param {number} data.nom - Le nom du client
     * @param {number} data.telephone - Le téléphone du client
     * @param {number} data.email - L'email du client
     * @param {number} data.nbPersonnes - Le nombre de personnes
     */
    constructor(data) {
        this.idClient = data.idClient;
        this.nom = data.nom;
        this.telephone = data.telephone;
        this.email = data.email;
        this.nbPersonnes = data.nbPersonnes;
    }

    /**
     * Récupère tout les clients
     * @returns {Array} La liste des clients
     */
    static async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM clients ORDER BY nom');
            return rows.map(row => new Client(row));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des clients: ' + error.message);
        }
    }

    /**
     * Récupère un client par ID
     * @param {*} id 
     * @returns 
     */
    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM clients WHERE idClient = ?', [id]);
            return rows.length > 0 ? new Client(rows[0]) : null;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de la client: ' + error.message);
        }
    }

    /**
     * Crée un nouveau client
     * @param {*} clientData 
     * @returns 
     */
    static async create(clientData) {
        try {
            const [result] = await db.execute(
                'INSERT INTO clients (nom, telephone, email, nbPersonnes) VALUES (?, ?, ?, ?)',
                [clientData.nom, clientData.telephone, clientData.email, clientData.nbPersonnes]
            );
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Ce ce client existe déjà');
            }
            throw new Error('Erreur lors de la création du client: ' + error.message);
        }
    }

    /**
     * Mettre à jour un client
     * @param {*} clientData 
     * @returns 
     */
    async update(clientData) {
        try {
            await db.execute(
                'UPDATE clients SET nom = ?, telephone = ?, email = ?, nbPersonnes = ? WHERE id = ?',
                [clientData.nom, clientData.telephone, clientData.email, clientData.nbPersonnes, this.id]
            );
            this.nom = clientData.nom;
            this.telephone = clientData.telephone;
            this.email = clientData.email;
            this.nbPersonnes = clientData.nbPersonnes;

            return true;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Ce client existe déjà');
            }
            throw new Error('Erreur lors de la mise à jour de la client: ' + error.message);
        }
    }

    /**
     * Supprimer un client
     * @param {*} id 
     * @returns 
     */
    async delete(id) {
        try {
            // Vérifier si le client a des réservations affectés
            const [reservations] = await db.execute(
                'SELECT COUNT(*) as count FROM reservations WHERE idClient = ?',
                [id]
            );

            if (reservations[0].count > 0) {
                throw new Error('Impossible de supprimer le client car il a des réservations affectés');
            }
            await db.execute('DELETE FROM clients WHERE id = ?', [id]);
            return true;
        } catch (error) {
            throw new Error('Erreur lors de la suppression du client: ' + error.message);
        }
    }
}

export default Client;
