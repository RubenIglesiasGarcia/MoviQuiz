CREATE TABLE IF NOT EXISTS player_emotes (
 user_id TEXT PRIMARY KEY,
 good TEXT NOT NULL DEFAULT 'random',
 bad TEXT NOT NULL DEFAULT 'random'
);
