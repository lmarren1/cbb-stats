// Module import
const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const PORT = process.env.PORT || 3000;

const log = (message) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

const serveFile = async (filePath, contentType, response) => {
    try {
        const encoding = contentType.includes('text') || contentType === 'application/json' ? 'utf8' : null;
        const data = await fsPromises.readFile(filePath, encoding);
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(data)
    } catch (err) {
        log(err);
        response.writeHead(500);
        response.end('Server error');
    }
}

const server = http.createServer((req, res) => {
    log(`${req.method} request for url: ${req.url}`);

    const extension = path.extname(req.url);
    let contentType;

    switch (extension) {
        case '.css': contentType = 'text/css'; break;
        case '.js': contentType = 'text/javascript'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpeg'; break;
        default: contentType = 'text/html';
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, '..', 'client', 'index.html')
            : path.join(__dirname, '..', 'client', req.url);

    // Makes .html extension not required in the browser.
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        serveFile(filePath, contentType, res);
    } else {
        // 404
        serveFile(path.join(__dirname, '..', 'client', 'errors', '404.html'), 'text/html', res);
    }
});

server.listen(PORT, () => log(`Server running on port ${PORT}`));


