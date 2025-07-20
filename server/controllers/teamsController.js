const pool = require("../config/db");
const { parse } = require('url');

const searchTeams = async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const team = parsedUrl.query.team

    const query = `
        SELECT * FROM teams
            WHERE display_name ILIKE $1
            LIMIT 10
    `

    // pool.query expects values associated with a query to be an ARRAY.
    value = [`%${team}%`]

    try {
        const result = await pool.query(query, value);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
};

module.exports = { searchTeams };
