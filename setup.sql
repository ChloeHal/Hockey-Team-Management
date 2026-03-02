-- Pantheres - Setup Database
-- Executer ce script dans phpMyAdmin sur Hostinger

CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  number VARCHAR(10) DEFAULT '',
  position_1 VARCHAR(30) DEFAULT NULL,
  position_2 VARCHAR(30) DEFAULT NULL,
  position_3 VARCHAR(30) DEFAULT NULL,
  level INT DEFAULT 2
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS trainings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS training_presences (
  training_id INT NOT NULL,
  player_id INT NOT NULL,
  PRIMARY KEY (training_id, player_id),
  FOREIGN KEY (training_id) REFERENCES trainings(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS important_msg (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) DEFAULT '',
  text TEXT,
  icon VARCHAR(20) DEFAULT 'warning'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS referees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS settings (
  `key` VARCHAR(50) PRIMARY KEY,
  value TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Mot de passe coach par defaut : 111
INSERT IGNORE INTO settings (`key`, value) VALUES ('coach_password', '111');

-- Migration v2 (depuis v1 avec position/position_secondary) :
-- ALTER TABLE players DROP COLUMN position;
-- ALTER TABLE players DROP COLUMN position_secondary;
-- ALTER TABLE players ADD COLUMN position_1 VARCHAR(30) DEFAULT NULL AFTER number;
-- ALTER TABLE players ADD COLUMN position_2 VARCHAR(30) DEFAULT NULL AFTER position_1;
-- ALTER TABLE players ADD COLUMN position_3 VARCHAR(30) DEFAULT NULL AFTER position_2;

-- Migration v2 (depuis base sans colonnes position) :
-- ALTER TABLE players ADD COLUMN position_1 VARCHAR(30) DEFAULT NULL AFTER number;
-- ALTER TABLE players ADD COLUMN position_2 VARCHAR(30) DEFAULT NULL AFTER position_1;
-- ALTER TABLE players ADD COLUMN position_3 VARCHAR(30) DEFAULT NULL AFTER position_2;
-- ALTER TABLE players ADD COLUMN level INT DEFAULT 2 AFTER position_3;
