-- Run this if your users table was created without the address column.
-- Safe to run multiple times — uses IF NOT EXISTS check via SHOW COLUMNS workaround.

USE store_rating_db;

-- Add address column if it doesn't exist
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS address VARCHAR(400) NULL AFTER password;
