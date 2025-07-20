const fsPromises = require('fs').promises;

const serveFile = async (filePath, contentType, response) => {
    try {
        const encoding = contentType.includes('text') || contentType === 'application/json' ? 'utf8' : null;
        const data = await fsPromises.readFile(filePath, encoding);
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(data)
    } catch (err) {
        console.error(err);
        response.writeHead(500);
        response.end('Server error');
    }
}

module.exports = { serveFile };
