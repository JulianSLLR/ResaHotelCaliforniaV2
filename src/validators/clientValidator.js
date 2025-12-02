import { body, validationResult } from 'express-validator';

export const checkClient = [
    // Validation du champ 'nom'
    body('nom')
        .trim()
        .notEmpty().withMessage('Le nom est requis')
        .escape(),

    // Validation du champ 'email'
    body('email')
        .trim()
        .isEmail().withMessage('Email invalide')
        .normalizeEmail(),

    // Validation du champ 'telephone'
    body('telephone')
        .trim()
        .notEmpty().withMessage('Téléphone requis')
        .escape(),

    // Validation du champ 'nbPersonnes'
    body('nbPersonnes')
        .isInt({ min: 1 }).withMessage('Le nombre de personnes doit être au moins 1'),

    // Middleware de gestion des erreurs
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];