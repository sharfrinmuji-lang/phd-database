const students = [
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

async function inject() {
    console.log("Starting data injection through the API...");
    for (const s of students) {
        try {
            const res = await fetch('http://localhost:5002/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(s)
            });
            if (res.ok) {
                console.log('✅ Added Student: ' + s.name);
                const authRes = await fetch('http://localhost:5002/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: s.email.split('@')[0], // e.g. aaditya
                        password: 'password123',
                        email: s.email,
                        role: 'Student'
                    })
                });
                if (authRes.ok) {
                    console.log('   ↳ 🔑 Created Login User: ' + s.email.split('@')[0]);
                } else {
                    console.log('   ↳ ⚠️ Login user already exists: ' + s.email.split('@')[0]);
                }
            } else {
                console.log('❌ Failed to add ' + s.name);
            }
        } catch (e) {
            console.log('Error', e.message);
        }
    }
    console.log("\nInjection completed successfully!");
}
inject();
