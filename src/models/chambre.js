import db from '../../config/connexion.js';

class Chambre {

    /**
     * Constructeur de la classe Chambre
     * @param {Object} data - Les données de la chambre
     * @param {number} data.idChambre - L'ID de la chambre
     * @param {number} data.numero - Le numéro de la chambre
     * @param {number} data.capacite - La capacité de la chambre
     * @param {number} data.disponibilite - La disponibilité de la chambre
     */
    constructor(data) {
        this.idChambre = data.idChambre;
        this.numero = data.numero;
        this.capacite = data.capacite;
        this.disponibilite = data.disponibilite;
    }

    /**
     * Récupérer tous les chambres
     * @returns {Array} - La liste des chambres
     */
    static async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM chambres');
            return rows.map(row => new Chambre(row));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des chambres:' + error.message);
        }
    }

    /**
     * Récupérer une chambre par ID
     * @param {number} id - L'ID de la chambre
     * @returns {Chambre | null} - La chambre correspondante ou null si elle n'existe pas
     */
    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM chambres WHERE idChambre = ?', [id]);
            return rows.length > 0 ? new Chambre(rows[0]) : null;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de la chambre: ' + error.message);
        }
    }

    /**
     * Créer une chambre
     * @param {Object} chambreData - Les données de la chambre à créer
     * @returns {number} - L'ID de la chambre créée
     */
    static async create(chambreData) {
        try {
            const [result] = await db.execute('INSERT INTO chambres (numero, capacite, disponibilite) VALUES (?, ?, ?)', [chambreData.numero, chambreData.capacite, chambreData.disponibilite]);
            return result.insertId;
        } catch (error) {
            throw new Error('Erreur lors de la création de la chambre: ' + error.message);
        }
    }

    /**
     * Mettre à jour une chambre
     * @param {Object} chambreData - Les données de la chambre à mettre à jour
     * @returns {boolean} - true si la mise à jour a réussi, false sinon
     */
    static async update(chambreData) {
        try {
            const [result] = await db.execute('UPDATE chambres SET numero = ?, capacite = ?, disponibilite = ? WHERE idChambre = ?', [chambreData.numero, chambreData.capacite, chambreData.disponibilite, chambreData.idChambre]);
            this.numero = chambreData.numero;
            this.capacite = chambreData.capacite;
            this.disponibilite = chambreData.disponibilite;
            return true;
        }
        catch (error) {
            throw new Error('Erreur lors de la mise à jour de la chambre: ' + error.message);
        }
    }

    /**
     * Supprimer une chambre
     * @param {number} id - L'ID de la chambre à supprimer
     * @returns {boolean} - true si la suppression a réussi, false sinon
     */
    static async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM chambres WHERE idChambre = ?', [id]);
            return true;
        } catch (error) {
            throw new Error('Erreur lors de la suppression de la chambre: ' + error.message);
        }
    }

    /**
     * Verifier si une chambre est disponible
     * @param {number} id - L'ID de la chambre à vérifier
     * @returns {boolean} - true si la chambre est disponible, false sinon
     */
    static async isAvailable(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM chambres WHERE numero = ? AND disponibilite = 1', [id]);
            return rows.length > 0;
        } catch (error) {
            throw new Error('Erreur lors de la vérification de la disponibilité de la chambre: ' + error.message);
        }
    }
}

export default Chambre;