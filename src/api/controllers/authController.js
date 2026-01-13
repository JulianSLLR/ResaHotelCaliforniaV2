import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../../../config/connexion.js';

dotenv.config();
const SECRET = process.env.SECRET;

const CtrlAuth = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: "Veuillez fournir un nom d'utilisateur et un mot de passe."
        });
      }

      const [rows] = await db.execute(
        'SELECT id, username, password_hash, role FROM utilisateurs WHERE username = ?',
        [username]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, error: "Identifiants incorrects." });
      }

      const user = rows[0];

      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) {
        return res.status(401).json({ success: false, error: "Identifiants incorrects." });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        SECRET,
        { expiresIn: '1 hour' }
      );

      return res.json({ success: true, data: { token } });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: "Erreur lors de l'authentification",
        message: error.message
      });
    }
  },
  
  verifyToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    let token;

    if (authHeader) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    // Vérification de la validité du token
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token invalide ou expiré." });
      }
      req.user = user;
      next();
    });
  }
};
export default CtrlAuth;