const http = require('http');

const data = JSON.stringify({
    name: "Backend Verify Student",
    email: "verify_" + Date.now() + "@test.com",
    department: "Computer Science",
    supervisor: "Dr. Test",
    status: "Registered"
});

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/students',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error('ERROR:', error);
});

req.write(data);
req.end();
