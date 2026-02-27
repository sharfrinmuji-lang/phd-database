const db = require('./database');

console.log("\n=========================================");
console.log("       PhD STUDENTS DATABASE TABLE       ");
console.log("=========================================\n");

db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
        console.error("Error reading database:", err);
        return;
    }

    if (rows.length === 0) {
        console.log("Database is empty. No students found.");
    } else {
        // Parse the JSON data to present it nicely
        const formattedData = rows.map((row, index) => {
            const data = JSON.parse(row.data);
            return `[${index + 1}] Name: ${data.name} | RegNo: ${data.regNo} | Email: ${data.email} | Dept: ${data.department} | Status: ${data.status}`;
        });

        console.log(formattedData.join("\n"));
        console.log("\nTotal Records:", rows.length);
        console.log("=========================================\n");
    }
});
