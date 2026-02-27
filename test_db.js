require('dotenv').config();
const mongoose = require('mongoose');

console.log("Attempting to connect to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB Atlas!');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: Could not connect to MongoDB.');
        console.error('Error:', err.message);
        process.exit(1);
    });
