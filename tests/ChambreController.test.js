
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChambreController from '../src/controllers/ChambreController.js';
import Chambre from '../src/models/chambre.js';

// Mock the Chambre model
vi.mock('../src/models/chambre.js');

describe('ChambreController', () => {
    let req;
    let res;

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();

        // Setup req and res mocks
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
        it('should render chambres/index with a list of chambres', async () => {
            const mockChambres = [{ id: 1, numero: 101 }, { id: 2, numero: 102 }];
            Chambre.findAll.mockResolvedValue(mockChambres);

            await ChambreController.getAll(req, res);

            expect(Chambre.findAll).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('chambres/index', { chambres: mockChambres });
        });

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
        it('should render chambres/showOne with the requested chambre', async () => {
            const mockChambre = { id: 1, numero: 101 };
            req.params.id = 1;
            Chambre.findById.mockResolvedValue(mockChambre);

            await ChambreController.getOne(req, res);

            expect(Chambre.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('chambres/showOne', { chambre: mockChambre });
        });

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
        it('should render chambres/create', async () => {
            await ChambreController.createForm(req, res);
            expect(res.render).toHaveBeenCalledWith('chambres/create');
        });
    });

    describe('create', () => {
        it('should create a chambre and redirect', async () => {
            req.body = { numero: 105, type: 'Double' };
            Chambre.create.mockResolvedValue(true);

            await ChambreController.create(req, res);

            expect(Chambre.create).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/chambres');
        });

        it('should handle creation errors by rendering the form with error', async () => {
            const error = new Error('Validation failed');
            req.body = { numero: 105 };
            req.params.id = 1337; // Simulate existing ID if applicable logic was slightly different, but following controller logic
            Chambre.create.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.create(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            // The controller merges params.id or body.idChambre.
            const expectedChambreData = { ...req.body, idChambre: 1337 }; 
            
            expect(res.render).toHaveBeenCalledWith('chambres/create', {
                error: error.message,
                chambre: req.body
            });
            
            consoleSpy.mockRestore();
        });
    });

    describe('updateForm', () => {
        it('should render chambres/edit with the chambre data', async () => {
            const mockChambre = { id: 1, numero: 101 };
            req.params.id = 1;
            Chambre.findById.mockResolvedValue(mockChambre);

            await ChambreController.updateForm(req, res);

            expect(Chambre.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('chambres/edit', { chambre: mockChambre });
        });

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
        it('should update the chambre and redirect', async () => {
            req.body = { id: 1, numero: 102 };
            Chambre.update.mockResolvedValue(true);

            await ChambreController.update(req, res);

            expect(Chambre.update).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/chambres');
        });

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
        it('should render chambres/delete if chambre exists', async () => {
            const mockChambre = { id: 1, numero: 101 };
            req.params.id = 1;
            Chambre.findById.mockResolvedValue(mockChambre);

            await ChambreController.deleteForm(req, res);

            expect(Chambre.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('chambres/delete', { chambre: mockChambre, error: null });
        });

        it('should return 404 if chambre not found', async () => {
            req.params.id = 1;
            Chambre.findById.mockResolvedValue(null);

            await ChambreController.deleteForm(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Chambre non trouvée');
        });

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
        it('should delete the chambre and redirect', async () => {
            req.params.id = 1;
            Chambre.delete.mockResolvedValue(true);

            await ChambreController.delete(req, res);

            expect(Chambre.delete).toHaveBeenCalledWith(1);
            expect(res.redirect).toHaveBeenCalledWith('/chambres');
        });

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
        
        it('should handle error when finding chambre after reservation dependency error', async () => {
             req.params.id = 1;
            const deleteError = new Error('Impossible de supprimer cette chambre car elle est utilisée dans des réservations');
            Chambre.delete.mockRejectedValue(deleteError);
            
            const findError = new Error('Find Error');
            Chambre.findById.mockRejectedValue(findError);
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ChambreController.delete(req, res);

            // Should first log the delete error
            expect(consoleSpy).toHaveBeenCalledWith(deleteError);
            
            // Then respond with 500
             expect(res.status).toHaveBeenCalledWith(500);
             expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération de la chambre');

            consoleSpy.mockRestore();
        });
    });

});
