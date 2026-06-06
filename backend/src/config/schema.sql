-- ============================================================
-- Store Rating Platform — MySQL Schema + Seed
-- ============================================================

CREATE DATABASE IF NOT EXISTS store_rating_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE store_rating_db;

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id         INT          NOT NULL AUTO_INCREMENT,
  name       VARCHAR(60)  NOT NULL,
  email      VARCHAR(100) NOT NULL,
  password   VARCHAR(255) NOT NULL,
  address    VARCHAR(400)         ,
  role       ENUM('ADMIN','USER','STORE_OWNER') NOT NULL DEFAULT 'USER',
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- STORES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stores (
  id         INT          NOT NULL AUTO_INCREMENT,
  name       VARCHAR(60)  NOT NULL,
  email      VARCHAR(100) NOT NULL,
  address    VARCHAR(400) NOT NULL,
  owner_id   INT          NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_stores_email   (email),
  UNIQUE KEY uq_stores_owner   (owner_id),
  CONSTRAINT fk_stores_owner FOREIGN KEY (owner_id)
    REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- RATINGS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ratings (
  id         INT      NOT NULL AUTO_INCREMENT,
  rating     TINYINT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  user_id    INT      NOT NULL,
  store_id   INT      NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_rating_user_store (user_id, store_id),
  CONSTRAINT fk_ratings_user  FOREIGN KEY (user_id)  REFERENCES users  (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ratings_store FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- SEED — passwords are bcrypt(10) of the shown plaintext
-- Admin@1234  → hash below
-- ------------------------------------------------------------
INSERT IGNORE INTO users (name, email, password, address, role) VALUES
  ('Admin User',      'admin@srp.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '123 Admin Street, City', 'ADMIN'),
  ('Store Owner One', 'owner1@srp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '456 Owner Ave, City',   'STORE_OWNER'),
  ('Normal User',     'user@srp.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '789 User Blvd, City',   'USER');

INSERT IGNORE INTO stores (name, email, address, owner_id) VALUES
  ('Best Coffee', 'bestcoffee@srp.com', '10 Commerce Rd, City', 2);

INSERT IGNORE INTO ratings (rating, user_id, store_id) VALUES
  (4, 3, 1);
