
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ClientController from '../src/controllers/clientController.js';
import Client from '../src/models/client.js';

// Mock du modèle Client pour isoler les tests
vi.mock('../src/models/client.js');

describe('ClientController', () => {
    let req;
    let res;

    beforeEach(() => {
        // Nettoyage des mocks avant chaque test
        vi.clearAllMocks();

        // Stub des objets Request et Response
        req = {
            params: {},
            body: {}
        };
        res = {
            render: vi.fn(),
            redirect: vi.fn(),
            status: vi.fn().mockReturnThis(),
            send: vi.fn()
        };
    });

    describe('getAll', () => {
        // Test Nominal : Récupération réussie de la liste des clients
        it('should render clients/index with a list of clients', async () => {
            const mockClients = [{ id: 1, nom: 'Doe', prenom: 'John' }, { id: 2, nom: 'Smith', prenom: 'Jane' }];
            Client.findAll.mockResolvedValue(mockClients);

            await ClientController.getAll(req, res);

            expect(Client.findAll).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('clients/index', { clients: mockClients });
        });

        // Gestion des erreurs lors de la récupération
        it('should handle errors', async () => {
            const error = new Error('Database connection failed');
            Client.findAll.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ClientController.getAll(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération des clients');
            
            consoleSpy.mockRestore();
        });
    });

    describe('getOne', () => {
        // Test Nominal : Client trouvé et affiché
        it('should render clients/showOne with the requested client', async () => {
            const mockClient = { id: 1, nom: 'Doe' };
            req.params.id = 1;
            Client.findById.mockResolvedValue(mockClient);

            await ClientController.getOne(req, res);

            expect(Client.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('clients/showOne', { client: mockClient });
        });

        // Client non trouvé (404)
        it('should return 404 if client not found', async () => {
            req.params.id = 1;
            Client.findById.mockResolvedValue(null);

            await ClientController.getOne(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Client non trouvé');
        });

        // Gestion des erreurs
        it('should handle errors', async () => {
            const error = new Error('Database error');
            req.params.id = 1;
            Client.findById.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ClientController.getOne(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération du client');

            consoleSpy.mockRestore();
        });
    });

    describe('createForm', () => {
        // Affichage simple du formulaire de création
        it('should render clients/create', async () => {
            await ClientController.createForm(req, res);
            expect(res.render).toHaveBeenCalledWith('clients/create');
        });
    });

    describe('create', () => {
        // Création réussie et redirection
        it('should create a client and redirect', async () => {
            req.body = { nom: 'Doe', prenom: 'John' };
            Client.create.mockResolvedValue(true);

            await ClientController.create(req, res);

            expect(Client.create).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/clients');
        });

        // Erreur lors de la création : réaffichage du formulaire avec message d'erreur
        it('should handle creation errors by rendering the form with error', async () => {
            const error = new Error('Validation failed');
            req.body = { nom: 'Doe' };
            Client.create.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ClientController.create(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.render).toHaveBeenCalledWith('clients/create', {
                error: error.message,
                client: req.body
            });
            
            consoleSpy.mockRestore();
        });
    });

    describe('updateForm', () => {
        // Affichage du formulaire d'édition avec les données du client
        it('should render clients/edit with the client data', async () => {
            const mockClient = { id: 1, nom: 'Doe' };
            req.params.id = 1;
            Client.findById.mockResolvedValue(mockClient);

            await ClientController.updateForm(req, res);

            expect(Client.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('clients/edit', { client: mockClient });
        });

        // Gestion des erreurs lors de l'accès au formulaire d'édition
        it('should handle errors', async () => {
            const error = new Error('Database error');
            req.params.id = 1;
            Client.findById.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ClientController.updateForm(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération du client');

            consoleSpy.mockRestore();
        });
    });

    describe('update', () => {
        // Mise à jour réussie et redirection
        it('should update the client and redirect', async () => {
            req.body = { id: 1, nom: 'Doe Updated' };
            Client.update.mockResolvedValue(true);

            await ClientController.update(req, res);

            expect(Client.update).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/clients');
        });

        // Erreur lors de la mise à jour : réaffichage du formulaire
        it('should handle update errors by rendering the edit form with error', async () => {
            const error = new Error('Update failed');
            req.body = { nom: 'Doe Updated' };
            req.params.id = 1;
            Client.update.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ClientController.update(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            const expectedClientData = { ...req.body, idClient: 1 };
            expect(res.render).toHaveBeenCalledWith('clients/edit', {
                error: error.message,
                client: expectedClientData
            });

            consoleSpy.mockRestore();
        });
    });

    describe('deleteForm', () => {
        // Affichage de la page de confirmation de suppression
        it('should render clients/delete', async () => {
            const mockClient = { id: 1, nom: 'Doe' };
            req.params.id = 1;
            Client.findById.mockResolvedValue(mockClient);

            await ClientController.deleteForm(req, res);

            expect(Client.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('clients/delete', { client: mockClient });
        });

        // Gestion des erreurs
        it('should handle errors', async () => {
            req.params.id = 1;
            const error = new Error('DB Error');
            Client.findById.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ClientController.deleteForm(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération du client');

            consoleSpy.mockRestore();
        });
    });

    describe('delete', () => {
        // Suppression validée et redirection
        it('should delete the client and redirect', async () => {
            req.params.id = 1;
            Client.delete.mockResolvedValue(true);

            await ClientController.delete(req, res);

            expect(Client.delete).toHaveBeenCalledWith(1);
            expect(res.redirect).toHaveBeenCalledWith('/clients');
        });

        // Erreur lors de la suppression
        it('should handle errors during delete', async () => {
            req.params.id = 1;
            const error = new Error('Delete Error');
            Client.delete.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ClientController.delete(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la suppression du client');

            consoleSpy.mockRestore();
        });
    });

});
