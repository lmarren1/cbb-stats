const http = require('http');

function checkPythonHealth() {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/health',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
                resolve({ status: 200, message: 'Python service is healthy' });
            } else {
                resolve({ status: 500, message: 'Python service responded but not OK' });
            }
        });

        req.on('error', () => {
            resolve({ status: 500, message: 'Python service is unreachable' });
        });

        req.end();
    });
}

function sendToPython(data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/analyze',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';

            res.on('data', chunk => { body += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, result: parsed });
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.write(data);
        req.end();
    });
}

module.exports = { checkPythonHealth, sendToPython };
