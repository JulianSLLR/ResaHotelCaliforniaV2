import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReservationController from '../src/controllers/reservationController.js';
import Reservation from '../src/models/reservation.js';
import Client from '../src/models/client.js';
import Chambre from '../src/models/chambre.js';

vi.mock('../src/models/reservation.js');
vi.mock('../src/models/client.js');
vi.mock('../src/models/chambre.js');

describe('ReservationController', () => {
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
        it('devrait afficher la liste des réservations', async () => {
            const mockRes = [{ id: 1 }];
            Reservation.findAll.mockResolvedValue(mockRes);

            await ReservationController.getAll(req, res);

            expect(res.render).toHaveBeenCalledWith('reservations/index', { reservations: mockRes });
        });
    });

    describe('createForm', () => {
        it('devrait charger le formulaire avec clients et chambres', async () => {
            Client.findAll.mockResolvedValue([]);
            Chambre.findAll.mockResolvedValue([]);

            await ReservationController.createForm(req, res);

            expect(res.render).toHaveBeenCalledWith('reservations/create', expect.anything());
        });
    });

    describe('create', () => {
        it('devrait créer une réservation et rediriger', async () => {
            req.body = { clientId: 1, chambreId: 101 };
            Reservation.create.mockResolvedValue(true);

            await ReservationController.create(req, res);

            expect(res.redirect).toHaveBeenCalledWith('/reservations');
        });

        it('devrait réafficher le formulaire en cas d\'échec', async () => {
            Reservation.create.mockRejectedValue(new Error());
            Client.findAll.mockResolvedValue([]);
            Chambre.findAll.mockResolvedValue([]);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await ReservationController.create(req, res);

            expect(res.render).toHaveBeenCalledWith('reservations/create', expect.anything());
            consoleSpy.mockRestore();
        });
    });

    describe('delete', () => {
        it('devrait supprimer et rediriger', async () => {
            req.params.id = 1;
            Reservation.delete.mockResolvedValue(true);

            await ReservationController.delete(req, res);

            expect(res.redirect).toHaveBeenCalledWith('/reservations');
        });
    });
});
