import http from "node:http";
import { readFile } from "node:fs/promises";
import { CONFIG } from "./config.js";

const server = http.createServer(async (req, res) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} запит на: ${req.url}`);

  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.url === "/api/events" && req.method === "GET") {
    try {
      const data = await readFile(CONFIG.DATA_PATH, "utf-8");

      res.statusCode = 200;
      res.end(data);
    } catch (err) {
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          error: "Внутрішня помилка сервера: не вдалося прочитати дані",
        })
      );
      console.error("Помилка зчитування файлу:", err.message);
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Маршрут не знайдено (404)" }));
  }
});

server.listen(CONFIG.PORT, () => {
  console.log(`Сервер запущено на http://localhost:${CONFIG.PORT}/api/events`);
  console.log(`Nodemon стежить за змінами...`);
});
