import Client from '../../models/client.js'; 

class ClientController {
    // GET /api/clients
    static async getAll(req, res) {
        try {
            const clients = await Client.findAll();
            res.json(clients);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    // GET /api/clients/:id
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

    // POST /api/clients
    static async create(req, res) {
        try {
            const newClient = await Client.create(req.body);
            res.status(201).json(newClient);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }

    // PUT /api/clients/:id
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

    // DELETE /api/clients/:id
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