const http = require('http');
const { parse } = require('url');
const { handleStatic } = require('./middleware/staticHandler');
const routes = require('./router');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    console.log(`${req.method} Request for URL: ${req.url}`);

    // Handle static files
    if (handleStatic(req, res)) return;

    // Handle API routes
    const parsedUrl = parse(req.url, true);
    const key = `${req.method} ${parsedUrl.pathname}`;
    const handler = routes[key];

    if (handler) {
        handler(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Route not found');
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
