import express from "express";
import mysql from "mysql2/promise";
import session from "express-session";
import bcrypt from "bcrypt";
import cors from "cors";
import {
  ApolloServer,
  gql,
  AuthenticationError,
  UserInputError,
} from "apollo-server-express";
import { CONFIG } from "./config.js";

const app = express();
const pool = mysql.createPool(CONFIG.DB);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://studio.apollographql.com"],
    credentials: true,
  })
);

app.use("/api", express.json());

app.use(
  session({
    secret: "marathon_secret_key_2026",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  })
);

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  res.status(401).json({ error: "Доступ заборонено." });
};

app.get("/api/analytics/registrations", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DATE(registration_date) as date, COUNT(*) as count 
      FROM participants 
      GROUP BY DATE(registration_date)
      ORDER BY date ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, 'Organizer')",
      [username, hashedPassword]
    );
    res.status(201).json({ message: "Успіх" });
  } catch (err) {
    res.status(400).json({ error: err.message });
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
        user: { id: user.id, username: user.username, role: user.role },
      });
    } else {
      res.status(401).json({ error: "Невірні дані" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/events", isAuthenticated, async (req, res) => {
  const { title, description, date, organizer } = req.body;
  const [result] = await pool.query(
    "INSERT INTO events (title, description, date, organizer, creator_id) VALUES (?, ?, ?, ?, ?)",
    [title, description, date, organizer, req.session.userId]
  );
  res.status(201).json({ id: result.insertId });
});

app.get("/api/events", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM events ORDER BY date DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/events/:id", isAuthenticated, async (req, res) => {
  const { title, description, date, organizer } = req.body;
  const [rows] = await pool.query(
    "SELECT creator_id FROM events WHERE id = ?",
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Не знайдено" });
  if (rows[0].creator_id !== req.session.userId)
    return res.status(403).json({ error: "Немає прав" });
  await pool.query(
    "UPDATE events SET title=?, description=?, date=?, organizer=? WHERE id=?",
    [title, description, date, organizer, req.params.id]
  );
  res.json({ message: "Оновлено" });
});

app.delete("/api/events/:id", isAuthenticated, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT creator_id FROM events WHERE id = ?",
    [req.params.id]
  );
  if (rows.length > 0 && rows[0].creator_id === req.session.userId) {
    await pool.query("DELETE FROM events WHERE id = ?", [req.params.id]);
    return res.json({ message: "Видалено" });
  }
  res.status(403).json({ error: "Заборонено" });
});

app.get("/api/participants", async (req, res) => {
  const { eventId } = req.query;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM participants WHERE eventId = ?",
      [eventId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/participants", async (req, res) => {
  const { eventId, fullName, email, birthDate, source } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ error: "Email невірний" });
  await pool.query(
    "INSERT INTO participants (eventId, fullName, email, birthDate, source) VALUES (?, ?, ?, ?, ?)",
    [eventId, fullName, email, birthDate, source]
  );
  res.status(201).json({ message: "Додано" });
});

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    role: String!
  }
  type Participant {
    id: ID!
    fullName: String!
    email: String!
  }
  type Event {
    id: ID!
    title: String!
    description: String
    date: String!
    organizer: String
    creator: User
    participants: [Participant]
  }
  input AddEventInput {
    title: String!
    description: String
    date: String!
    organizer: String
  }
  type Query {
    getEvents(limit: Int, skip: Int, search: String): [Event]
  }
  type Mutation {
    addEvent(input: AddEventInput!): Event
  }
`;

const resolvers = {
  Query: {
    getEvents: async (_, { limit = 10, skip = 0, search = "" }) => {
      const [rows] = await pool.query(
        "SELECT * FROM events WHERE title LIKE ? LIMIT ? OFFSET ?",
        [`%${search}%`, limit, skip]
      );
      return rows;
    },
  },
  Event: {
    creator: async (event) => {
      const [rows] = await pool.query(
        "SELECT id, username, role FROM users WHERE id = ?",
        [event.creator_id]
      );
      return rows[0];
    },
    participants: async (event) => {
      const [rows] = await pool.query(
        "SELECT * FROM participants WHERE eventId = ?",
        [event.id]
      );
      return rows;
    },
  },
  Mutation: {
    addEvent: async (_, { input }, { userId }) => {
      if (!userId) throw new AuthenticationError("Необхідна авторизація");
      if (input.title.length < 3)
        throw new UserInputError("Назва події занадто коротка");

      const [result] = await pool.query(
        "INSERT INTO events (title, description, date, organizer, creator_id) VALUES (?, ?, ?, ?, ?)",
        [input.title, input.description, input.date, input.organizer, userId]
      );
      return { id: result.insertId, ...input };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ userId: req.session.userId }),
});

async function start() {
  await server.start();
  server.applyMiddleware({ app, cors: false, path: "/graphql" });
  app.listen(CONFIG.PORT, () => {
    console.log(`Server: http://localhost:${CONFIG.PORT}`);
  });
}

start();
