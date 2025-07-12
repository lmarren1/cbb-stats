const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://youruser:yourpass@localhost:5432/yourdb'
});

async function getGameData(team, game) {
    const result = await pool.query(
        'SELECT player_name, points FROM box_scores WHERE team = $1 AND game_id = $2',
        [team, game]
    );

    return {
        players: result.rows.map(row => row.player_name),
        points: result.rows.map(row => row.points)
    };
}

module.exports = { getGameData };
