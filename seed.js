import mysql from "mysql2/promise";
import { CONFIG } from "./config.js";

async function seed() {
  const connection = await mysql.createConnection(CONFIG.DB);

  const events = [
    ["Kyiv Marathon", "Spring run", "2026-05-10 09:00:00", "RunUkraine"],
    ["Lviv Half Marathon", "City run", "2026-06-15 10:00:00", "Lviv Sports"],
    ["Odesa Night Run", "Summer event", "2026-07-20 21:00:00", "Sea Side"],
    ["IT Relay", "Corporate race", "2026-08-05 11:00:00", "Tech Community"],
  ];

  await connection.query(
    "INSERT INTO events (title, description, date, organizer) VALUES ?",
    [events]
  );

  const [rows] = await connection.query("SELECT id FROM events");
  const eventId = rows[0].id;

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

  console.log("Сід дані заповнено");
  await connection.end();
}

seed();
