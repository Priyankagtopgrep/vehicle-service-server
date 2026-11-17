const knex = require("knex");
const path = require("path");
const fs = require("fs");

const isVercel = process.env.VERCEL === "1";

const localDBPath = path.join(__dirname, "database.sqlite");

const vercelDBPath = "/tmp/database.sqlite";

const dbPath = isVercel ? vercelDBPath : localDBPath;

if (isVercel) {
    if (!fs.existsSync(dbPath)) {
        fs.copyFileSync(localDBPath, dbPath);
    }
} else {
    if (!fs.existsSync(dbPath)) {
        console.error("Database file not found!");
        process.exit(1);
    }
}

const db = knex({
    client: "sqlite3",
    connection: {
        filename: dbPath
    },
    useNullAsDefault: true
});

module.exports = db;