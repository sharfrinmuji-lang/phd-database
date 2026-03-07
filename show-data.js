const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'phd_database_v2.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('--- USERS TABLE ---');
db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        rows.forEach(row => {
            const data = JSON.parse(row.data);
            console.log(`User: ${row.username} | Role: ${data.role} | Email: ${data.email}`);
        });
    }

    console.log('\n--- SCHOLARS TABLE ---');
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            rows.forEach(row => {
                const data = JSON.parse(row.data);
                console.log(`Scholar: ${data.name} | Reg: ${data.regNo} | Status: ${data.status}`);
            });
        }
        db.close();
    });
});
