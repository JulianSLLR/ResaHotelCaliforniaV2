CREATE TABLE chambres (
    idChambre INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL,
    capacite INT NOT NULL,
    disponibilite BOOLEAN NOT NULL,
    UNIQUE (numero)
);

CREATE TABLE clients (
    idClient INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    telephone VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nbPersonnes INT NOT NULL
);

CREATE TABLE reservations (
    idReservation INT AUTO_INCREMENT PRIMARY KEY,
    idClient INT NOT NULL,
    idChambre INT NOT NULL,
    dateDebut DATE NOT NULL,
    dateFin DATE NOT NULL,
    FOREIGN KEY (idClient) REFERENCES clients(idClient),
    FOREIGN KEY (idChambre) REFERENCES chambres(idChambre)
);