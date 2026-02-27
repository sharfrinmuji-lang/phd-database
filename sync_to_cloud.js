require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Student = require('./models/Student');

const DATA_FILE = path.join(__dirname, 'data/students.json');

async function syncToCloud() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected Successfully!");

        if (!fs.existsSync(DATA_FILE)) {
            console.log("❌ No local students.json file found to sync.");
            process.exit(0);
        }

        const localData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        console.log(`📂 Found ${localData.length} students in local file.`);

        let successCount = 0;
        let failCount = 0;

        for (const student of localData) {
            try {
                // Remove local IDs before pushing to Mongo to let Mongo generate its own,
                // OR use email to find and update
                const query = { email: student.email };
                const update = { ...student };
                if (student._id && student._id.startsWith('local_')) {
                    delete update._id;
                }

                await Student.findOneAndUpdate(query, update, { upsert: true });
                successCount++;
                process.stdout.write(`\rProgress: ${successCount}/${localData.length} synced...`);
            } catch (err) {
                console.error(`\nFailed to sync ${student.email}:`, err.message);
                failCount++;
            }
        }

        console.log(`\n\nDONE!`);
        console.log(`✅ Successfully synced: ${successCount}`);
        console.log(`❌ Failed: ${failCount}`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Sync failed!");
        console.error("Error Detail:", err.message);
        process.exit(1);
    }
}

syncToCloud();
