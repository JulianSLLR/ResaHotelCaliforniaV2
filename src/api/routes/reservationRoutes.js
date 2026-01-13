import express from 'express';
import ReservationController from '../controllers/reservationController.js';
import CtrlAuth from '../controllers/authController.js';

const router = express.Router();

router.get('/', CtrlAuth.verifyToken, ReservationController.getAll);
router.get('/:id', CtrlAuth.verifyToken, ReservationController.getOne);
router.post('/', CtrlAuth.verifyToken, ReservationController.create);
router.put('/:id', CtrlAuth.verifyToken, ReservationController.update);
router.delete('/:id', CtrlAuth.verifyToken, ReservationController.delete);

export default router;