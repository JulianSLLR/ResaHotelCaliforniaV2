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
     * @param {number} data.numero - Le numéro de la chambre
     * @param {number} data.capacite - La capacité de la chambre
     * @param {number} data.disponibilite - La disponibilité de la chambre
     * @param {string} data.nom - Le nom du client
     */
    constructor(data) {
        this.idReservation = data.idReservation;
        this.idClient = data.idClient;
        this.idChambre = data.idChambre;
        this.dateDebut = data.dateDebut;
        this.dateFin = data.dateFin;
        // Données de la chambre
        this.numero = data.numero;
        this.capacite = data.capacite;
        this.disponibilite = data.disponibilite;
        // Données du client
        this.nomClient = data.nom;
    }

    /**
     * Formater la date de début pour l'affichage
     * @returns {string} - La date formatée (JJ/MM/AAAA)
     */
    getFormattedDateDebut() {
        if (!this.dateDebut) return '';
        const date = new Date(this.dateDebut);
        return date.toLocaleDateString('fr-FR');
    }

    /**
     * Formater la date de fin pour l'affichage
     * @returns {string} - La date formatée (JJ/MM/AAAA)
     */
    getFormattedDateFin() {
        if (!this.dateFin) return '';
        const date = new Date(this.dateFin);
        return date.toLocaleDateString('fr-FR');
    }

    /**
     * Formater la date de début pour l'input date (AAAA-MM-JJ)
     * @returns {string} - La date formatée (AAAA-MM-JJ)
     */
    getIsoDateDebut() {
        if (!this.dateDebut) return '';
        const date = new Date(this.dateDebut);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Formater la date de fin pour l'input date (AAAA-MM-JJ)
     * @returns {string} - La date formatée (AAAA-MM-JJ)
     */
    getIsoDateFin() {
        if (!this.dateFin) return '';
        const date = new Date(this.dateFin);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Récupérer toutes les réservations
     * @returns {Array} - La liste des réservations
     */
    static async findAll() {
        try {
            const [rows] = await db.execute(
                'SELECT r.idReservation, r.idClient, r.idChambre, r.dateDebut, r.dateFin, ' +
                'c.numero, c.capacite, c.disponibilite, ' +
                'cl.nom ' +
                'FROM reservations r ' +
                'INNER JOIN chambres c ON r.idChambre = c.idChambre ' +
                'INNER JOIN clients cl ON r.idClient = cl.idClient'
            );
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
            const [rows] = await db.execute(
                'SELECT r.idReservation, r.idClient, r.idChambre, r.dateDebut, r.dateFin, ' +
                'c.numero, c.capacite, c.disponibilite, ' +
                'cl.nom ' +
                'FROM reservations r ' +
                'INNER JOIN chambres c ON r.idChambre = c.idChambre ' +
                'INNER JOIN clients cl ON r.idClient = cl.idClient ' +
                'WHERE r.idReservation = ?',
                [id]
            );
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
         if (reservationData.dateDebut >= reservationData.dateFin) {
            throw new Error('La date de début de la réservation ne peut pas être ultérieure à la date de fin.');
        }

        const twoYearsFromNow = new Date();
        twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
        if (new Date(reservationData.dateDebut) > twoYearsFromNow) {
             throw new Error('La réservation ne peut pas être effectuée plus de 2 ans à l\'avance.');
        }

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
         if (reservationData.dateDebut >= reservationData.dateFin) {
            throw new Error('La date de début de la réservation ne peut pas être ultérieure à la date de fin.');
        }

        const twoYearsFromNow = new Date();
        twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
        if (new Date(reservationData.dateDebut) > twoYearsFromNow) {
             throw new Error('La réservation ne peut pas être effectuée plus de 2 ans à l\'avance.');
        }

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