-- Step 1: Check if column exists.
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'games' AND column_name = 'season_year';

-- Step 2: If the column exists, run the DROP COLUMN command.
ALTER TABLE "games"
DROP COLUMN "season_year";

-- NEED NODE.JS TO HANDLE IF EXISTS LOGIC --> CAN'T USE ON TABLE COLUMNS, ONLY TABLES.
