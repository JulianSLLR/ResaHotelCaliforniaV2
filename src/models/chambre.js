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
    static async create(chambreData){
        try{
            const [result] = await db.execute('INSERT INTO chambres (idChambre, numero, capacite, disponibilite) VALUES (?, ?, ?, ?)', [chambreData.idChambre, chambreData.numero, chambreData.capacite, chambreData.disponibilite]);
            return result.insertId;
        } catch (error) {
            throw new Error('Erreur lors de la création de la chambre: ' + error.message);
        }
    }
    // Mettre à jour une chambre
    static async update(chambreData){
        try{
            const [result] = await db.execute('UPDATE chambres SET numero = ?, capacite = ?, disponibilite = ? WHERE id = ?', [chambreData.numero, chambreData.capacite, chambreData.disponibilite, chambreData.id]);
            this.numero = chambreData.numero;
            this.capacite = chambreData.capacite;
            this.disponibilite = chambreData.disponibilite;
            return true;
        }
        catch (error) {
            throw new Error('Erreur lors de la mise à jour de la chambre: ' + error.message);
        }
    }
    // Supprimer une chambre
    static async delete(id){
        try{
            const [result] = await db.execute('DELETE FROM chambres WHERE id = ?', [id]);
            return true;
        } catch (error) {
            throw new Error('Erreur lors de la suppression de la chambre: ' + error.message);
        }
    }
    // Verifier si une chambre est disponible
    static async isAvailable(id){
        try{
            const [rows] = await db.execute('SELECT * FROM chambres WHERE id = ? AND disponibilite = 1', [id]);
            return rows.length > 0;
        } catch (error) {
            throw new Error('Erreur lors de la vérification de la disponibilité de la chambre: ' + error.message);
        }
    }
    

}
