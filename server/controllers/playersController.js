const pool = require('../config/db');

async function getAllPlayers(req, res) {
    try {
        const result = await pool.query('SELECT * FROM players');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows));
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end('Internal Server Error');
    }
}

module.exports = { getAllPlayers };
