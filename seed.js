import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { CONFIG } from "./config.js";

async function seed() {
  const connection = await mysql.createConnection(CONFIG.DB);

  const hashedPassword = await bcrypt.hash("admin123", 10);
  const [userResult] = await connection.query(
    "INSERT IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
    ["admin", hashedPassword, "Organizer"]
  );

  let creatorId;
  if (userResult.insertId) {
    creatorId = userResult.insertId;
  } else {
    const [rows] = await connection.query(
      "SELECT id FROM users WHERE username = 'admin'"
    );
    creatorId = rows[0].id;
  }

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
    [eventId, "Ivan Ivanov", "ivan@test.com", "1990-01-01", "Social Media"],
    [eventId, "Petro Petrov", "petro@test.com", "1992-05-12", "Friends"],
    [
      eventId,
      "Olena Sydorenko",
      "olena@test.com",
      "1995-10-10",
      "Found Myself",
    ],
  ];

  await connection.query(
    "INSERT INTO participants (eventId, fullName, email, birthDate, source) VALUES ?",
    [participants]
  );

  console.log(
    "Дані успішно додано. Створено користувача 'admin' з паролем 'admin123'"
  );
  await connection.end();
}

seed().catch(console.error);
