CREATE DATABASE resahotelcaliforniasd;

USE resahotelcaliforniasd;

CREATE TABLE chambres (
    idChambre INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL,
    capacite INT NOT NULL,
    disponibilite BOOLEAN NOT NULL,
    UNIQUE (numero)
);

CREATE TABLE clients (
    idClient INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    telephone VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nbPersonnes INT NOT NULL,
    UNIQUE (telephone),
    UNIQUE (email)
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

CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','reception','manager') NOT NULL DEFAULT 'reception'
);

INSERT INTO utilisateurs (username, password_hash, role) VALUES
('admin',    '$2b$10$0dAwHLSIZZZoHsvp2pMWROKAAe/4SCPalb89m579L.SyHsPcpxCl6', 'admin'),
('reception1','$2b$10$0dAwHLSIZZZoHsvp2pMWROKAAe/4SCPalb89m579L.SyHsPcpxCl6', 'reception'),
('manager1', '$2b$10$0dAwHLSIZZZoHsvp2pMWROKAAe/4SCPalb89m579L.SyHsPcpxCl6', 'manager');
