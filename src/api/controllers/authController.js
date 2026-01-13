import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

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

      // à remplacer dans la BDD plus tard.
      if (username === 'admin' && password === 'azerty123') {

        // Création du token
        const token = jwt.sign(
          { id: 0, username },
          SECRET,
          { expiresIn: '1 year' }
        );

        // Envoi du token
        return res.json({
          success: true,
          data: { token }
        });

      } else {
        return res.status(401).json({
          success: false,
          error: 'Identifiants incorrects.'
        });
      }

    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Erreur lors de l'authentification",
        message: error.message
      });
    }
  }, 
  // Vérification du token
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