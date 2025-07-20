const getContentType = (ext) => {
    switch (ext) {
        case '.css': return 'text/css';
        case '.js': return 'text/javascript';
        case '.json': return 'application/json';
        case '.png': return 'image/png';
        case '.jpg': return 'image/jpeg';
        default: return 'text/html';
    }
};

module.exports = { getContentType };
