function parseJSONBody(req) {
    return new Promise((resolve, reject) => {
        const allowedMethods = ['POST', 'PUT', 'PATCH'];
        const contentType = req.headers['content-type'] || '';

        if (!allowedMethods.includes(req.method)) {
            return resolve(null);
        }

        if (!contentType.includes('application/json')) {
            return resolve(null);
        }

        let body = '';
        const MAX_SIZE = 1e6; // 1MB

        req.on('data', chunk => {
            body += chunk;
            if (body.length > MAX_SIZE) {
                req.connection.destroy(); // kill connection
                return reject(new Error('Payload too large'));
            }
        });

        req.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                resolve(parsed);
            } catch (err) {
                reject(new Error('Invalid JSON'));
            }
        });

        req.on('error', err => {
            reject(err);
        });
    });
}

module.exports = parseJSONBody;
