-- Create teams table.
CREATE TABLE "teams" (
    "team_id" SERIAL PRIMARY KEY,
    "team_name" VARCHAR(255) NOT NULL
);

-- Create games table.
CREATE TABLE "games" (
    "game_id" SERIAL PRIMARY KEY,
    "game_date" TIMESTAMP NOT NULL,
    "location" VARCHAR(255),
    "home_team_id" INT NOT NULL REFERENCES teams(team_id),
    "away_team_id" INT NOT NULL REFERENCES teams(team_id),
    "home_score" INT NOT NULL,
    "away_score" INT NOT NULL
);
