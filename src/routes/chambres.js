import express from 'express';
import chambreController from '../controllers/chambreController.js';
// import { checkChambre } from '../validators/chambreValidator.js';
const router = express.Router();

// CRUD - Routes pour les chambres

// Afficher toutes les chambres
router.get('/', chambreController.getAll);

// Afficher le formulaire de création 
router.get('/create', chambreController.createForm);
// Créer une chambre (traitement du formulaire)
// router.post('/', checkChambre, chambreController.create);
router.post('/', chambreController.create);

// Afficher le formulaire de modification
router.get('/:id/edit', chambreController.updateForm);
// Mettre à jour une chambre (traitement du formulaire)
// router.post('/:id/edit', checkChambre, chambreController.update);
router.post('/:id/edit', chambreController.update);

// Afficher la confirmation de suppression
router.get('/:id/delete', chambreController.deleteForm);
// Supprimer une chambre
router.post('/:id/delete', chambreController.delete);

// Afficher une chambre spécifique
router.get('/:id', chambreController.getOne);

export default router;