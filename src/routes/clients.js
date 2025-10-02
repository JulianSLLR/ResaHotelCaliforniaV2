import express from 'express';
import clientController from '../controllers/clientController.js';
const router = express.Router();

// CRUD - Routes pour les clients

// Afficher toutes les clients
router.get('/', clientController.getAll);

// Afficher le formulaire de création
router.get('/create', clientController.createForm);
// Créer un client (traitement du formulaire)
router.post('/', clientController.create);

// Afficher le formulaire de modification
router.get('/:id/edit', clientController.updateForm);
// Mettre à jour un client (traitement du formulaire)
router.post('/:id/edit', clientController.update);

// Afficher la confirmation de suppression
router.get('/:id/delete', clientController.deleteForm);
// Supprimer un client
router.post('/:id/delete', clientController.delete);

// Afficher un client spécifique
router.get('/:id', clientController.getOne);

export default router;