import Reservation from '../models/reservation.js';
import Client from '../models/client.js';
import Chambre from '../models/chambre.js';

/**
 * Controller pour les réservations
 */
class ReservationController {
    
    static async getAll(req, res) {
        try {
            const reservations = await Reservation.findAll();
            res.render('reservations/index', { reservations });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération des réservations');
        }
    }

    static async getOne(req, res) {
        try {
            const reservation = await Reservation.findById(req.params.id);
            res.render('reservations/showOne', { reservation });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération de la réservation');
        }
    }
    
    static async createForm(req, res) {
        try {
            const clients = await Client.findAll();
            const chambres = await Chambre.findAll();
            res.render('reservations/create', { clients, chambres });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération des clients et des chambres');
        }
    }
    
    static async create(req, res) {
        try {
            const reservation = await Reservation.create(req.body);
            res.redirect('/reservations');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la création de la réservation');
        }
    }
    
    static async updateForm(req, res) {
        try {
            const reservation = await Reservation.findById(req.params.id);
            res.render('reservations/edit', { reservation });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération de la réservation');
        }
    }
    
    static async update(req, res) {
        try {
            const reservation = await Reservation.update(req.body);
            res.redirect('/reservations');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la modification de la réservation');
        }
    }
    
    static async deleteForm(req, res) {
        try {
            const reservation = await Reservation.findById(req.params.id);
            res.render('reservations/delete', { reservation });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération de la réservation');
        }
    }
    
    static async delete(req, res) {
        try {
            const reservation = await Reservation.delete(req.params.id);
            res.redirect('/reservations');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la suppression de la réservation');
        }
    }
    
}

export default ReservationController;