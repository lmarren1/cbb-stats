-- Create teams table.
CREATE TABLE "teams" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "created at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create players table.
CREATE TABLE "players" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "team_id" INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    "created at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lineups table.
CREATE TABLE "lineups" (
    "id" SERIAL PRIMARY KEY,
    "player1_id" INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    "player2_id" INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    "player3_id" INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    "player4_id" INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    "player5_id" INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    "created at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create games table.
CREATE TABLE "games" (
    "id" SERIAL PRIMARY KEY,
    "date" TIMESTAMP NOT NULL,
    "location" VARCHAR(255),
    "home_team_id" INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    "away_team_id" INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    "home_score" INT NOT NULL,
    "away_score" INT NOT NULL,
    "created at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create possessions table.
CREATE TABLE possessions (
    "id" SERIAL PRIMARY KEY,
    "game_id" INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    "offensive_team_id" INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    "defensive_team_id" INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    "offensive_lineup_id" INT NOT NULL REFERENCES lineups(id) ON DELETE CASCADE,
    "defensive_lineup_id" INT NOT NULL REFERENCES lineups(id) ON DELETE CASCADE,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "duration" INTERVAL NOT NULL,
    "start_action" VARCHAR(50) NOT NULL,
    "end_action" VARCHAR(50) NOT NULL,
    "auxiliary_action" VARCHAR(50) NOT NULL,
    "start_action_player_id" INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    "end_action_player_id" INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    "auxiliary_action_player_id" INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    "result" VARCHAR(50) NOT NULL,
    "start_score" INT NOT NULL,
    "end_score" INT NOT NULL,
    "points_scored" INT GENERATED ALWAYS AS ("end_score" - "start_score") STORED,
    "created at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "action_types" (
    "id" SERIAL PRIMARY KEY,
    "offensive_or_defensive" VARCHAR(9) NOT NULL,
    "name" VARCHAR(50) UNIQUE NOT NULL
)

-- Create actions table.
CREATE TABLE "actions" (
    "id" SERIAL PRIMARY KEY,
    "game_id" INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    "possession_id" INT REFERENCES possessions(id) ON DELETE CASCADE,
    "player_id" INT REFERENCES players(id) ON DELETE SET NULL,
    "team_id" INT REFERENCES teams(id) ON DELETE SET NULL,
    "lineup_id" INT REFERENCES lineups(id) ON DELETE SET NULL,
    "action_type_id" INT REFERENCES action_types(id) ON DELETE ,
    "timestamp" TIMESTAMP NOT NULL,
    "result" VARCHAR(50),
    "description" TEXT
);

