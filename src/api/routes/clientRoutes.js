import express from 'express';
import ClientController from '../controllers/clientController.js';
import CtrlAuth from '../controllers/authController.js';

const router = express.Router();

// GET /api/clients
router.get('/', CtrlAuth.verifyToken, ClientController.getAll);

// GET /api/clients/:id
router.get('/:id', CtrlAuth.verifyToken, ClientController.getOne);

// POST /api/clients
router.post('/', CtrlAuth.verifyToken, ClientController.create);

// PUT /api/clients/:id
router.put('/:id', CtrlAuth.verifyToken, ClientController.update);

// DELETE /api/clients/:id
router.delete('/:id', CtrlAuth.verifyToken, ClientController.delete);

export default router;