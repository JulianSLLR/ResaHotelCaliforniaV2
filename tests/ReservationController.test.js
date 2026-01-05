
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReservationController from '../src/controllers/reservationController.js';
import Reservation from '../src/models/reservation.js';
import Client from '../src/models/client.js';
import Chambre from '../src/models/chambre.js';

// Mock des modèles pour isoler les tests du contrôleur
vi.mock('../src/models/reservation.js');
vi.mock('../src/models/client.js');
vi.mock('../src/models/chambre.js');

describe('ReservationController', () => {
    let req;
    let res;

    beforeEach(() => {
        // Nettoyage des mocks avant chaque test
        vi.clearAllMocks();

        // Mocks de base pour req et res
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
        // Test nominal : récupération de la liste et affichage
        it('should render reservations/index with a list of reservations', async () => {
            const mockReservations = [{ id: 1 }, { id: 2 }];
            Reservation.findAll.mockResolvedValue(mockReservations);

            await ReservationController.getAll(req, res);

            expect(Reservation.findAll).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('reservations/index', { reservations: mockReservations });
        });

        // Gestion des erreurs
        it('should handle errors', async () => {
            const error = new Error('Database connection failed');
            Reservation.findAll.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ReservationController.getAll(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération des réservations');
            
            consoleSpy.mockRestore();
        });
    });

    describe('getOne', () => {
        // Test nominal : réservation trouvée
        it('should render reservations/showOne with the requested reservation', async () => {
            const mockReservation = { id: 1 };
            req.params.id = 1;
            Reservation.findById.mockResolvedValue(mockReservation);

            await ReservationController.getOne(req, res);

            expect(Reservation.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('reservations/showOne', { reservation: mockReservation });
        });

        // Gestion des erreurs
        it('should handle errors', async () => {
            const error = new Error('Access error');
            req.params.id = 1;
            Reservation.findById.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ReservationController.getOne(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération de la réservation');

            consoleSpy.mockRestore();
        });
    });

    describe('createForm', () => {
        // Chargement du formulaire avec les dépendances (clients et chambres)
        it('should render reservations/create with clients and chambres', async () => {
            const mockClients = [{ id: 1 }];
            const mockChambres = [{ id: 101 }];
            
            Client.findAll.mockResolvedValue(mockClients);
            Chambre.findAll.mockResolvedValue(mockChambres);

            await ReservationController.createForm(req, res);

            expect(Client.findAll).toHaveBeenCalled();
            expect(Chambre.findAll).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('reservations/create', { clients: mockClients, chambres: mockChambres });
        });

        // Gestion d'erreur si le chargement des dépendances échoue
        it('should handle errors when loading form data', async () => {
            const error = new Error('Data load failed');
            Client.findAll.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ReservationController.createForm(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération des clients et des chambres');

            consoleSpy.mockRestore();
        });
    });

    describe('create', () => {
        // Création réussie
        it('should create a reservation and redirect', async () => {
            req.body = { clientId: 1, chambreId: 101, dates: '...' };
            Reservation.create.mockResolvedValue(true);

            await ReservationController.create(req, res);

            expect(Reservation.create).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/reservations');
        });

        // Echec de création : rechargement du formulaire avec erreurs et données
        it('should handle creation errors by reloading dependencies and rendering form with error', async () => {
            const error = new Error('Validation failed');
            req.body = { clientId: 1 };
            req.params.id = 'new-id'; 
            
            Reservation.create.mockRejectedValue(error);
            
            // Mocks pour le rechargement des données du formulaire
            const mockClients = [{ id: 1 }];
            const mockChambres = [{ id: 101 }];
            Client.findAll.mockResolvedValue(mockClients);
            Chambre.findAll.mockResolvedValue(mockChambres);
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ReservationController.create(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(Client.findAll).toHaveBeenCalled(); // Doit recharger les clients
            expect(Chambre.findAll).toHaveBeenCalled(); // Doit recharger les chambres
            
            // Vérification que le rendu contient bien l'erreur et les données conservées
            expect(res.render).toHaveBeenCalledWith('reservations/create', expect.objectContaining({
                error: error.message,
                clients: mockClients,
                chambres: mockChambres,
                reservation: expect.any(Object) // Vérifie que l'objet réservation est reconstruit
            }));
            
            consoleSpy.mockRestore();
        });
    });

    describe('updateForm', () => {
        // Préparation du formulaire d'édition
        it('should render reservations/edit with reservation, clients, and chambres', async () => {
            const mockReservation = { id: 1, clientId: 1 };
            const mockClients = [{ id: 1 }];
            const mockChambres = [{ id: 101 }];
            
            req.params.id = 1;
            Reservation.findById.mockResolvedValue(mockReservation);
            Client.findAll.mockResolvedValue(mockClients);
            Chambre.findAll.mockResolvedValue(mockChambres);

            await ReservationController.updateForm(req, res);

            expect(Reservation.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('reservations/edit', { 
                reservation: mockReservation, 
                clients: mockClients, 
                chambres: mockChambres 
            });
        });

        // Erreur lors de la récupération des données
        it('should handle errors', async () => {
            const error = new Error('Fetch error');
            req.params.id = 1;
            Reservation.findById.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ReservationController.updateForm(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération de la réservation');

            consoleSpy.mockRestore();
        });
    });

    describe('update', () => {
        // Mise à jour réussie
        it('should update the reservation and redirect', async () => {
            req.body = { id: 1, status: 'confirmed' };
            Reservation.update.mockResolvedValue(true);

            await ReservationController.update(req, res);

            expect(Reservation.update).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/reservations');
        });

        // Echec de mise à jour : retour au formulaire
        it('should handle update errors by rendering the edit form with error', async () => {
            const error = new Error('Update failed');
            req.body = { status: 'confirmed' };
            req.params.id = 1;
            
            Reservation.update.mockRejectedValue(error);
            
            // Mocks pour le rechargement contextuel
            const mockClients = [{ id: 1 }];
            const mockChambres = [{ id: 101 }];
            Client.findAll.mockResolvedValue(mockClients);
            Chambre.findAll.mockResolvedValue(mockChambres);
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ReservationController.update(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.render).toHaveBeenCalledWith('reservations/edit', expect.objectContaining({
                error: error.message,
                clients: mockClients,
                chambres: mockChambres,
                reservation: expect.any(Object)
            }));

            consoleSpy.mockRestore();
        });
    });

    describe('deleteForm', () => {
        // Confirmation de suppression
        it('should render reservations/delete with the reservation', async () => {
            const mockReservation = { id: 1 };
            req.params.id = 1;
            Reservation.findById.mockResolvedValue(mockReservation);

            await ReservationController.deleteForm(req, res);

            expect(Reservation.findById).toHaveBeenCalledWith(1);
            expect(res.render).toHaveBeenCalledWith('reservations/delete', { reservation: mockReservation });
        });

        // Erreur d'accès
        it('should handle errors', async () => {
            req.params.id = 1;
            const error = new Error('DB Error');
            Reservation.findById.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ReservationController.deleteForm(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la récupération de la réservation');

            consoleSpy.mockRestore();
        });
    });

    describe('delete', () => {
        // Suppression effective
        it('should delete the reservation and redirect', async () => {
            req.params.id = 1;
            Reservation.delete.mockResolvedValue(true);

            await ReservationController.delete(req, res);

            expect(Reservation.delete).toHaveBeenCalledWith(1);
            expect(res.redirect).toHaveBeenCalledWith('/reservations');
        });

        // Echec de suppression
        it('should handle errors during delete', async () => {
            req.params.id = 1;
            const error = new Error('Delete Error');
            Reservation.delete.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ReservationController.delete(req, res);

            expect(consoleSpy).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de la suppression de la réservation');

            consoleSpy.mockRestore();
        });
    });

});
