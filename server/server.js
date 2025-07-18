// Module import
const http = require('http');
const path = require('path');
const fs = require('fs');
const { log } = require('./middleware/logger');
const { checkPythonHealth, sendToPython } = require('./controllers/pythonController');
const { serveFile } = require('./middleware/serveFile');

const PORT = process.env.PORT || 3000;

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
        log('Success! File found and being served to web browser.')
        serveFile(filePath, contentType, res);
    } else {
        log('User Error. File not Found, 404 page being served.')
        serveFile(path.join(__dirname, '..', 'client', 'error-pages', '404.html'), 'text/html', res);
    }
});

server.listen(PORT, () => log(`Server running on port ${PORT}`));


