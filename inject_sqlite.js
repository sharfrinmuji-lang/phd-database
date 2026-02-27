const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'phd_database_v2.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening db', err);
        return;
    }
});

const dummyData = [
    {
        name: "Aaditya Sharma",
        regNo: "22cs014",
        email: "aaditya@psgrkcw.ac.in",
        phone: "9876543210",
        university: "ANNA UNIVERSITY",
        department: "COMPUTER SCIENCE",
        usertype: "Full-Time",
        topic: "DEEP LEARNING IN MEDICAL IMAGING",
        year: 2,
        status: "Ongoing",
        progressStage: "Topic Identification & Title Confirmation",
        provisionFiles: [],
        degreeFiles: [],
        synopsisFiles: [],
        literaturePapers: []
    },
    {
        name: "Priya Patel",
        regNo: "21it045",
        email: "priya.p@psgrkcw.ac.in",
        phone: "8765432109",
        university: "BHARATHIAR UNIVERSITY",
        department: "INFORMATION TECHNOLOGY",
        usertype: "Part-Time",
        topic: "BLOCKCHAIN FOR SECURE VOTING",
        year: 3,
        status: "Completed",
        progressStage: "Degree Certificate Issued",
        provisionFiles: [{ name: "provision.pdf" }],
        degreeFiles: [{ name: "degree.pdf" }],
        synopsisFiles: [{ name: "synopsis.pdf" }],
        literaturePapers: [
            { title: "Blockchain Security", journal: "IEEE", publisher: "IEEE", year: "2023", doi: "10.123" }
        ]
    },
    {
        name: "Rohan Gupta",
        regNo: "23cs102",
        email: "rohan@psgrkcw.ac.in",
        phone: "7654321098",
        university: "ANNA UNIVERSITY",
        department: "COMPUTER SCIENCE",
        usertype: "Full-Time",
        topic: "NATURAL LANGUAGE PROCESSING",
        year: 1,
        status: "Ongoing",
        progressStage: "Coursework Completion",
        provisionFiles: [],
        degreeFiles: [],
        synopsisFiles: [],
        literaturePapers: []
    },
    {
        name: "Sneha Reddy",
        regNo: "22cv088",
        email: "sneha@psgrkcw.ac.in",
        phone: "6543210987",
        university: "BHARATHIAR UNIVERSITY",
        department: "CIVIL ENGINEERING",
        usertype: "Full-Time",
        topic: "SUSTAINABLE BUILDINGS",
        year: 2,
        status: "Ongoing",
        progressStage: "Literature Review Completion",
        provisionFiles: [],
        degreeFiles: [],
        synopsisFiles: [],
        literaturePapers: [
            { title: "Sustainable Concrete", journal: "Civil Eng", publisher: "Springer", year: "2024", doi: "10.456" }
        ]
    },
    {
        name: "Vikram Singh",
        regNo: "20me055",
        email: "vikram@psgrkcw.ac.in",
        phone: "5432109876",
        university: "ANNA UNIVERSITY",
        department: "MECHANICAL ENGINEERING",
        usertype: "Part-Time",
        topic: "RENEWABLE ENERGY SYSTEMS",
        year: 4,
        status: "Ongoing",
        progressStage: "Synopsis Submission",
        provisionFiles: [],
        degreeFiles: [],
        synopsisFiles: [{ name: "sys.pdf" }],
        literaturePapers: [
            { title: "Solar Efficiency", journal: "Energy", publisher: "Elsevier", year: "2022" }
        ]
    }
];

let added = 0;
console.log("Starting direct SQLite DB injection...");
db.serialize(() => {
    dummyData.forEach(student => {
        // Generate an id and timestamp just like the backend does
        const id = "local_" + Date.now() + Math.floor(Math.random() * 1000);
        student._id = id;
        student.createdAt = new Date().toISOString();
        student.updatedAt = student.createdAt;

        db.run("INSERT INTO students (id, email, data) VALUES (?, ?, ?)",
            [id, student.email, JSON.stringify(student)],
            (err) => {
                if (err) {
                    console.error("❌ Error inserting", student.name, err.message);
                } else {
                    console.log("✅ Inserted Student:", student.name);

                    // Add User to Auth Table too
                    const authData = JSON.stringify({
                        _id: crypto.randomUUID(),
                        username: student.email.split('@')[0],
                        password: "password",
                        role: "Student",
                        email: student.email
                    });
                    db.run("INSERT INTO users (id, username, data) VALUES (?, ?, ?)", [crypto.randomUUID(), student.email.split('@')[0], authData], (e) => {
                        console.log("   ↳ 🔑 Created Login User:", student.email.split('@')[0], "with password 'password'");
                    });
                }
                added++;
                if (added === dummyData.length) {
                    console.log("\nSuccess! Dataset and DB fully synced!");
                    setTimeout(() => process.exit(0), 1000);
                }
            });
    });
});
