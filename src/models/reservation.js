import db from '../../config/connexion.js';

class Reservation {
    /**
     * Constructeur de la classe Reservation
     * @param {Object} data - Les données de la reservation
     * @param {number} data.idReservation - L'ID de la reservation
     * @param {number} data.idClient - L'ID du client
     * @param {number} data.idChambre - L'ID de la chambre
     * @param {number} data.dateDebut - La date de début de la reservation
     * @param {number} data.dateFin - La date de fin de la reservation
     */
    constructor(data) {
        this.idReservation = data.idReservation;
        this.idClient = data.idClient;
        this.idChambre = data.idChambre;
        this.dateDebut = data.dateDebut;
        this.dateFin = data.dateFin;
    }
    
    /**
     * Récupérer toutes les réservations
     * @returns {Array} - La liste des réservations
     */
    static async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM reservations');
            return rows.map(row => new Reservation(row));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des réservations: ' + error.message);
        }
    }

    /**
     * Récupérer une réservation par ID
     * @param {number} id - L'ID de la réservation
     * @returns {Reservation | null} - La réservation correspondante ou null si elle n'existe pas
     */
    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM reservations WHERE idReservation = ?', [id]);
            return rows.length > 0 ? new Reservation(rows[0]) : null;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de la réservation: ' + error.message);
        }
    }
    
    /**
     * Créer une réservation
     * @param {Object} reservationData - Les données de la reservation à créer
     * @returns {number} - L'ID de la reservation créée
     */
    static async create(reservationData) {
        try {
            const [result] = await db.execute(
                'INSERT INTO reservations (idClient, idChambre, dateDebut, dateFin) VALUES (?, ?, ?, ?)',
                [reservationData.idClient, reservationData.idChambre, reservationData.dateDebut, reservationData.dateFin]
            );
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Cette réservation existe déjà');
            }
            throw new Error('Erreur lors de la création de la réservation: ' + error.message);
        }
    }

    /**
     * Mettre à jour une réservation
     * @param {Object} reservationData - Les données de la reservation à mettre à jour
     * @returns {boolean} - true si la mise à jour a réussi, false sinon
     */
    static async update(reservationData) {
        try {
            await db.execute(
                'UPDATE reservations SET idClient = ?, idChambre = ?, dateDebut = ?, dateFin = ? WHERE idReservation = ?',
                [reservationData.idClient, reservationData.idChambre, reservationData.dateDebut, reservationData.dateFin, reservationData.idReservation]
            );
            this.idClient = reservationData.idClient;
            this.idChambre = reservationData.idChambre;
            this.dateDebut = reservationData.dateDebut;
            this.dateFin = reservationData.dateFin;
            return true;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Cette réservation existe déjà');
            }
            throw new Error('Erreur lors de la mise à jour de la réservation: ' + error.message);
        }
    }

    /**
     * Supprimer une réservation
     * @param {number} id - L'ID de la reservation à supprimer
     * @returns {boolean} - true si la suppression a réussi, false sinon
     */
    static async delete(id) {
        try {
            await db.execute('DELETE FROM reservations WHERE idReservation = ?', [id]);
            return true;
        } catch (error) {
            throw new Error('Erreur lors de la suppression de la réservation: ' + error.message);
        }
    }
}

export default Reservation;