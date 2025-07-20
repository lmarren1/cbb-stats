const fs = require('fs');
const path = require('path');
const { serveFile } = require('./serveFile');
const { getContentType } = require('../utils/getContentType');

const handleStatic = (req, res) => {
    const ext = path.extname(req.url);
    const contentType = getContentType(ext);

    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, '..', '..', 'client', 'index.html')
            : path.join(__dirname, '..', '..', 'client', req.url);

    if (!ext && req.url.slice(-1) !== '/') filePath += '.html';

    if (fs.existsSync(filePath)) {
        console.log(`Serving static file: ${filePath}`);
        serveFile(filePath, contentType, res);
        return true; // handled
    } else {
        console.log(`${filePath} is not a registered static file`)
        return false; // not found
    }
};

module.exports = { handleStatic };
