const Chambre = require('../models/chambre');

class ChambreController {
    // Récuperer toutes les chambres
    static async getAll(req, res){
        try {
            const chambres = await Chambre.findAll();
            res.render('chambres/index', { chambres });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération des chambres');
        }
    }
    // Récuperer une chambre par ID
    static async getByID(req, res){
        try {
            const chambre = await Chambre.findById(req.params.id);
            res.render('chambres/show', { chambre });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération de la chambre');
        }
    }
    // Creer une chambre
    static async create(req, res){
        try {
            const chambre = await Chambre.create(req.body);
            res.redirect('/chambres');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la création de la chambre');
        }
    }
    // Mettre à jour une chambre
    static async update(req, res){
        try {
            const chambre = await Chambre.update(req.body);
            res.redirect('/chambres');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la mise à jour de la chambre');
        }
    }
    // Supprimer une chambre
    static async delete(req, res){
        try {
            const chambre = await Chambre.delete(req.params.id);
            res.redirect('/chambres');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la suppression de la chambre');
        }
    }
    // Verifier si une chambre est disponible
    static async isAvailable(req, res){
        try {
            const chambre = await Chambre.isAvailable(req.params.id);
            res.render('chambres/show', { chambre });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la vérification de la disponibilité de la chambre');
        }
    }
}





module.exports = ChambreController;
