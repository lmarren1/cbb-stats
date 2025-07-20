const pool = require("../config/db");
const { parse } = require('url');

const getGamePossessions = async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const game_id = parsedUrl.query.game_id

    const query = `
        SELECT
            game_id,
            possession_number,
            offense_points_scored,
            offense_score_margin,
            duration
        FROM possessions
        WHERE game_id = $1
        ORDER BY possession_number ASC
    `;

    // pool.query expects values associated with a query to be an ARRAY.
    value = [game_id]

    try {
        const result = await pool.query(query, value);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
};

module.exports = { getGamePossessions };
