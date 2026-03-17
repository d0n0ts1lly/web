import express from "express";
import mysql from "mysql2/promise";
import { CONFIG } from "./config.js";

const app = express();
const pool = mysql.createPool(CONFIG.DB);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Marathon API is running",
    endpoints: {
      events: "/api/events",
      infiniteScroll: "/api/events/cursor",
      participants: "/api/participants/:eventId",
    },
  });
});

app.get("/api/events", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const allowedSort = ["date", "title"];
    const sortField = allowedSort.includes(req.query.sort)
      ? req.query.sort
      : "date";
    const order = req.query.order === "desc" ? "DESC" : "ASC";

    const [rows] = await pool.query(
      `SELECT * FROM events ORDER BY ${sortField} ${order} LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) as total FROM events"
    );

    res.json({ total, page, limit, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/events/cursor", async (req, res) => {
  try {
    const lastId = parseInt(req.query.lastId) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const [rows] = await pool.query(
      "SELECT * FROM events WHERE id > ? ORDER BY id ASC LIMIT ?",
      [lastId, limit]
    );

    res.json({
      data: rows,
      nextCursor: rows.length > 0 ? rows[rows.length - 1].id : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/participants/:eventId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM participants WHERE eventId = ?",
      [req.params.eventId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(CONFIG.PORT, () => {
  console.log(`Сервер запщен на http://localhost:${CONFIG.PORT}`);
});
