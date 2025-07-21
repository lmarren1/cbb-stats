const pool = require("../config/db");
const { parse } = require("url");

const getActionTypes = async (req, res) => {
    const { query } = parse(req.url, true);
    const { game_id, team_id, type_text } = query;

    let sql = `SELECT * FROM actions WHERE 1=1`;
    const values = [];
    let i = 1;

    if (game_id) {
        sql += ` AND game_id = $${i++}`;
        values.push(game_id);
    }

    if (team_id) {
        sql += ` AND team_id = $${i++}`;
        values.push(team_id);
    }

    if (type_text) {
        if (Array.isArray(type_text)) {
            const placeholders = type_text.map(() => `$${i++}`).join(', ');
            sql += ` AND type_text IN (${placeholders})`;
            values.push(...type_text);
        } else {
            sql += ` AND type_text = $${i++}`;
            values.push(type_text);
        }
    }

    sql += ` ORDER BY type_text ASC`;

    try {
        const result = await pool.query(sql, values);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows));
    } catch (err) {
        console.error("Error in getActionTypes:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
};

module.exports = { getActionTypes };
