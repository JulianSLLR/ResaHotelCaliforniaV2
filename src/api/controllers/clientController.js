import Client from '../../models/client.js'; 

/**
 * Contrôleur pour la gestion des clients via l'API.
 */
class ClientController {
    /**
     * Récupère la liste de tous les clients.
     * @param {import('express').Request} req - L'objet de requête Express.
     * @param {import('express').Response} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async getAll(req, res) {
        try {
            const clients = await Client.findAll();
            res.json(clients);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    /**
     * Récupère un client spécifique par son identifiant.
     * @param {import('express').Request} req - L'objet de requête Express.
     * @param {import('express').Response} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async getOne(req, res) {
        try {
            const client = await Client.findById(req.params.id);
            if (!client) {
                return res.status(404).json({ message: 'Client non trouvé' });
            }
            res.json(client);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    /**
     * Crée un nouveau client.
     * @param {import('express').Request} req - L'objet de requête Express contenant les données du client dans `req.body`.
     * @param {import('express').Response} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async create(req, res) {
        try {
            const newClient = await Client.create(req.body);
            res.status(201).json(newClient);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * Met à jour un client existant.
     * @param {import('express').Request} req - L'objet de requête Express contenant l'ID dans `req.params.id` et les données dans `req.body`.
     * @param {import('express').Response} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async update(req, res) {
        try {
            // Assurez-vous que l'ID est bien passé au modèle si nécessaire
            const updatedClient = await Client.update({ ...req.body, idClient: req.params.id });
            res.json(updatedClient);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * Supprime un client.
     * @param {import('express').Request} req - L'objet de requête Express contenant l'ID dans `req.params.id`.
     * @param {import('express').Response} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async delete(req, res) {
        try {
            await Client.delete(req.params.id);
            res.status(204).send(); // 204 No Content
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la suppression' });
        }
    }
}

export default ClientController;