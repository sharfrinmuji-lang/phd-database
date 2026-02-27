const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'phd_database_v2.sqlite');
const db = new sqlite3.Database(dbPath);

console.log("--- SQLITE USERS TABLE ---");
db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log(`Found ${rows.length} users.`);
        rows.forEach(row => {
            const data = JSON.parse(row.data);
            console.log(`Username: ${row.username} | Role: ${data.role} | Email: ${data.email}`);
        });
    }
    db.close();
});
