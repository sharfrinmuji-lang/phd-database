const db = require('./database');
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/students.json'));
db.serialize(() => {
    db.run('DELETE FROM students', [], (err) => {
        if (err) console.error(err);
        let count = 0;
        data.forEach(student => {
            db.run('INSERT INTO students (id, email, data) VALUES (?, ?, ?)',
                [student._id, student.email, JSON.stringify(student)], (err) => {
                    if (err) console.error(err);
                    count++;
                    if (count === data.length) {
                        console.log('Fixed DB successfully');
                        process.exit(0);
                    }
                });
        });
    });
});
