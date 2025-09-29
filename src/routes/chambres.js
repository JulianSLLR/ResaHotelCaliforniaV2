const express = require('express');
const router = express.Router();
const chambreController = require('../controllers/chambreController');

// Routes CRUD
router.get('/', chambreController.getAll);
router.get('/:id', chambreController.getByID);
router.post('/', chambreController.create);
router.put('/:id', chambreController.update);
router.delete('/:id', chambreController.delete);
router.get('/:id/available', chambreController.isAvailable);

module.exports = router;