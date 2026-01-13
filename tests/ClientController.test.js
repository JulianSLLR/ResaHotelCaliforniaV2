import { describe, it, expect, vi, beforeEach } from 'vitest';
import ClientController from '../src/controllers/clientController.js';
import Client from '../src/models/client.js';

vi.mock('../src/models/client.js');

describe('ClientController', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = { params: {}, body: {} };
        res = {
            render: vi.fn(),
            redirect: vi.fn(),
            status: vi.fn().mockReturnThis(),
            send: vi.fn()
        };
    });

    describe('getAll', () => {
        it('devrait afficher la liste des clients', async () => {
            const mockClients = [{ id: 1, nom: 'Doe' }];
            Client.findAll.mockResolvedValue(mockClients);

            await ClientController.getAll(req, res);

            expect(res.render).toHaveBeenCalledWith('clients/index', { clients: mockClients });
        });

        it('devrait gérer les erreurs de récupération', async () => {
            Client.findAll.mockRejectedValue(new Error());
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ClientController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            consoleSpy.mockRestore();
        });
    });

    describe('getOne', () => {
        it('devrait afficher un client spécifique', async () => {
            const mockClient = { id: 1, nom: 'Doe' };
            req.params.id = 1;
            Client.findById.mockResolvedValue(mockClient);

            await ClientController.getOne(req, res);

            expect(res.render).toHaveBeenCalledWith('clients/showOne', { client: mockClient });
        });

        it('devrait retourner 404 si le client n\'existe pas', async () => {
            req.params.id = 1;
            Client.findById.mockResolvedValue(null);

            await ClientController.getOne(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('create', () => {
        it('devrait créer un client et rediriger', async () => {
            req.body = { nom: 'Doe' };
            Client.create.mockResolvedValue(true);

            await ClientController.create(req, res);

            expect(res.redirect).toHaveBeenCalledWith('/clients');
        });

        it('devrait réafficher le formulaire en cas d\'erreur', async () => {
            Client.create.mockRejectedValue(new Error('Validation failed'));
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ClientController.create(req, res);

            expect(res.render).toHaveBeenCalledWith('clients/create', expect.anything());
            consoleSpy.mockRestore();
        });
    });

    describe('delete', () => {
        it('devrait supprimer et rediriger', async () => {
            req.params.id = 1;
            Client.delete.mockResolvedValue(true);

            await ClientController.delete(req, res);

            expect(res.redirect).toHaveBeenCalledWith('/clients');
        });
    });
});
