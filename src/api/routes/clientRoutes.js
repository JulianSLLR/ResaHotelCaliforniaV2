import express from 'express';
import ClientController from '../controllers/clientController.js';

const router = express.Router();

// GET /api/clients
router.get('/', ClientController.getAll);

// GET /api/clients/:id
router.get('/:id', ClientController.getOne);

// POST /api/clients
router.post('/', ClientController.create);

// PUT /api/clients/:id
router.put('/:id', ClientController.update);

// DELETE /api/clients/:id
router.delete('/:id', ClientController.delete);

export default router;