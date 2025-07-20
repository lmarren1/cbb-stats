const { searchTeams } = require('./controllers/teamsController');
const { getTeamGames } = require('./controllers/gamesController');
const { getGamePossessions } = require('./controllers/possessionsController');

const routes = {
    'GET /api/v1/teams/search': searchTeams,
    'GET /api/v1/games': getTeamGames,
    'GET /api/v1/possessions': getGamePossessions,
};

module.exports = routes;
