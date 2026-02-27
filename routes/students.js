const express = require('express');
const router = express.Router();
const db = require('../database');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // For generating IDs

const DATA_FILE = path.join(__dirname, '../data/students.json');

// Helper to read JSON
const readLocalData = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
        return [];
    }
};

// GET ALL STUDENTS (SQLite + local JSON)
router.get('/', (req, res) => {
    const { email } = req.query;
    let query = "SELECT data FROM students";
    let params = [];

    if (email) {
        query += " WHERE email = ?";
        params.push(email);
    }

    db.all(query, params, (err, rows) => {
        let sqliteStudents = [];
        if (!err && rows) {
            sqliteStudents = rows.map(r => JSON.parse(r.data));
            console.log(`🗃️ Fetched ${sqliteStudents.length} from SQLite Database`);
        } else {
            console.error("SQLite Error:", err);
        }

        // 2. Get from Local JSON
        const localStudents = readLocalData();
        let filteredLocal = localStudents;
        if (email) {
            filteredLocal = localStudents.filter(s => s.email === email);
        }

        // 3. Merge (Priority: SQLite > Local)
        const mergedMap = new Map();
        filteredLocal.forEach(s => mergedMap.set(s.email, s));
        sqliteStudents.forEach(s => mergedMap.set(s.email, s));

        const finalResult = Array.from(mergedMap.values());
        console.log(`✅ Total Scholars: ${finalResult.length}`);
        res.json(finalResult);
    });
});

// ADD OR UPDATE STUDENT
router.post('/', (req, res) => {
    const studentData = req.body;
    const email = studentData.email;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    // Ensure it has an _id (for frontend compatibility)
    if (!studentData._id) {
        studentData._id = crypto.randomUUID();
    }

    // Add timestamps
    studentData.updatedAt = new Date().toISOString();
    if (!studentData.createdAt) studentData.createdAt = studentData.updatedAt;

    const dataJson = JSON.stringify(studentData);

    const query = `
        INSERT INTO students (id, email, data)
        VALUES (?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET data = excluded.data
    `;

    db.run(query, [studentData._id, email, dataJson], function (err) {
        if (err) {
            console.error("❌ SQLite Save Error:", err.message);
            return res.status(400).json({ error: err.message });
        }

        console.log("✅ Saved to SQLite Database");

        // Also save to students.json for backup
        try {
            const localData = readLocalData();
            const index = localData.findIndex(s => s.email === email);
            if (index > -1) {
                localData[index] = studentData;
            } else {
                localData.push(studentData);
            }
            fs.writeFileSync(DATA_FILE, JSON.stringify(localData, null, 2));
        } catch (e) {
            console.error("Backup save failed", e);
        }

        res.status(201).json(studentData);
    });
});

// GET SINGLE STUDENT
router.get('/:id', (req, res) => {
    db.get("SELECT data FROM students WHERE id = ?", [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ message: 'Student not found' });
        res.json(JSON.parse(row.data));
    });
});

// UPDATE STUDENT
router.put('/:id', (req, res) => {
    db.get("SELECT data FROM students WHERE id = ?", [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: "Student not found in DB" });

        const existingData = JSON.parse(row.data);
        const updatedStudent = { ...existingData, ...req.body };
        updatedStudent.updatedAt = new Date().toISOString();

        const dataJson = JSON.stringify(updatedStudent);

        db.run("UPDATE students SET data = ?, email = ? WHERE id = ?",
            [dataJson, updatedStudent.email, req.params.id], function (updateErr) {
                if (updateErr) return res.status(400).json({ error: updateErr.message });
                res.json(updatedStudent);
            });
    });
});

// DELETE STUDENT
router.delete('/:id', (req, res) => {
    db.run("DELETE FROM students WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Student deleted' });
    });
});

module.exports = router;
