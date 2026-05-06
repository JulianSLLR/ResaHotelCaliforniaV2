import db from "../../config/connexion.js";

class Reservation {
  /**
   * Constructeur de la classe Reservation
   * @param {Object} data - Les données de la reservation
   * @param {number} data.idReservation - L'ID de la reservation
   * @param {number} data.idClient - L'ID du client
   * @param {number} data.idChambre - L'ID de la chambre
   * @param {string} data.dateDebut - La date de début de la reservation
   * @param {string} data.dateFin - La date de fin de la reservation
   * @param {number} data.nbPersonnes - Le nombre de personnes
   * @param {string} data.statut - Le statut de la réservation
   * @param {number} data.numero - Le numéro de la chambre
   * @param {number} data.capacite - La capacité de la chambre
   * @param {number} data.disponibilite - La disponibilité de la chambre
   * @param {string} data.nom - Le nom du client
   */
  constructor(data) {
    this.idReservation = data.idReservation;
    this.idClient = data.idClient;
    this.idChambre = data.idChambre;
    this.dateDebut = data.dateDebut;
    this.dateFin = data.dateFin;
    this.nbPersonnes = data.nbPersonnes;
    this.statut = data.statut;
    // Données de la chambre
    this.numero = data.numero;
    this.capacite = data.capacite;
    this.disponibilite = data.disponibilite;
    // Données du client
    this.nomClient = data.nom;
  }

  /**
   * Formater la date de début pour l'affichage
   * @returns {string} - La date formatée (JJ/MM/AAAA)
   */
  getFormattedDateDebut() {
    if (!this.dateDebut) return "";
    const date = new Date(this.dateDebut);
    return date.toLocaleDateString("fr-FR");
  }

  /**
   * Formater la date de fin pour l'affichage
   * @returns {string} - La date formatée (JJ/MM/AAAA)
   */
  getFormattedDateFin() {
    if (!this.dateFin) return "";
    const date = new Date(this.dateFin);
    return date.toLocaleDateString("fr-FR");
  }

  /**
   * Formater la date de début pour l'input date (AAAA-MM-JJ)
   * @returns {string} - La date formatée (AAAA-MM-JJ)
   */
  getIsoDateDebut() {
    if (!this.dateDebut) return "";
    const date = new Date(this.dateDebut);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /**
   * Formater la date de fin pour l'input date (AAAA-MM-JJ)
   * @returns {string} - La date formatée (AAAA-MM-JJ)
   */
  getIsoDateFin() {
    if (!this.dateFin) return "";
    const date = new Date(this.dateFin);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /**
   * Récupérer toutes les réservations
   * @returns {Promise<Array<Reservation>>} - La liste des réservations
   */
  static async findAll() {
    try {
      const [rows] = await db.execute(
        "SELECT r.idReservation, r.idClient, r.idChambre, r.dateDebut, r.dateFin, r.nbPersonnes, r.statut, " +
          "c.numero, c.capacite, c.disponibilite, " +
          "cl.nom " +
          "FROM reservations r " +
          "INNER JOIN chambres c ON r.idChambre = c.idChambre " +
          "INNER JOIN clients cl ON r.idClient = cl.idClient",
      );
      return rows.map((row) => new Reservation(row));
    } catch (error) {
      throw new Error(
        "Erreur lors de la récupération des réservations: " + error.message,
      );
    }
  }

  /**
   * Récupérer une réservation par ID
   * @param {number} id - L'ID de la réservation
   * @returns {Promise<Reservation | null>} - La réservation correspondante ou null
   */
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        "SELECT r.idReservation, r.idClient, r.idChambre, r.dateDebut, r.dateFin, r.nbPersonnes, r.statut, " +
          "c.numero, c.capacite, c.disponibilite, " +
          "cl.nom " +
          "FROM reservations r " +
          "INNER JOIN chambres c ON r.idChambre = c.idChambre " +
          "INNER JOIN clients cl ON r.idClient = cl.idClient " +
          "WHERE r.idReservation = ?",
        [id],
      );
      return rows.length > 0 ? new Reservation(rows[0]) : null;
    } catch (error) {
      throw new Error(
        "Erreur lors de la récupération de la réservation: " + error.message,
      );
    }
  }

  /**
   * Vérifier si une chambre est disponible pour une période donnée
   * @param {number} idChambre - L'ID de la chambre
   * @param {string} dateDebut - Date de début
   * @param {string} dateFin - Date de fin
   * @param {number|null} idReservationExclude - ID de la réservation à exclure (pour la modification)
   * @returns {Promise<boolean>} - true si la chambre est disponible
   */
  static async isRoomAvailable(
    idChambre,
    dateDebut,
    dateFin,
    idReservationExclude = null,
  ) {
    let sql =
      'SELECT COUNT(*) as count FROM reservations WHERE idChambre = ? AND statut != "annulee" AND dateDebut < ? AND dateFin > ?';
    let params = [idChambre, dateFin, dateDebut];

    if (idReservationExclude) {
      sql += " AND idReservation != ?";
      params.push(idReservationExclude);
    }

    const [rows] = await db.execute(sql, params);
    return rows[0].count === 0;
  }

  /**
   * Créer une réservation
   * @param {Object} reservationData - Les données de la reservation à créer
   * @returns {Promise<number>} - L'ID de la reservation créée
   */
  static async create(reservationData) {
    if (
      new Date(reservationData.dateDebut) >= new Date(reservationData.dateFin)
    ) {
      throw new Error(
        "La date de début doit être antérieure à la date de fin.",
      );
    }

    const [chambres] = await db.execute(
      "SELECT capacite, disponibilite FROM chambres WHERE idChambre = ?",
      [reservationData.idChambre],
    );
    if (chambres.length === 0) throw new Error("Chambre inexistante.");
    if (reservationData.nbPersonnes > chambres[0].capacite) {
      throw new Error(
        `Capacité insuffisante (Maximum ${chambres[0].capacite} personnes).`,
      );
    }

    const available = await this.isRoomAvailable(
      reservationData.idChambre,
      reservationData.dateDebut,
      reservationData.dateFin,
    );
    if (!available) {
      throw new Error(
        "La chambre est déjà occupée ou réservée sur cette période.",
      );
    }

    try {
      const [result] = await db.execute(
        "INSERT INTO reservations (idClient, idChambre, dateDebut, dateFin, nbPersonnes, statut) VALUES (?, ?, ?, ?, ?, ?)",
        [
          reservationData.idClient,
          reservationData.idChambre,
          reservationData.dateDebut,
          reservationData.dateFin,
          reservationData.nbPersonnes,
          reservationData.statut || "confirmee",
        ],
      );
      return result.insertId;
    } catch (error) {
      throw new Error(
        "Erreur lors de la création de la réservation: " + error.message,
      );
    }
  }

  /**
   * Mettre à jour une réservation
   * @param {Object} reservationData - Les données de la reservation à mettre à jour
   * @returns {Promise<boolean>} - true si la mise à jour a réussi
   */
  static async update(reservationData) {
    if (
      new Date(reservationData.dateDebut) >= new Date(reservationData.dateFin)
    ) {
      throw new Error(
        "La date de début doit être antérieure à la date de fin.",
      );
    }

    const [chambres] = await db.execute(
      "SELECT capacite FROM chambres WHERE idChambre = ?",
      [reservationData.idChambre],
    );
    if (reservationData.nbPersonnes > chambres[0].capacite) {
      throw new Error(
        `Capacité insuffisante (Maximum ${chambres[0].capacite} personnes).`,
      );
    }

    const available = await this.isRoomAvailable(
      reservationData.idChambre,
      reservationData.dateDebut,
      reservationData.dateFin,
      reservationData.idReservation,
    );
    if (!available) {
      throw new Error(
        "La chambre est déjà occupée ou réservée sur cette période.",
      );
    }

    try {
      await db.execute(
        "UPDATE reservations SET idClient = ?, idChambre = ?, dateDebut = ?, dateFin = ?, nbPersonnes = ?, statut = ? WHERE idReservation = ?",
        [
          reservationData.idClient,
          reservationData.idChambre,
          reservationData.dateDebut,
          reservationData.dateFin,
          reservationData.nbPersonnes,
          reservationData.statut,
          reservationData.idReservation,
        ],
      );
      return true;
    } catch (error) {
      throw new Error(
        "Erreur lors de la mise à jour de la réservation: " + error.message,
      );
    }
  }

  /**
   * Supprimer une réservation
   * @param {number} id - L'ID de la reservation à supprimer
   * @returns {Promise<boolean>} - true si la suppression a réussi
   */
  static async delete(id) {
    try {
      await db.execute("DELETE FROM reservations WHERE idReservation = ?", [
        id,
      ]);
      return true;
    } catch (error) {
      throw new Error(
        "Erreur lors de la suppression de la réservation: " + error.message,
      );
    }
  }
}

export default Reservation;
