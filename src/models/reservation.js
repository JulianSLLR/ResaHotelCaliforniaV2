import db from '../../config/connexion.js';

class Reservation {

    constructor(data) {
        this.idReservation = data.idReservation;
        this.idClient = data.idClient;
        this.idChambre = data.idChambre;
        this.dateDebut = data.dateDebut;
        this.dateFin = data.dateFin;
    }
    
    static async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM reservations');
            return rows.map(row => new Reservation(row));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des réservations: ' + error.message);
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM reservations WHERE idReservation = ?', [id]);
            return rows.length > 0 ? new Reservation(rows[0]) : null;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de la réservation: ' + error.message);
        }
    }
    
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