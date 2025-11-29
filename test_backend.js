import http from 'http';

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/trace/MKRM-SonaMasoori23-2024-Chattisgarh8',
    method: 'GET',
};

console.log("Testing Backend Connection...");

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode} `);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log("SUCCESS: Backend is reachable and returned data.");
            try {
                const json = JSON.parse(data);
                console.log("Sample Data:", JSON.stringify(json, null, 2));
            } catch (e) {
                console.log("Response is not JSON:", data);
            }
        } else {
            console.log("FAILURE: Backend returned error status.");
            console.log("Body:", data);
        }
    });
});

req.on('error', (e) => {
    console.error(`PROBLEM: Could not connect to backend.Is it running on port 5000 ? `);
    console.error(`Error details: ${e.message} `);
});

req.end();
