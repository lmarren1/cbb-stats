library(hoopR)
library(dplyr)
library(ggplot2)
library(DBI)
library(RPostgres)

data <- load_mbb_pbp()
teams <- espn_mbb_teams()

teams <- teams |>
  filter(team_id == 356)

teams <- teams |>
  filter(team_id %in% c(84, 150, 96, 2752, 275, 2294, 2509, 127, 26, 135, 164, 194, 158, 84, 30, 213, 264, 2130, 142, 2633, 8, 2031, 2379, 333, 2473, 2565))

illinois_team_id <- teams |>
  filter(abbreviation == "ILL") |>
  select(team_id) |>
  unlist()

illinois_data <- data |>
  filter(season == 2025) |>
  filter(home_team_abbrev == "ILL" | away_team_abbrev == "ILL") |>
  distinct(game_id) |>
  unlist()

################################################################################
# LOAD GAME PLAY-BY-PLAY INTO DATABASE
################################################################################

con <- dbConnect(
  Postgres(),
  dbname = "",
  host = "",
  port = ,
  user = "",
  password = ""
)

for (game_id in illinois_data) {
  game_pbp <- espn_mbb_pbp(game_id)
  game_pbp_vars <- colnames(game_pbp)
  shot_location_indicator <- c("coordinate_x")

  if (shot_location_indicator %in% game_pbp_vars) {
    game_pbp <- game_pbp |>
      select(sequence_number, text, away_score, home_score, scoring_play, score_value,
             shooting_play, type_text, period_number, clock_display_value,
             team_id, coordinate_x, coordinate_y, athlete_id_1, athlete_id_2,
             game_id)
  } else {
    game_pbp <- game_pbp |>
      select(sequence_number, text, away_score, home_score, scoring_play, score_value,
             shooting_play, type_text, period_number, clock_display_value,
             team_id, athlete_id_1, athlete_id_2,
             game_id)
  }

  class(game_pbp) <- "data.frame"

  tryCatch({
    dbWriteTable(con, "actions", game_pbp, row.names = FALSE, append = TRUE)
    message("Inserted data for game: ", game_pbp)
  }, error = function(e) {
    message("Skipped game_id", game_pbp, " due to error: ", e$message)
  })
}

dbDisconnect(con)

################################################################################
# LOAD GAME INFO INTO DATABASE
################################################################################

for (game_id in illinois_data) {
  game_pbp <- espn_mbb_pbp(game_id)
  game_info <- game_pbp |>
    select(home_team_id, away_team_id, home_team_score, away_team_score,
           home_team_winner, away_team_winner, game_id, season, season_type,
           game_date) |>
    distinct()

  class(game_info) <- "data.frame"

  tryCatch({
    dbWriteTable(con, "games", game_info, row.names = FALSE, append = TRUE)
    message("Inserted game info data for game: ", game_id)
  }, error = function(e) {
    message("Skipped game_id", game_id, " due to error: ", e$message)
  })
}

################################################################################
# LOAD TEAMS ROSTERS INTO DATABASE
################################################################################

for (game_id in illinois_data) {

  tryCatch({
    game_roster <- espn_mbb_game_rosters(game_id)
    message("There's roster data available for game: ", game_id)
  }, error = function(e) {
    message("Skipped game_id", game_id, " due to error: ", e$message)
  })

  if (is.null(game_roster) || nrow(game_roster) == 0) {
    next
  }

  game_roster <- game_roster |>
    select(athlete_id, first_name, last_name, weight, height, headshot_href,
           jersey_x, position_name, experience_years, team_id) |>
    filter(team_id != 356)

  class(game_roster) <- "data.frame"

  tryCatch({
    dbWriteTable(con, "players", game_roster, row.names = FALSE, append = TRUE)
    message("Inserted game info data for game: ", game_id)
  }, error = function(e) {
    message("Skipped game_id", game_id, " due to error: ", e$message)
  })
}

################################################################################
# LOAD TEAMS ROSTERS INTO DATABASE
################################################################################

dbWriteTable(con, "teams", teams, row.names = FALSE, append = TRUE)

########################
# Possession Algorithm #
########################

actions <- last_game |>
  select(sequence_number, text, away_score, home_score, scoring_play, score_value,
         shooting_play, type_text, period_number, clock_display_value,
         team_id, coordinate_x, coordinate_y, athlete_id_1, athlete_id_2,
         game_id)

possessions <- vector(mode = "numeric", length = nrow(actions))
possession_number <- 1

offensive_action <- c("LayUpShot", "JumpShot", "MadeFreeThrow", "DunkShot",
                      "Offensive Rebound", "Dead Ball Rebound", "Lost Ball Turnover")
defensive_stop <- c("Defensive Rebound", "Steal")


for (i in seq(1, nrow(actions))) {

  # Allow us to use previous action_type
  if (i == 1) {
    next
  }

  prev_action_type <- actions$type_text[i-1]
  curr_action_type <- actions$type_text[i]

  # (1) Handle Defensive Stops where possession turnover is immediate
  # (2) If last action was the end of the period, but not the game, this action is a new possession
  if ((curr_action_type %in% defensive_stop) ||
      (prev_action_type == "End Period" && curr_action_type != "End Game")) {
    possession_number <- possession_number + 1
  }


  possessions[i] <- possession_number
}

actions$possession_number <- possessions
ten <- actions |>
  select(possession_number, text, team_id, type_text, clock_display_value)
View(ten)

View(actions)

unique(actions$type_text)



