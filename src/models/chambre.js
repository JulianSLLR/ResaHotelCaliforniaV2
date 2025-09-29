import db from '../config/connexion.js';

class Chambre {
    constructor(data) {
        this.idChambre = data.idChambre;
        this.numero = data.numero;
        this.capacite = data.capacite;
        this.disponibilite = data.disponibilite;
    }

    // Récupérer tous les chambres
    static async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM chambres');
            return rows.map(row => new Chambre(row));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des chambres:' + error.message);
        }
    }

    // Récupérer une chambre par ID
    static async findById(id) {
    try {
    const [rows] = await db.execute('SELECT * FROM chambres WHERE id = ?', [id]);
    return rows.length > 0 ? new Chambre(rows[0]) : null;
    } catch (error) {
    throw new Error('Erreur lors de la récupération de la chambre: ' + error.message);
    }
    }
    // Créer une chambre
    static async create(ChambreId){
        try{
            const [rows] = await db.execute('INSERT INTO chambres (idChambre, numero, capacite, disponibilite) VALUES (?, ?, ?, ?)', [ChambreId.idChambre, ChambreId.numero, ChambreId.capacite, ChambreId.disponibilite]);
            return result.insertId;
        } catch (error) {
            throw new Error('Erreur lors de la création de la chambre: ' + error.message);
        }
    }
    // Mettre à jour une chambre
    static async update(ChambreID){
        try{
            const [rows] = await db.execute('UPDATE chambres SET numero = ?, capacite = ?, disponibilite = ? WHERE id = ?', [ChambreID.numero, ChambreID.capacite, ChambreID.disponibilite, ChambreID.id]);
            return rows.lengh > 0 ? new Chambre
        }
    }

    

}
