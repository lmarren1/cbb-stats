CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL
);

CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    team_id INT NOT NULL REFERENCES teams(team_id)
);

CREATE TABLE lineups (
    lineup_id SERIAL PRIMARY KEY,
    team_id INT NOT NULL REFERENCES teams(team_id),
    player1_id INT NOT NULL REFERENCES players(player_id),
    player2_id INT NOT NULL REFERENCES players(player_id),
    player3_id INT NOT NULL REFERENCES players(player_id),
    player4_id INT NOT NULL REFERENCES players(player_id),
    player5_id INT NOT NULL REFERENCES players(player_id)
);

CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    game_date TIMESTAMP NOT NULL,
    home_team_id INT NOT NULL REFERENCES teams(team_id),
    away_team_id INT NOT NULL REFERENCES teams(team_id),
    home_score INT NOT NULL,
    away_score INT NOT NULL
);

CREATE TABLE possessions (
    possession_id SERIAL PRIMARY KEY,
    game_id INT NOT NULL REFERENCES games(game_id),
    game_half INT NOT NULL,
    possession_number INT NOT NULL,
    offensive_team_id INT NOT NULL REFERENCES teams(team_id),
    defensive_team_id INT NOT NULL REFERENCES teams(team_id),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INT GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (start_time - end_time))) STORED,
    defense_score INT NOT NULL,
    offense_start_score INT NOT NULL,
    offense_end_score INT NOT NULL,
    offense_points_scored INT GENERATED ALWAYS AS (offense_end_score - offense_start_score) STORED,
    offense_score_margin INT GENERATED ALWAYS AS (offense_end_score - defense_score) STORED
);

CREATE TABLE actions (
    action_id SERIAL PRIMARY KEY,
    previous_action_id INT REFERENCES actions(action_id),
    possession_id INT NOT NULL REFERENCES possessions(possession_id),
    offensive_lineup_id INT NOT NULL REFERENCES lineups(lineup_id),
    defensive_lineup_id INT NOT NULL REFERENCES lineups(lineup_id),
    action_name VARCHAR(25) NOT NULL,
    action_type VARCHAR(25) NOT NULL,
    action_time TIME NOT NULL,
    player_id INT NOT NULL REFERENCES players(player_id),
    action_result VARCHAR(25),
    action_location VARCHAR(25)
);
