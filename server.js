require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database'); // Starts SQLite connection immediately

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Serve Static Files (Dashboard, Login, etc.)
const path = require('path');
app.use(express.static(__dirname));

// Base Route - Redirect to Login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`👉 Open http://localhost:${PORT} in your browser`);
});
