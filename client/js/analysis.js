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
const selectedActionTypes = new Set();

// // Player Filter Elements
// const playerInput = document.getElementById('player-input');
// const playerSuggestions = document.getElementById('player-suggestions');

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
    teamInput.dataset.id = teamId;

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
    gameInput.dataset.id = gameId;
    clearSuggestions(gameSuggestions);
    unhideElementsByClass('hidden-filter');

    await fetchActionTypes(gameId);
}

async function fetchActionTypes(gameId) {
    try {
        const res = await fetch(`/api/v1/actions?game_id=${gameId}`);
        const action_types = await res.json();
        populateActionTypesList(action_types);
    } catch (err) {
        console.error("Error loading action types:", err);
    }
}

function populateActionTypesList(action_types) {

    const distinctActionTypes = new Set([
        'Dead Ball Rebound', 'End Game', 'End Period',
        'Jumpball', 'OfficialTVTimeOut', 'RegularTimeOut',
        'ShortTimeOut', 'Substitution', 'Block Shot', 'Defensive Rebound',
        'Lost Ball Turnover', 'Offensive Rebound', 'PersonalFoul', 'Steal',
        'Technical Foul'
    ]);

    action_types.forEach(action => {

        if (!distinctActionTypes.has(action.type_text)) {
            distinctActionTypes.add(action.type_text)

            const listElement = document.createElement('li');
            listElement.textContent = action.type_text;
            listElement.dataset.id = action.type_text;

            if (selectedActionTypes.has(action.type_text)) {
                listElement.classList.add('selected');
            }

            actionTypeSuggestions.appendChild(listElement);
            actionTypeSuggestions.style.display = 'block';
        }
    });

    attachClickHandler(ul = actionTypeSuggestions, handler = handleActionTypeInput);
}

function handleActionTypeInput(li) {
    const actionType = li.textContent;

    if (selectedActionTypes.has(actionType)) {
        selectedActionTypes.delete(actionType);
        li.classList.remove('selected');
    } else {
        selectedActionTypes.add(actionType);
        li.classList.add('selected');
    }

    actionTypeInput.value = Array.from(selectedActionTypes).join(', ');
    plot();
}

async function plot() {

    const params = new URLSearchParams();
    selectedActionTypes.forEach(type => params.append('type_text', type));
    params.append('game_id', gameInput.dataset.id);
    params.append('team_id', teamInput.dataset.id);
    const apiUrl = `/api/v1/actions?${params.toString()}`;

    try {

        const response = await fetch(apiUrl);
        const actions = await response.json();

        const normalized = actions.map(a => ({
            x: a.coordinate_x,
            y: a.coordinate_y,
            z: a.scoring_play ? a.score_value : 0
        }));

        const trace = {
            x: normalized.map(d => d.x),
            y: normalized.map(d => d.y),
            z: normalized.map(d => d.z),
            type: 'scatter',
            mode: 'markers'
        };

        const layout = {
            title: 'Full-Court Shot Map',
            xaxis: {
                title: 'Court Length (x)',
                range: [-47, 47],
                scaleanchor: 'y',
                showgrid: false,
                zeroline: false
            },
            yaxis: {
                title: 'Court Width (y)',
                range: [-25, 25],
                showgrid: false,
                zeroline: false
            },
            // Full-Court Shapes --> may be directly applied to half-court.
            shapes: [
                {
                    name: 'Out-of-Bounds Lines',
                    type: 'rect',
                    x0: -47,
                    x1: 47,
                    y0: -25,
                    y1: 25
                },
                {
                    name: 'Half-Court Line',
                    type: 'line',
                    x0: 0,
                    x1: 0,
                    y0: -25,
                    y1: 25
                },
                {
                    name: 'Center Circle',
                    type: 'circle',
                    x0: 6,
                    x1: -6,
                    y0: 6,
                    y1: -6
                },
                {
                    name: 'Right Free-Throw Lane',
                    type: 'rect',
                    x0: 47,
                    x1: 28,
                    y0: 6,
                    y1: -6
                },
                {
                    name: 'Left Free-Throw Lane',
                    type: 'rect',
                    x0: -47,
                    x1: -28,
                    y0: 6,
                    y1: -6
                },
                {
                    name: 'Right basket',
                    type: 'circle',
                    x0: 41,
                    x1: 42.5,
                    y0: 0.75,
                    y1: -0.75
                },
                {
                    name: 'Right Backboard',
                    type: 'line',
                    x0: 43,
                    x1: 43,
                    y0: 3,
                    y1: -3
                },
                {
                    name: 'Left Basket',
                    type: 'circle',
                    x0: -41,
                    x1: -42.5,
                    y0: 0.75,
                    y1: -0.75
                },
                {
                    name: 'Left Backboard',
                    type: 'line',
                    x0: -43,
                    x1: -43,
                    y0: 3,
                    y1: -3
                },
                {
                    name: 'Right Key',
                    type: 'circle',
                    x0: 22,
                    x1: 34,
                    y0: 6,
                    y1: -6
                },
                {
                    name: 'Left Key',
                    type: 'circle',
                    x0: -22,
                    x1: -34,
                    y0: 6,
                    y1: -6
                },
            ]
        };
        const graphDiv = document.getElementById('graph');
        Plotly.purge(graphDiv);
        Plotly.newPlot('graph', [trace], layout);

    } catch (error) {
        console.error('Failed to load action data:', error);
    }
}
