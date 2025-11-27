import Reservation from '../models/reservation.js';
import Client from '../models/client.js';
import Chambre from '../models/chambre.js';

/**
 * Controller pour les réservations
 */
class ReservationController {
    /**
     * Afficher la liste des réservations
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async getAll(req, res) {
        try {
            const reservations = await Reservation.findAll();
            res.render('reservations/index', { reservations });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération des réservations');
        }
    }
    /**
     * Afficher une réservation
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async getOne(req, res) {
        try {
            const reservation = await Reservation.findById(req.params.id);
            res.render('reservations/showOne', { reservation });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération de la réservation');
        }
    }
    /**
     * Afficher le formulaire de création d'une réservation
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
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
    /**
     * Créer une réservation
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async create(req, res) {
        try {
            const reservation = await Reservation.create(req.body);
            res.redirect('/reservations');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la création de la réservation');
        }
    }

    /**
     * Afficher le formulaire de modification d'une réservation
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async updateForm(req, res) {
        try {
            const reservation = await Reservation.findById(req.params.id);
            const clients = await Client.findAll();
            const chambres = await Chambre.findAll();
            res.render('reservations/edit', { reservation, clients, chambres });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération de la réservation');
        }
    }

    /** 
     * Modifier une réservation
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async update(req, res) {
        try {
            const reservation = await Reservation.update(req.body);
            res.redirect('/reservations');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la modification de la réservation');
        }
    }
    /**     
     * Afficher le formulaire de suppression d'une réservation
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async deleteForm(req, res) {
        try {
            const reservation = await Reservation.findById(req.params.id);
            res.render('reservations/delete', { reservation });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération de la réservation');
        }
    }
    /**
     * Supprimer une réservation
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
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