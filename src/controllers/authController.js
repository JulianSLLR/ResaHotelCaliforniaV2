import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../../config/connexion.js';

const SECRET = process.env.SECRET || process.env.JWT_SECRET;

/**
 * Controller pour l'authentification via l'interface Web
 */
class WebAuthController {

    /**
     * Affiche la page de connexion
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    static loginForm(req, res) {
        if (req.user) {
            return res.redirect('/');
        }
        res.render('login', { error: null });
    }

    /**
     * Traite la soumission du formulaire de connexion
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            const [rows] = await db.execute(
                'SELECT id, username, password_hash, role FROM utilisateurs WHERE username = ?',
                [username]
            );

            if (rows.length === 0) {
                return res.render('login', { error: "Identifiants incorrects." });
            }

            const user = rows[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {
                return res.render('login', { error: "Identifiants incorrects." });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                SECRET,
                { expiresIn: '24h' }
            );

            // Stocker le token dans un cookie sécurisé
            res.cookie('token', token, {
                httpOnly: true,
                secure: true, // HTTPS
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24h
            });

            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.render('login', { error: "Une erreur est survenue lors de la connexion." });
        }
    }

    /**
     * Déconnecte l'utilisateur
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    static logout(req, res) {
        res.clearCookie('token');
        res.redirect('/login');
    }
}

export default WebAuthController;
