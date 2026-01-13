import express from 'express';
import ChambreController from '../controllers/chambreController.js';
import CtrlAuth from '../controllers/authController.js';

const router = express.Router();

router.get('/', CtrlAuth.verifyToken, ChambreController.getAll);
router.get('/:id', CtrlAuth.verifyToken, ChambreController.getOne);
router.post('/', CtrlAuth.verifyToken, ChambreController.create);
router.put('/:id', CtrlAuth.verifyToken, ChambreController.update);
router.delete('/:id', CtrlAuth.verifyToken, ChambreController.delete);

export default router;