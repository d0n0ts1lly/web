import mysql from "mysql2/promise";
import { CONFIG } from "./config.js";

async function init() {
  const connection = await mysql.createConnection({
    host: CONFIG.DB.host,
    user: CONFIG.DB.user,
    password: CONFIG.DB.password,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${CONFIG.DB.database}`);
  await connection.changeUser({ database: CONFIG.DB.database });

  await connection.query(`
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      date DATETIME NOT NULL,
      organizer VARCHAR(100),
      INDEX idx_date (date),
      INDEX idx_title (title)
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS participants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      eventId INT,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      birthDate DATE,
      source VARCHAR(50),
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
      INDEX idx_event (eventId)
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('Admin', 'Organizer', 'User') DEFAULT 'User'
    )
  `);

  console.log("БД створена");
  await connection.end();
}

init();
