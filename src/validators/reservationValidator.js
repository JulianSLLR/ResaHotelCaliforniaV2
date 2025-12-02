import { body, validationResult } from 'express-validator';

export const checkReservation = [
    // Validation du champ 'idClient'
    body('idClient')
        .isInt().withMessage('Client invalide')
        .notEmpty().withMessage('Le client est requis'),

    // Validation du champ 'idChambre'
    body('idChambre')
        .isInt().withMessage('Chambre invalide')
        .notEmpty().withMessage('La chambre est requise'),

    // Validation du champ 'dateDebut'
    body('dateDebut')
        .isDate().withMessage('Date de début invalide')
        .notEmpty().withMessage('La date de début est requise'),

    // Validation du champ 'dateFin'
    body('dateFin')
        .isDate().withMessage('Date de fin invalide')
        .notEmpty().withMessage('La date de fin est requise')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.dateDebut)) {
                throw new Error('La date de fin doit être après la date de début');
            }
            return true;
        }),

    // Middleware de gestion des erreurs
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
