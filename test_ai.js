import http from 'http';

const testPriceEstimator = () => {
    const data = JSON.stringify({
        riceType: 'Sona Masoori Rice',
        quantity: 100,
        region: 'Kakinada',
        season: 'Kharif'
    });

    const options = {
        hostname: 'localhost',
        port: 5005,
        path: '/api/estimate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    console.log("Testing Price Estimator...");
    const req = http.request(options, (res) => {
        console.log(`Estimator Status: ${res.statusCode}`);
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log('Estimator Response:', body);
        });
    });

    req.on('error', error => {
        console.error('Estimator Error:', error);
    });

    req.write(data);
    req.end();
};

const testChatbot = () => {
    const data = JSON.stringify({
        messages: [{ role: 'user', text: 'Hello, what rice do you have?' }],
        systemPrompt: 'You are a helpful assistant.'
    });

    const options = {
        hostname: 'localhost',
        port: 5005,
        path: '/api/chat',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    console.log("Testing Chatbot...");
    const req = http.request(options, (res) => {
        console.log(`Chatbot Status: ${res.statusCode}`);
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log('Chatbot Response:', body);
        });
    });

    req.on('error', error => {
        console.error('Chatbot Error:', error);
    });

    req.write(data);
    req.end();
};

testPriceEstimator();
setTimeout(testChatbot, 2000);
