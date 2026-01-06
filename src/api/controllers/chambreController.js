import Chambre from '../../models/chambre.js';

class ChambreController {

    // GET /api/chambres
    static async getAll(req, res) {
        try {
            const chambres = await Chambre.findAll();
            res.json(chambres);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la récupération des chambres' });
        }
    }

    // GET /api/chambres/:id
    static async getOne(req, res) {
        try {
            const chambre = await Chambre.findById(req.params.id);
            if (!chambre) {
                return res.status(404).json({ message: 'Chambre non trouvée' });
            }
            res.json(chambre);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la récupération de la chambre' });
        }
    }

    // POST /api/chambres
    static async create(req, res) {
        try {
            const newChambre = await Chambre.create(req.body);
            res.status(201).json(newChambre);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }

    // PUT /api/chambres/:id
    static async update(req, res) {
        try {
            const updatedChambre = await Chambre.update({ ...req.body, idChambre: req.params.id });
            res.json(updatedChambre);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }

    // DELETE /api/chambres/:id
    static async delete(req, res) {
        try {
            await Chambre.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            // Gestion spécifique si la chambre est liée à des réservations
            if (error.message.includes('utilisée dans des réservations')) {
                return res.status(409).json({ message: 'Impossible de supprimer : chambre liée à des réservations actives.' });
            }
            res.status(500).json({ message: 'Erreur lors de la suppression' });
        }
    }
}

export default ChambreController;