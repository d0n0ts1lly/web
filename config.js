export const CONFIG = {
  PORT: process.env.PORT || 3000,
  DATA_PATH: "./src/data/events.json",
  DB: {
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "23032023",
    database: process.env.MYSQLDATABASE || "marathon_db",
    port: process.env.MYSQLPORT || 3306,
  },
};
