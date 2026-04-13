import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { CONFIG } from "./config.js";

async function seed() {
  const connection = await mysql.createConnection(CONFIG.DB);

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await connection.query(
    "INSERT IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
    ["admin", hashedPassword, "Organizer"]
  );

  const [userRows] = await connection.query(
    "SELECT id FROM users WHERE username = 'admin'"
  );
  const creatorId = userRows[0].id;

  await connection.query("SET FOREIGN_KEY_CHECKS = 0");
  await connection.query("TRUNCATE TABLE participants");
  await connection.query("TRUNCATE TABLE events");
  await connection.query("SET FOREIGN_KEY_CHECKS = 1");

  const events = [
    [
      "Kyiv Marathon",
      "Spring run",
      "2026-05-10 09:00:00",
      "RunUkraine",
      creatorId,
    ],
    [
      "Lviv Half Marathon",
      "City run",
      "2026-06-15 10:00:00",
      "Lviv Sports",
      creatorId,
    ],
    [
      "Odesa Night Run",
      "Summer event",
      "2026-07-20 21:00:00",
      "Sea Side",
      creatorId,
    ],
    [
      "IT Relay",
      "Corporate race",
      "2026-08-05 11:00:00",
      "Tech Community",
      creatorId,
    ],
  ];

  await connection.query(
    "INSERT INTO events (title, description, date, organizer, creator_id) VALUES ?",
    [events]
  );

  const [eventRows] = await connection.query("SELECT id FROM events LIMIT 1");
  const eventId = eventRows[0].id;

  const participants = [
    [
      eventId,
      "Ivan Ivanov",
      "ivan@test.com",
      "1990-01-01",
      "Social Media",
      "2026-04-01 10:00:00",
    ],
    [
      eventId,
      "Petro Petrov",
      "petro@test.com",
      "1992-05-12",
      "Friends",
      "2026-04-02 11:30:00",
    ],
    [
      eventId,
      "Olena Sydorenko",
      "olena@test.com",
      "1995-10-10",
      "Found Myself",
      "2026-04-02 14:20:00",
    ],
    [
      eventId,
      "Andriy Shevchenko",
      "andriy@test.com",
      "1988-03-20",
      "Ads",
      "2026-04-03 09:15:00",
    ],
    [
      eventId,
      "Maria Kononenko",
      "maria@test.com",
      "1999-12-05",
      "Instagram",
      "2026-04-05 18:00:00",
    ],
  ];

  await connection.query(
    "INSERT INTO participants (eventId, fullName, email, birthDate, source, registration_date) VALUES ?",
    [participants]
  );

  console.log("--------------------------------------------------");
  console.log("✅ Базу успішно заповнено тестовими даними!");
  console.log("👤 Логін: admin");
  console.log("🔑 Пароль: admin123");
  console.log("--------------------------------------------------");

  await connection.end();
}

seed().catch(console.error);
