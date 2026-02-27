const express = require('express');
const router = express.Router();
const db = require('../database');
const crypto = require('crypto');

// REGISTER
router.post('/register', (req, res) => {
    const { username, password, role, email } = req.body;

    const id = crypto.randomUUID();
    const data = JSON.stringify({
        _id: id,
        username,
        password,
        role: role || 'Student',
        email
    });

    const query = `INSERT INTO users (id, username, data) VALUES (?, ?, ?)`;

    db.run(query, [id, username, data], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ message: 'User already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
});

// LOGIN
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check Admin Hardcoded (Migration Phase)
    if (username === 'lithikka' && password === 'phd2025') {
        return res.json({
            username: 'System Administrator',
            role: 'Admin',
            email: 'admin@psgrkcw.ac.in',
            token: 'admin-dummy-token'
        });
    }

    db.get(`SELECT data FROM users WHERE username = ?`, [username], (err, row) => {
        if (err || !row) return res.status(400).json({ message: 'User not found' });

        const user = JSON.parse(row.data);

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            username: user.username,
            role: user.role,
            email: user.email,
            token: 'dummy-token-' + user._id
        });
    });
});

module.exports = router;
