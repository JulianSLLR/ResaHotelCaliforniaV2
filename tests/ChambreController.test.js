import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChambreController from '../src/controllers/ChambreController.js';
import Chambre from '../src/models/chambre.js';

vi.mock('../src/models/chambre.js');

describe('ChambreController', () => {
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
        it('devrait afficher la liste des chambres', async () => {
            const mockChambres = [{ id: 1, numero: 101 }];
            Chambre.findAll.mockResolvedValue(mockChambres);

            await ChambreController.getAll(req, res);

            expect(Chambre.findAll).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('chambres/index', { chambres: mockChambres });
        });

        it('devrait gérer les erreurs de récupération', async () => {
            Chambre.findAll.mockRejectedValue(new Error('Erreur BDD'));
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération des chambres');
            consoleSpy.mockRestore();
        });
    });

    describe('getOne', () => {
        it('devrait afficher le détail d\'une chambre', async () => {
            const mockChambre = { id: 1, numero: 101 };
            req.params.id = 1;
            Chambre.findById.mockResolvedValue(mockChambre);

            await ChambreController.getOne(req, res);

            expect(res.render).toHaveBeenCalledWith('chambres/showOne', { chambre: mockChambre });
        });

        it('devrait retourner une erreur si la chambre est introuvable ou en cas de crash', async () => {
            Chambre.findById.mockRejectedValue(new Error('Erreur BDD'));
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.getOne(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            consoleSpy.mockRestore();
        });
    });

    describe('create', () => {
        it('devrait créer une chambre et rediriger', async () => {
            req.body = { numero: 105 };
            Chambre.create.mockResolvedValue(true);

            await ChambreController.create(req, res);

            expect(Chambre.create).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/chambres');
        });

        it('devrait réafficher le formulaire en cas d\'erreur de création', async () => {
            const error = new Error('Erreur');
            Chambre.create.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.create(req, res);

            expect(res.render).toHaveBeenCalledWith('chambres/create', expect.objectContaining({ error: error.message }));
            consoleSpy.mockRestore();
        });
    });

    describe('update', () => {
        it('devrait mettre à jour et rediriger', async () => {
            req.body = { id: 1, numero: 102 };
            Chambre.update.mockResolvedValue(true);

            await ChambreController.update(req, res);

            expect(Chambre.update).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/chambres');
        });
    });

    describe('delete', () => {
        it('devrait supprimer et rediriger', async () => {
            req.params.id = 1;
            Chambre.delete.mockResolvedValue(true);

            await ChambreController.delete(req, res);

            expect(Chambre.delete).toHaveBeenCalledWith(1);
            expect(res.redirect).toHaveBeenCalledWith('/chambres');
        });

        it('devrait empêcher la suppression si la chambre est réservée', async () => {
            req.params.id = 1;
            Chambre.delete.mockRejectedValue(new Error('utilisée dans des réservations'));
            Chambre.findById.mockResolvedValue({ id: 1 });
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.delete(req, res);

            expect(res.render).toHaveBeenCalledWith('chambres/delete', expect.objectContaining({ error: expect.any(String) }));
            consoleSpy.mockRestore();
        });
    });
});
