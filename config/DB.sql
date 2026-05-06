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
    UNIQUE (telephone),
    UNIQUE (email)
);

CREATE TABLE reservations (
    idReservation INT AUTO_INCREMENT PRIMARY KEY,
    idClient INT NOT NULL,
    idChambre INT NOT NULL,
    dateDebut DATE NOT NULL,
    dateFin DATE NOT NULL,
    nbPersonnes INT NOT NULL, 
    statut ENUM('en_attente', 'confirmee', 'annulee', 'terminee') DEFAULT 'confirmee', 
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

-- ==========================================
-- JEU DE DONNÉES DE DÉMONSTRATION
-- ==========================================

-- 1. Insertion des Chambres (15 chambres, du simple à la suite)
INSERT INTO chambres (numero, capacite, disponibilite) VALUES
(101, 1, TRUE),  (102, 2, TRUE),  (103, 2, FALSE), (104, 3, TRUE),  (105, 4, TRUE),
(201, 1, TRUE),  (202, 2, FALSE), (203, 2, TRUE),  (204, 4, TRUE),  (205, 4, TRUE),
(301, 2, TRUE),  (302, 2, TRUE),  (303, 5, TRUE),  (401, 2, FALSE), (402, 6, TRUE);

-- 2. Insertion des Clients (Thème Rockstars / Hotel California)
INSERT INTO clients (nom, telephone, email) VALUES
('Don Henley', '0601020304', 'don.henley@eagles.com'),
('Glenn Frey', '0611223344', 'glenn.frey@eagles.com'),
('Stevie Nicks', '0622334455', 'stevie.nicks@fleetwoodmac.com'),
('Mick Jagger', '0633445566', 'mick.jagger@stones.uk'),
('David Bowie', '0644556677', 'ziggy@stardust.com'),
('Jimi Hendrix', '0655667788', 'jimi.h@experience.com'),
('Janis Joplin', '0666778899', 'janis.pearl@blues.com'),
('Jim Morrison', '0677889900', 'lizard.king@doors.com'),
('Axl Rose', '0688990011', 'axl@guns.com'),
('Slash', '0699001122', 'slash@guitars.com');

-- 3. Insertion des Réservations (Dates passées, actuelles et futures)
INSERT INTO reservations (idClient, idChambre, dateDebut, dateFin, nbPersonnes, statut) VALUES
-- Séjours terminés
(1, 15, '2023-07-01', '2023-07-15', 4, 'terminee'),
(2, 3,  '2023-08-10', '2023-08-12', 2, 'terminee'),
(3, 10, '2023-10-05', '2023-10-20', 1, 'terminee'),

-- Séjours en cours (qui englobent la date d''aujourd''hui)
(4, 7,  CURRENT_DATE - INTERVAL 2 DAY, CURRENT_DATE + INTERVAL 3 DAY, 2, 'confirmee'),
(5, 14, CURRENT_DATE - INTERVAL 1 DAY, CURRENT_DATE + INTERVAL 5 DAY, 2, 'confirmee'),

-- Séjours à venir (confirmés)
(6, 12, CURRENT_DATE + INTERVAL 10 DAY, CURRENT_DATE + INTERVAL 15 DAY, 2, 'confirmee'),
(7, 5,  CURRENT_DATE + INTERVAL 15 DAY, CURRENT_DATE + INTERVAL 18 DAY, 3, 'confirmee'),
(8, 2,  CURRENT_DATE + INTERVAL 25 DAY, CURRENT_DATE + INTERVAL 30 DAY, 1, 'confirmee'),

-- Séjours en attente
(9, 8,  CURRENT_DATE + INTERVAL 40 DAY, CURRENT_DATE + INTERVAL 45 DAY, 2, 'en_attente'),
(10, 13, CURRENT_DATE + INTERVAL 60 DAY, CURRENT_DATE + INTERVAL 62 DAY, 5, 'en_attente'),

-- Séjours annulés
(1, 1,  '2024-01-10', '2024-01-15', 1, 'annulee'),
(4, 6,  '2024-02-05', '2024-02-08', 1, 'annulee');
