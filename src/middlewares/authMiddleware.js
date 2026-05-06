import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = process.env.SECRET || process.env.JWT_SECRET;

/**
 * Middleware de gestion de l'authentification et des rôles (RBAC)
 */
class AuthMiddleware {

    /**
     * Vérifie si l'utilisateur est authentifié via JWT
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     * @param {Function} next - Fonction suivante
     */
    static isAuthenticated(req, res, next) {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            // Si c'est une requête API, on renvoie du JSON, sinon on redirige vers le login
            if (req.path.startsWith('/api')) {
                return res.status(401).json({ success: false, error: "Accès refusé. Token manquant." });
            }
            return res.redirect('/login');
        }

        try {
            const decoded = jwt.verify(token, SECRET);
            req.user = decoded;
            res.locals.user = decoded; // Rendre l'utilisateur disponible dans EJS
            next();
        } catch (error) {
            res.clearCookie('token');
            if (req.path.startsWith('/api')) {
                return res.status(403).json({ success: false, error: "Token invalide ou expiré." });
            }
            return res.redirect('/login');
        }
    }

    /**
     * Restreint l'accès aux rôles spécifiés
     * @param {Array<string>} roles - Liste des rôles autorisés (ex: ['admin', 'reception'])
     * @returns {Function} - Middleware Express
     */
    static authorize(roles = []) {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).redirect('/login');
            }

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).render('errors/403', {
                    message: "Vous n'avez pas les droits nécessaires pour accéder à cette page."
                });
            }

            next();
        };
    }

    /**
     * Middleware global pour injecter l'utilisateur dans res.locals sans bloquer
     * Utile pour la navbar (Afficher 'Connexion' ou 'Mon Profil')
     */
    static setUser(req, res, next) {
        const token = req.cookies.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, SECRET);
                req.user = decoded;
                res.locals.user = decoded;
            } catch (error) {
                res.clearCookie('token');
                res.locals.user = null;
            }
        } else {
            res.locals.user = null;
        }
        next();
    }
}

export default AuthMiddleware;
