import { body, validationResult } from 'express-validator';

export const checkChambre = [
    // Validation du champ 'numero'
    body('numero')
        .isInt().withMessage('Le numéro doit être un nombre entier')
        .notEmpty().withMessage('Le numéro est requis')
        .escape(),

    // Validation du champ 'capacite'
    body('capacite')
        .isInt({ min: 1 }).withMessage('La capacité doit être au moins 1')
        .notEmpty().withMessage('La capacité est requise'),

    // Validation du champ 'disponibilite'
    body('disponibilite')
        .isBoolean().withMessage('La disponibilité doit être un booléen')
        .optional(),

    // Middleware de gestion des erreurs
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
