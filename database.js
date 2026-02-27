const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'phd_database_v2.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening SQLite database:', err.message);
    } else {
        console.log('✅ Connected to SQLite Database (Network Independent).');

        db.serialize(() => {
            // We use JSON storage inside SQLite to perfectly mimic MongoDB's NoSQL behavior
            db.run(`CREATE TABLE IF NOT EXISTS students (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE,
                data JSON
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE,
                data JSON
            )`);
        });
    }
});

module.exports = db;
