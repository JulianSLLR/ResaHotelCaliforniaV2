import express from 'express';
import ChambreController from '../controllers/chambreController.js';

const router = express.Router();

router.get('/', ChambreController.getAll);
router.get('/:id', ChambreController.getOne);
router.post('/', ChambreController.create);
router.put('/:id', ChambreController.update);
router.delete('/:id', ChambreController.delete);

export default router;