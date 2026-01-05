import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ChambreController from './ChambreController.js'; // Assurez-vous que le chemin est correct
import Chambre from '../models/chambre.js';

// On mocke (simule) le modèle Chambre pour ne pas taper dans la vraie BDD
vi.mock('../models/chambre.js');

describe('ChambreController', () => {
    let req;
    let res;

    // Avant chaque test, on réinitialise req et res
    beforeEach(() => {
        req = {
            params: {},
            body: {}
        };
        res = {
            render: vi.fn(),
            redirect: vi.fn(),
            status: vi.fn().mockReturnThis(), // Pour permettre le chaînage .status().send()
            send: vi.fn()
        };
    });

    // Nettoyage des mocks après chaque test
    afterEach(() => {
        vi.clearAllMocks();
    });

    // --- Tests pour getAll ---
    describe('getAll', () => {
        it('devrait récupérer les chambres et rendre la vue index', async () => {
            const mockChambres = [{ id: 1, nom: 'Suite' }];
            Chambre.findAll.mockResolvedValue(mockChambres);

            await ChambreController.getAll(req, res);

            expect(Chambre.findAll).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('chambres/index', { chambres: mockChambres });
        });

        it('devrait gérer les erreurs et renvoyer une 500', async () => {
            Chambre.findAll.mockRejectedValue(new Error('Erreur BDD'));

            await ChambreController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Erreur'));
        });
    });

    // --- Tests pour getOne ---
    describe('getOne', () => {
        it('devrait récupérer une chambre et rendre la vue showOne', async () => {
            req.params.id = 1;
            const mockChambre = { id: 1, nom: 'Eco' };
            Chambre.findById.mockResolvedValue(mockChambre);

            await ChambreController.getOne(req, res);

            expect(Chambre.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('chambres/showOne', { chambre: mockChambre });
        });

        it('devrait gérer les erreurs (500)', async () => {
            Chambre.findById.mockRejectedValue(new Error('Erreur'));
            await ChambreController.getOne(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // --- Tests pour createForm ---
    describe('createForm', () => {
        it('devrait rendre le formulaire de création', async () => {
            await ChambreController.createForm(req, res);
            expect(res.render).toHaveBeenCalledWith('chambres/create');
        });
    });

    // --- Tests pour create ---
    describe('create', () => {
        it('devrait créer une chambre et rediriger', async () => {
            req.body = { nom: 'Nouvelle Chambre' };
            Chambre.create.mockResolvedValue(true);

            await ChambreController.create(req, res);

            expect(Chambre.create).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/chambres');
        });

        it('devrait gérer les erreurs de création (500)', async () => {
            Chambre.create.mockRejectedValue(new Error('Fail'));
            await ChambreController.create(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // --- Tests pour updateForm ---
    describe('updateForm', () => {
        it('devrait récupérer la chambre et rendre le formulaire d\'édition', async () => {
            req.params.id = 1;
            const mockChambre = { id: 1, nom: 'Old Name' };
            Chambre.findById.mockResolvedValue(mockChambre);

            await ChambreController.updateForm(req, res);

            expect(res.render).toHaveBeenCalledWith('chambres/edit', { chambre: mockChambre });
        });

        it('devrait gérer les erreurs (500)', async () => {
            Chambre.findById.mockRejectedValue(new Error('Erreur'));
            await ChambreController.updateForm(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // --- Tests pour update ---
    describe('update', () => {
        it('devrait mettre à jour et rediriger', async () => {
            req.body = { id: 1, nom: 'New Name' };
            Chambre.update.mockResolvedValue(true);

            await ChambreController.update(req, res);

            expect(Chambre.update).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/chambres');
        });

        it('devrait gérer les erreurs de mise à jour (500)', async () => {
            Chambre.update.mockRejectedValue(new Error('Fail'));
            await ChambreController.update(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // --- Tests pour deleteForm ---
    describe('deleteForm', () => {
        it('devrait afficher la confirmation de suppression si la chambre existe', async () => {
            req.params.id = 1;
            const mockChambre = { id: 1 };
            Chambre.findById.mockResolvedValue(mockChambre);

            await ChambreController.deleteForm(req, res);

            expect(res.render).toHaveBeenCalledWith('chambres/delete', { chambre: mockChambre, error: null });
        });

        it('devrait renvoyer 404 si la chambre n\'existe pas', async () => {
            req.params.id = 999;
            Chambre.findById.mockResolvedValue(null);

            await ChambreController.deleteForm(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Chambre non trouvée');
        });

        it('devrait gérer les erreurs (500)', async () => {
            Chambre.findById.mockRejectedValue(new Error('Erreur'));
            await ChambreController.deleteForm(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // --- Tests pour delete (Complexe) ---
    describe('delete', () => {
        it('devrait supprimer la chambre et rediriger en cas de succès', async () => {
            req.params.id = 1;
            Chambre.delete.mockResolvedValue(true);

            await ChambreController.delete(req, res);

            expect(Chambre.delete).toHaveBeenCalledWith(1);
            expect(res.redirect).toHaveBeenCalledWith('/chambres');
        });

        it('devrait gérer le cas spécifique : chambre utilisée dans des réservations', async () => {
            req.params.id = 1;
            const mockChambre = { id: 1, nom: 'Occupée' };
            
            // 1. Simuler l'erreur spécifique
            const error = new Error('Impossible... car utilisée dans des réservations...');
            Chambre.delete.mockRejectedValue(error);
            
            // 2. Simuler la récupération de la chambre pour ré-afficher le formulaire
            Chambre.findById.mockResolvedValue(mockChambre);

            await ChambreController.delete(req, res);

            // Vérifications
            expect(Chambre.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('chambres/delete', {
                chambre: mockChambre,
                error: expect.stringContaining('Impossible de supprimer cette chambre')
            });
        });

        it('devrait gérer une erreur lors du findById dans le catch de suppression', async () => {
             // Cas rare : erreur delete "réservation" PUIS erreur findById
             req.params.id = 1;
             const error = new Error('utilisée dans des réservations');
             Chambre.delete.mockRejectedValue(error);
             Chambre.findById.mockRejectedValue(new Error('Erreur DB critique'));
 
             await ChambreController.delete(req, res);
 
             expect(res.status).toHaveBeenCalledWith(500);
             expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération de la chambre');
        });

        it('devrait gérer les autres erreurs de suppression (500 générique)', async () => {
            req.params.id = 1;
            Chambre.delete.mockRejectedValue(new Error('Autre erreur SQL'));

            await ChambreController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Autre erreur SQL'));
        });
    });
});