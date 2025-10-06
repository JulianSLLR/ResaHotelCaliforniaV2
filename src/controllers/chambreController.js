import Chambre from '../models/chambre.js';

/**
 * Controller pour les chambres
 */
class ChambreController {

    /**
     * Afficher la liste des chambres
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async getAll(req, res) {
        try {
            const chambres = await Chambre.findAll(); 
            res.render('chambres/index', { chambres });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération des chambres');
        }
    }

    /**
     * Afficher une chambre
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async getOne(req, res) {
        try {
            const chambre = await Chambre.findById(req.params.id);
            res.render('chambres/showOne', { chambre });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération de la chambre');
        }
    }

    /**
     * Afficher le formulaire de création d'une chambre
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async createForm(req, res) {
        res.render('chambres/create');
    }

    /**
     * Créer une chambre
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async create(req, res) {
        try {
            const chambre = await Chambre.create(req.body);
            res.redirect('/chambres');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la création de la chambre');
        }
    }

    /**
     * Afficher le formulaire de modification d'une chambre
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async updateForm(req, res) {
        try {
            const chambre = await Chambre.findById(req.params.id);
            res.render('chambres/edit', { chambre });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération de la chambre');
        }
    }

    /**
     * Traiter la modification d'une chambre
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async update(req, res) {
        try {
            const chambre = await Chambre.update(req.body);
            res.redirect('/chambres');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la modification de la chambre');
        }
    }

    /**
     * Afficher la suppression d'une chambre
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async deleteForm(req, res) {
        try {
            const chambre = await Chambre.findById(req.params.id);
            if (!chambre) {
                return res.status(404).send('Chambre non trouvée');
            }
            res.render('chambres/delete', { chambre, error: null });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération de la chambre');
        }
    }
    
    /**
     * Traiter la suppression d'une chambre
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async delete(req, res) {
        try {
            await Chambre.delete(req.params.id);
            res.redirect('/chambres');
        } catch (error) {
            console.error(error);
            
            // Si l'erreur indique que la chambre est utilisée dans des réservations
            if (error.message.includes('utilisée dans des réservations')) {
                // Récupérer la chambre pour l'afficher dans le template d'erreur
                try {
                    const chambre = await Chambre.findById(req.params.id);
                    return res.render('chambres/delete', { 
                        chambre, 
                        error: 'Impossible de supprimer cette chambre car elle est utilisée dans des réservations actives.' 
                    });
                } catch (findError) {
                    return res.status(500).send('Erreur lors de la récupération de la chambre');
                }
            }
            
            res.status(500).send('Erreur lors de la suppression de la chambre: ' + error.message);
        }
    }


}
export default ChambreController;