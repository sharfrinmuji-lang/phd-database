const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'phd_database_v2.sqlite');
const db = new sqlite3.Database(dbPath);

console.log("Dumping students table to debug_students.json...");
db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        const results = rows.map(r => ({ ...r, data: JSON.parse(r.data) }));
        fs.writeFileSync('debug_students.json', JSON.stringify(results, null, 2));
        console.log(`Done. Saved ${results.length} records.`);
    }
    db.close();
});
