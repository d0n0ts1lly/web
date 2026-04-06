import express from "express";
import mysql from "mysql2/promise";
import session from "express-session";
import bcrypt from "bcrypt";
import cors from "cors";
import { CONFIG } from "./config.js";

const app = express();
const pool = mysql.createPool(CONFIG.DB);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: "marathon_secret_key_2026",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ error: "Доступ заборонено. Будь ласка, увійдіть." });
};

app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, 'Organizer')",
      [username, hashedPassword]
    );
    res.status(201).json({ message: "Користувач успішно зареєстрований" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ error: "Користувач вже існує або помилка даних" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const user = rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;

      res.json({
        message: "Вхід успішний",
        user: { id: user.id, username: user.username, role: user.role },
      });
    } else {
      res.status(401).json({ error: "Невірний логін або пароль" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/auth/me", (req, res) => {
  if (req.session.userId) {
    res.json({
      loggedIn: true,
      user: {
        id: req.session.userId,
        username: req.session.username,
        role: req.session.role,
      },
    });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.json({ message: "Вихід успішний" });
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

app.get("/api/participants/:eventId", isAuthenticated, async (req, res) => {
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
  console.log(`Сервер запущено на http://localhost:${CONFIG.PORT}`);
});
