import Client from '../models/client.js';

/**
 * Controller pour les clients
 */
class ClientController {

    /**
     * Afficher la liste des clients
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async getAll(req, res) {
        try {
            const clients = await Client.findAll();
            res.render('clients/index', { clients });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération des clients');
        }
    }

    /**
     * Afficher un client
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async getOne(req, res) {
        try {
            const client = await Client.findById(req.params.id);
            if (!client) {
                return res.status(404).send('Client non trouvé');
            }
            res.render('clients/showOne', { client });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération du client');
        }
    }

    /**
     * Afficher le formulaire de création d'un client
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async createForm(req, res) {
        res.render('clients/create');
    }

    /**
     * Créer un client
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async create(req, res) {
        try {
            const client = await Client.create(req.body);
            res.redirect('/clients');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la création du client');
        }
    }

    /**
     * Afficher le formulaire de modification d'un client
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async updateForm(req, res) {
        try {
            const client = await Client.findById(req.params.id);
            res.render('clients/edit', { client });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération du client');
        }
    }

    /**
     * Traiter la modification d'un client
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async update(req, res) {
        try {
            const client = await Client.update(req.body);
            res.redirect('/clients');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la modification du client');
        }
    }

    /**
     * Afficher la suppression d'un client
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async deleteForm(req, res) {
        try {
            const client = await Client.findById(req.params.id);
            res.render('clients/delete', { client });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération du client');
        }
    }

    /**
     * Traiter la suppression d'un client
     * @param {Object} req - L'objet de la requête
     * @param {Object} res - L'objet de la réponse
     */
    static async delete(req, res) {
        try {
            const client = await Client.delete(req.params.id);
            res.redirect('/clients');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la suppression du client');
        }
    }


}
export default ClientController;