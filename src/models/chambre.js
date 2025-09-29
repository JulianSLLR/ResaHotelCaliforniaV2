import db from '../config/connexion.js';

class Chambre {
    constructor(data) {
        this.idChambre = data.idChambre;
        this.numero = data.numero;
        this.capacite = data.capacite;
        this.disponibilite = data.disponibilite;
    }

    static async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM chambres');
            return rows.map(row => new Chambre(row));
        } catch (error) {
            console.error('Erreur lors de la récupération des chambres:', error);
            throw error;
        }
    }
}
