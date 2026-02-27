const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'phd_database_v2.sqlite');
const db = new sqlite3.Database(dbPath);

console.log("--- SQLITE STUDENTS TABLE ---");
db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log(`Found ${rows.length} records.`);
        rows.forEach(row => {
            const data = JSON.parse(row.data);
            console.log(`ID: ${row.id} | Email: ${row.email} | Name: ${data.name} | Topic: ${data.topic}`);
        });
    }
    db.close();
});
