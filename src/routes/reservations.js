import express from 'express';
import reservationController from '../controllers/reservationController.js';
const router = express.Router();

// CRUD - Routes pour les réservations

// Afficher toutes les réservations
router.get('/', reservationController.getAll);

// Afficher le formulaire de création 
router.get('/create', reservationController.createForm);
// Afficher une réservation spécifique
router.get('/:id', reservationController.getOne);

// Créer une réservation (traitement du formulaire)
router.post('/', reservationController.create);

// Afficher le formulaire de modification
router.get('/:id/edit', reservationController.updateForm);
// Mettre à jour une réservation (traitement du formulaire)
router.post('/:id/edit', reservationController.update);

// Afficher la confirmation de suppression
router.get('/:id/delete', reservationController.deleteForm);
// Supprimer une réservation
router.post('/:id/delete', reservationController.delete);

export default router;