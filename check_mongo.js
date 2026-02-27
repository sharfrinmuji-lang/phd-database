require('dotenv').config();
const mongoose = require('mongoose');

async function checkData() {
    try {
        console.log("Connecting to:", process.env.MONGO_URI.split('@')[1]); // Hide password
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected Successfully!");

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections in database:", collections.map(c => c.name));

        if (collections.some(c => c.name === 'students')) {
            const count = await mongoose.model('Student', new mongoose.Schema({}, { strict: false }), 'students').countDocuments();
            console.log(`📊 Found ${count} students in MongoDB.`);
        } else {
            console.log("❌ 'students' collection not found.");
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Connection failed!");
        console.error("Error Detail:", err.message);
        process.exit(1);
    }
}

checkData();
