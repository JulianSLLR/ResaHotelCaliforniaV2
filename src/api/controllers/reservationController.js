import Reservation from "../../models/reservation.js"; // Ajout du .js

/**
 * Contrôleur pour la gestion des réservations via l'API.
 */
class ReservationController {
    /**
     * Récupère la liste de toutes les réservations.
     * @param {import('express').Request} req - L'objet de requête Express.
     * @param {import('express').Response} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async getAll(req, res) {
        try {
            const reservations = await Reservation.findAll();
            res.json(reservations);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la récupération des réservations' });
        }
    }

    /**
     * Récupère une réservation spécifique par son identifiant.
     * @param {import('express').Request} req - L'objet de requête Express.
     * @param {import('express').Response} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async getOne(req, res) {
        try {
            const reservation = await Reservation.findById(req.params.id);
            if (!reservation) {
                return res.status(404).json({ message: 'Réservation non trouvée' });
            }
            res.json(reservation);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la récupération de la réservation' });
        }
    }

    /**
     * Crée une nouvelle réservation.
     * @param {import('express').Request} req - L'objet de requête Express contenant les données de la réservation dans `req.body`.
     * @param {import('express').Response} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async create(req, res) {
        try {
            const newReservationId = await Reservation.create(req.body);
            const newReservation = await Reservation.findById(newReservationId);
            res.status(201).json(newReservation);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * Met à jour une réservation existante.
     * @param {import('express').Request} req - L'objet de requête Express contenant l'ID dans `req.params.id` et les données dans `req.body`.
     * @param {import('express').Response} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async update(req, res) {
        try {
            // On combine l'ID de l'URL avec les données du corps de la requête
            const success = await Reservation.update({ 
                ...req.body, 
                idReservation: req.params.id 
            });
            
            if (success == true) {
                const updatedReservation = await Reservation.findById(req.params.id);
                res.json(updatedReservation);
            } else {
                res.status(404).json({ message: 'Réservation non trouvée' });
            }
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * Supprime une réservation.
     * @param {import('express').Request} req - L'objet de requête Express contenant l'ID dans `req.params.id`.
     * @param {import('express').Response} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async delete(req, res) {
        try {
            await Reservation.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la suppression' });
        }
    }
}

export default ReservationController;