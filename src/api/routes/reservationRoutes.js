import express from 'express';
import ReservationController from '../controllers/reservationController.js';

const router = express.Router();

router.get('/', ReservationController.getAll);
router.get('/:id', ReservationController.getOne);
router.post('/', ReservationController.create);
router.put('/:id', ReservationController.update);
router.delete('/:id', ReservationController.delete);

export default router;