
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChambreController from '../src/controllers/ChambreController.js';
import Chambre from '../src/models/chambre.js';

// Mock du modèle Chambre pour isoler les tests
vi.mock('../src/models/chambre.js');

describe('ChambreController', () => {
    let req;
    let res;

    beforeEach(() => {
        // Nettoyage des mocks avant chaque test pour garantir l'isolation
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
        // Test du cas nominal : récupération et affichage de la liste
        it('should render chambres/index with a list of chambres', async () => {
            const mockChambres = [{ id: 1, numero: 101 }, { id: 2, numero: 102 }];
            Chambre.findAll.mockResolvedValue(mockChambres);

            await ChambreController.getAll(req, res);

            expect(Chambre.findAll).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('chambres/index', { chambres: mockChambres });
        });

        // Simulation d'une erreur BDD (ex: problème de connexion)
        it('should handle errors', async () => {
            const error = new Error('Database connection failed');
            Chambre.findAll.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.getAll(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération des chambres');
            
            consoleSpy.mockRestore();
        });
    });

    describe('getOne', () => {
        // Vérifie que le contrôleur récupère la chambre et rend la vue détail
        it('should render chambres/showOne with the requested chambre', async () => {
            const mockChambre = { id: 1, numero: 101 };
            req.params.id = 1;
            Chambre.findById.mockResolvedValue(mockChambre);

            await ChambreController.getOne(req, res);

            expect(Chambre.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('chambres/showOne', { chambre: mockChambre });
        });

        // Gestion des erreurs lors de la récupération par ID
        it('should handle errors', async () => {
            const error = new Error('Database error');
            req.params.id = 1;
            Chambre.findById.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.getOne(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération de la chambre');

            consoleSpy.mockRestore();
        });
    });

    describe('createForm', () => {
        // Simple vérification de l'affichage du formulaire
        it('should render chambres/create', async () => {
            await ChambreController.createForm(req, res);
            expect(res.render).toHaveBeenCalledWith('chambres/create');
        });
    });

    describe('create', () => {
        // Cas nominal : création réussie et redirection vers la liste
        it('should create a chambre and redirect', async () => {
            req.body = { numero: 105, type: 'Double' };
            Chambre.create.mockResolvedValue(true);

            await ChambreController.create(req, res);

            expect(Chambre.create).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/chambres');
        });

        // Cas de validation échouée ou erreur BDD : on réaffiche le formulaire avec l'erreur
        it('should handle creation errors by rendering the form with error', async () => {
            const error = new Error('Validation failed');
            req.body = { numero: 105 };
             // Simulation d'un ID pour matcher la logique du contrôleur si nécessaire
            req.params.id = 1337; 
            Chambre.create.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.create(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            // Vérification que les données soumises sont renvoyées au formulaire
            const expectedChambreData = { ...req.body, idChambre: 1337 }; 
            
            expect(res.render).toHaveBeenCalledWith('chambres/create', {
                error: error.message,
                chambre: req.body
            });
            
            consoleSpy.mockRestore();
        });
    });

    describe('updateForm', () => {
        // Récupération des données existantes pour pré-remplir le formulaire
        it('should render chambres/edit with the chambre data', async () => {
            const mockChambre = { id: 1, numero: 101 };
            req.params.id = 1;
            Chambre.findById.mockResolvedValue(mockChambre);

            await ChambreController.updateForm(req, res);

            expect(Chambre.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('chambres/edit', { chambre: mockChambre });
        });

        // Erreur si la chambre n'est pas récupérable pour édition
        it('should handle errors', async () => {
            const error = new Error('Database error');
            req.params.id = 1;
            Chambre.findById.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.updateForm(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération de la chambre');

            consoleSpy.mockRestore();
        });
    });

    describe('update', () => {
        // Mise à jour validée : redirection
        it('should update the chambre and redirect', async () => {
            req.body = { id: 1, numero: 102 };
            Chambre.update.mockResolvedValue(true);

            await ChambreController.update(req, res);

            expect(Chambre.update).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/chambres');
        });

        // Echec de mise à jour : retour au formulaire d'édition
        it('should handle update errors by rendering the edit form with error', async () => {
            const error = new Error('Update failed');
            req.body = { numero: 102 };
            req.params.id = 1;
            Chambre.update.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.update(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            const expectedChambreData = { ...req.body, idChambre: 1 };
            expect(res.render).toHaveBeenCalledWith('chambres/edit', {
                error: error.message,
                chambre: expectedChambreData
            });

            consoleSpy.mockRestore();
        });
    });

    describe('deleteForm', () => {
        // Affichage de la confirmation de suppression
        it('should render chambres/delete if chambre exists', async () => {
            const mockChambre = { id: 1, numero: 101 };
            req.params.id = 1;
            Chambre.findById.mockResolvedValue(mockChambre);

            await ChambreController.deleteForm(req, res);

            expect(Chambre.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('chambres/delete', { chambre: mockChambre, error: null });
        });

        // Si la chambre n'existe pas, retour 404
        it('should return 404 if chambre not found', async () => {
            req.params.id = 1;
            Chambre.findById.mockResolvedValue(null);

            await ChambreController.deleteForm(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Chambre non trouvée');
        });

        // Erreur technique lors de l'accès au formulaire
        it('should handle errors', async () => {
            req.params.id = 1;
            const error = new Error('DB Error');
            Chambre.findById.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.deleteForm(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération de la chambre');

            consoleSpy.mockRestore();
        });
    });

    describe('delete', () => {
        // Suppression confirmée
        it('should delete the chambre and redirect', async () => {
            req.params.id = 1;
            Chambre.delete.mockResolvedValue(true);

            await ChambreController.delete(req, res);

            expect(Chambre.delete).toHaveBeenCalledWith(1);
            expect(res.redirect).toHaveBeenCalledWith('/chambres');
        });

        // Gestion de la contrainte d'intégrité (chambre réservée)
        it('should handle specific "used in reservations" error', async () => {
            req.params.id = 1;
            const error = new Error('Impossible de supprimer cette chambre car elle est utilisée dans des réservations');
            Chambre.delete.mockRejectedValue(error);
            
            const mockChambre = { id: 1, numero: 101 };
            Chambre.findById.mockResolvedValue(mockChambre);
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.delete(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(Chambre.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('chambres/delete', {
                chambre: mockChambre,
                error: 'Impossible de supprimer cette chambre car elle est utilisée dans des réservations actives.'
            });

            consoleSpy.mockRestore();
        });

        // Erreurs génériques de suppression
        it('should handle generic errors during delete', async () => {
            req.params.id = 1;
            const error = new Error('Generic Delete Error');
            Chambre.delete.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.delete(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la suppression de la chambre: Generic Delete Error');

            consoleSpy.mockRestore();
        });
        
        // Cas limite : erreur de suppression ET erreur lors de la tentative de réaffichage (failed recovery)
        it('should handle error when finding chambre after reservation dependency error', async () => {
             req.params.id = 1;
            const deleteError = new Error('Impossible de supprimer cette chambre car elle est utilisée dans des réservations');
            Chambre.delete.mockRejectedValue(deleteError);
            
            const findError = new Error('Find Error');
            Chambre.findById.mockRejectedValue(findError);
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.delete(req, res);

            // Doit logger l'erreur initiale en premier
            expect(consoleSpy).toHaveBeenCalledWith(deleteError);
            
            // Puis renvoyer une erreur serveur 500
             expect(res.status).toHaveBeenCalledWith(500);
             expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération de la chambre');

            consoleSpy.mockRestore();
        });
    });

});
