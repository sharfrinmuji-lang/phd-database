const express = require('express');
const router = express.Router();
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, password, role, email } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ username, password, role, email });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check Admin Hardcoded (Migration Phase)
        if (username === 'lithikka' && password === 'phd2025') {
            return res.json({
                username: 'lithikka',
                role: 'Admin',
                token: 'admin-dummy-token'
            });
        }

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Password Check (Direct comparison for now as per previous logic, but should use bcrypt later)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            username: user.username,
            role: user.role,
            token: 'dummy-token-' + user._id
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
