const express = require('express');
const chambreController = require('../controllers/chambreController');

const router = express.Router();


//CRUD - Routes pour les chambres

// Afficher toutes les chambres
router.get('/', chambreController.getAll);

// Afficher une chambre spécifique
router.get('/:id', chambreController.getOne);

// Afficher le formulaire de création
router.get('/create', chambreController.createForm);
// Créer une chambre (traitement du formulaire)
router.post('/', chambreController.create);


// Afficher le formulaire de modification
router.get('/:id/edit', chambreController.updateForm);
// Mettre à jour une chambre (traitement du formulaire)
router.put('/:id', chambreController.update);

// Afficher la confirmation de suppression
router.get('/:id/delete', chambreController.deleteForm);
// Supprimer une chambre
router.delete('/:id', chambreController.delete);

module.exports = router;