// ============
// DOM ELEMENTS
// ============

// Team Filter Elements
const teamInput = document.getElementById('team-input');
const teamSuggestions = document.getElementById('team-suggestions');

// Game Filter Elements
const gameInput = document.getElementById('game-input');
const gameSuggestions = document.getElementById('game-suggestions');

// // Period Filter Elements
// const periodInput = document.getElementById('period-input');
// const periodSuggestions = document.getElementById('period-suggestions');

// // Possession Filter Elements
// const minPossession = document.getElementById('min-possession');
// const maxPossession = document.getElementById('max-possession');

// Action Type Filter Elements
const actionTypeInput = document.getElementById('action-type-input');
const actionTypeSuggestions = document.getElementById('action-type-suggestions');

// Player Filter Elements
const playerInput = document.getElementById('player-input');
const playerSuggestions = document.getElementById('player-suggestions');

// // Lineup Filter Elements
// const lineupInput = document.getElementById('lineup-input');
// const lineupSuggestions = document.getElementById('lineup-suggestions');

// ==========================
// ANALYSIS.JS STARTING POINT
// ==========================

// Event Listener for Team Input
teamInput.addEventListener('input', handleTeamInput);

// =================
// UTILITY FUNCTIONS
// =================

function hideElementByClass(className) {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.visibility = 'hidden';
    }
}

function unhideElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.visibility = 'visible';
    }
}

function unhideElementById(id) {
    const element = document.getElementById(id);
    element.style.visibility = 'visible';
}

function clearSuggestions(ul) {
    ul.innerHTML = '';
    ul.style.display = 'none';
}

function attachClickHandler(ul, handler) {
    ul.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            handler(li);
        });
    });
}

// ====================
// TEAM FILTER HANDLERS
// ====================

// (1) --> Handle user input in team search field.
async function handleTeamInput() {
    const query = teamInput.value.trim();

    if (query.length < 2) {
        clearSuggestions(teamSuggestions);
        return;
    }

    try {
        const results = await fetchTeams(query);
        renderTeamSuggestions(results);
    } catch (err) {
        console.error("Error fetching team suggestions:", err);
    }
}

// (2) --> Fetch teams based on search query.
async function fetchTeams(query) {
    const res = await fetch(`/api/v1/teams/search?team=${encodeURIComponent(query)}`);
    return await res.json();
}

// (3) --> Render fetched teams into suggestions list.
function renderTeamSuggestions(teams) {
    if (!teams.length) return clearSuggestions(teamSuggestions);

    teamSuggestions.innerHTML = teams
        .map(team => `<li data-id="${team.team_id}">${team.display_name} (${team.abbreviation})</li>`)
        .join('');
    teamSuggestions.style.display = 'block';

    // Attach click handlers
    attachClickHandler(teamSuggestions, handleTeamSelection);
}

// (4) --> Handle what happens when a user clicks on a team <li>
async function handleTeamSelection(li) {
    const teamId = li.getAttribute('data-id');
    const teamName = li.textContent;

    teamInput.value = teamName;
    clearSuggestions(teamSuggestions);

    await fetchGamesForTeam(teamId);

    unhideElementById('game-filter')
}

// =====================
// GAME FILTER HANDLERS
// =====================

// (5) - (1) --> After team is chosen, fetch relevant games and call populate games list
async function fetchGamesForTeam(teamId) {
    try {
        clearSuggestions(gameSuggestions);
        const res = await fetch(`/api/v1/games?team_id=${teamId}`);
        const games = await res.json();
        populateGamesList(games, teamId);
    } catch (err) {
        console.error("Error loading games:", err);
    }
}

// (6) - (2) --> Given a JSON response of games and a teamId, add game suggestions and attach a click handler to them
function populateGamesList(games, teamId) {
    games.forEach(game => {
        const isHome = game.home_team_id === parseInt(teamId);
        const opponent = isHome ? game.away_team_abbr : game.home_team_abbr;
        const role = isHome ? 'vs' : 'at';
        const dateStr = new Date(game.game_date).toLocaleDateString();

        const label = `${role} ${opponent} on ${dateStr}`;
        const listElement = document.createElement('li');

        listElement.textContent = label;
        listElement.dataset.id = game.game_id;
        gameSuggestions.appendChild(listElement);
        gameSuggestions.style.display = 'block';
    });

    attachClickHandler(ul = gameSuggestions, handler = handleGameInput);
}

// (7) - (3) -->
async function handleGameInput(li) {
    const gameId = li.getAttribute('data-id');
    const gameName = li.textContent;

    gameInput.value = gameName;
    clearSuggestions(gameSuggestions);
    unhideElementsByClass('hidden-filter');

    // BELOW IS UNDEFINED
    await fetchGamePeriods(gameId);

    // WHAT DO WE DO FROM HERE??
}

// (5) - (1) --> After team is chosen, fetch relevant games and call populate games list
async function fetchGamesForTeam(teamId) {
    try {
        clearSuggestions(gameSuggestions);
        const res = await fetch(`/api/v1/games?team_id=${teamId}`);
        const games = await res.json();
        populateGamesList(games, teamId);
    } catch (err) {
        console.error("Error loading games:", err);
    }
}
