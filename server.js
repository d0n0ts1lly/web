import express from "express";
import { readFile } from "node:fs/promises";
import { CONFIG } from "./config.js";

const app = express();
const PORT = CONFIG.PORT || 3000;

app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} запит на: ${req.originalUrl}`);
  next();
});

app.use(express.json());

app.get("/api/events", async (req, res) => {
  try {
    const rawData = await readFile(CONFIG.DATA_PATH, "utf-8");
    let events = JSON.parse(rawData);

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sort;
    const order = req.query.order === "desc" ? -1 : 1;

    if (page < 1) {
      return res
        .status(400)
        .json({ error: "Параметр 'page' не може бути менше 1" });
    }

    if (sortField === "date" || sortField === "title") {
      events.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * order;
        if (a[sortField] > b[sortField]) return 1 * order;
        return 0;
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedEvents = events.slice(startIndex, endIndex);

    res.json({
      total: events.length,
      page,
      limit,
      data: paginatedEvents,
    });
  } catch (err) {
    console.error("Помилка:", err.message);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не знайдено (404)" });
});

app.listen(PORT, () => {
  console.log(`Сервер Express запущено: http://localhost:${PORT}/api/events`);
});
