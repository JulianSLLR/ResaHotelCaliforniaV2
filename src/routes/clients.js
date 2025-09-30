const express = require('express');
const clientController = require('../controllers/clientController');
const router = express.Router();

// CRUD - Routes pour les clients

// Afficher toutes les clients
router.get('/', clientController.getAll);

// Afficher un client spécifique
router.get('/:id', clientController.getOne);

// Afficher le formulaire de création
router.get('/create', clientController.createForm);
// Créer un client (traitement du formulaire)
router.post('/', clientController.create);

// Afficher le formulaire de modification
router.get('/:id/edit', clientController.updateForm);
// Mettre à jour un client (traitement du formulaire)
router.put('/:id', clientController.update);

// Afficher la confirmation de suppression
router.get('/:id/delete', clientController.deleteForm);
// Supprimer un client
router.delete('/:id', clientController.delete);

module.exports = router;