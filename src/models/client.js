import db from '../../config/connexion.js';

class Client {

    /**
     * Constructeur de la classe Client
     * @param {Object} data - Les données du client
     * @param {number} data.idClient - L'ID du client
     * @param {string} data.nom - Le nom du client
     * @param {string} data.telephone - Le téléphone du client
     * @param {string} data.email - L'email du client
     */
    constructor(data) {
        this.idClient = data.idClient;
        this.nom = data.nom;
        this.telephone = data.telephone;
        this.email = data.email;
    }

    /**
     * Récupérer tous les clients
     * @returns {Promise<Array<Client>>} - La liste des clients
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
     * Récupérer un client par ID
     * @param {number} id - L'ID du client
     * @returns {Promise<Client | null>} - Le client correspondant ou null
     */
    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM clients WHERE idClient = ?', [id]);
            return rows.length > 0 ? new Client(rows[0]) : null;
        } catch (error) {
            throw new Error('Erreur lors de la récupération du client: ' + error.message);
        }
    }

    /**
     * Créer un nouveau client
     * @param {Object} clientData - Les données du client à créer
     * @returns {Promise<number>} - L'ID du client créé
     */
    static async create(clientData) {
        if (/\d/.test(clientData.nom)) {
            throw new Error("Le nom ne peut pas contenir de chiffres.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clientData.email)) {
            throw new Error("L'adresse email n'est pas valide.");
        }

        const telephoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (!telephoneRegex.test(clientData.telephone)) {
            throw new Error("Le numéro de téléphone n'est pas valide (format attendu : 06 12 34 56 78).");
        }

        try {
            const [result] = await db.execute(
                'INSERT INTO clients (nom, telephone, email) VALUES (?, ?, ?)',
                [clientData.nom, clientData.telephone, clientData.email]
            );
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Ce client existe déjà');
            }
            throw new Error('Erreur lors de la création du client: ' + error.message);
        }
    }

    /**
     * Mettre à jour un client
     * @param {Object} clientData - Les données du client à mettre à jour
     * @returns {Promise<boolean>} - true si la mise à jour a réussi
     */
    static async update(clientData) {
        if (/\d/.test(clientData.nom)) {
            throw new Error("Le nom ne peut pas contenir de chiffres.");
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clientData.email)) {
            throw new Error("L'adresse email n'est pas valide.");
        }

        const telephoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (!telephoneRegex.test(clientData.telephone)) {
            throw new Error("Le numéro de téléphone n'est pas valide (format attendu : 06 12 34 56 78).");
        }
        
        try {
            await db.execute(
                'UPDATE clients SET nom = ?, telephone = ?, email = ? WHERE idClient = ?', 
                [clientData.nom, clientData.telephone, clientData.email, clientData.idClient]
            );
            return true;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Ce client existe déjà');
            }
            throw new Error('Erreur lors de la mise à jour du client: ' + error.message);
        }
    }

    /**
     * Supprimer un client
     * @param {number} id - L'ID du client à supprimer
     * @returns {Promise<boolean>} - true si la suppression a réussi
     */
    static async delete(id) {
        try {
            const [reservations] = await db.execute(
                'SELECT COUNT(*) as count FROM reservations WHERE idClient = ?', [id]);

            if (reservations[0].count > 0) {
                throw new Error('Impossible de supprimer le client car il a des réservations affectées');
            }

            await db.execute('DELETE FROM clients WHERE idClient = ?', [id]);
            return true;
        } catch (error) {
            throw new Error('Erreur lors de la suppression du client: ' + error.message);
        }
    }
}

export default Client;