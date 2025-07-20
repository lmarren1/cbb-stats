const pool = require("../config/db");
const { parse } = require('url');

const getTeamGames = async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const team_id = parsedUrl.query.team_id

    const query = `
        SELECT
            games.game_id,
            games.game_date,
            games.home_team_id,
            games.away_team_id,
            home_teams.team AS home_team_name,
            away_teams.team AS away_team_name,
            home_teams.abbreviation AS home_team_abbr,
            away_teams.abbreviation AS away_team_abbr
        FROM games
        JOIN teams AS home_teams ON games.home_team_id = home_teams.team_id
        JOIN teams AS away_teams ON games.away_team_id = away_teams.team_id
        WHERE games.home_team_id = $1 OR games.away_team_id = $1
        ORDER BY games.game_date DESC;
    `;

    // pool.query expects values associated with a query to be an ARRAY.
    value = [team_id]

    try {
        const result = await pool.query(query, value);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error: gamesController.js' }));
    }
};

module.exports = { getTeamGames };
