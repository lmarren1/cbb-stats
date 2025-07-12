const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { getGameData } = require('./db');

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (pathname === '/') {
        return serveFile(res, '../client/index.html', 'text/html');
    }

    if (pathname === '/style.css') {
        return serveFile(res, '../client/style.css', 'text/css');
    }

    if (pathname === '/main.js') {
        return serveFile(res, '../client/main.js', 'text/javascript');
    }

    if (pathname === '/api') {
        try {
            const data = await getGameData(query.team, query.game);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Database error' }));
        }
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

function serveFile(res, filePath, contentType) {
    const fullPath = path.join(__dirname, filePath);
    fs.readFile(fullPath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Server Error');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
}

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
