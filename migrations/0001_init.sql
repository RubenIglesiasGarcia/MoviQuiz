CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, name TEXT NOT NULL, guest INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS answers(user_id TEXT NOT NULL, match_id TEXT NOT NULL, question_id TEXT NOT NULL, payload TEXT NOT NULL, at TEXT NOT NULL, PRIMARY KEY(user_id,match_id,question_id));
CREATE INDEX IF NOT EXISTS answers_user_at ON answers(user_id,at);
CREATE TABLE IF NOT EXISTS matches(user_id TEXT NOT NULL, match_id TEXT NOT NULL, payload TEXT NOT NULL, at TEXT NOT NULL, PRIMARY KEY(user_id,match_id));
CREATE INDEX IF NOT EXISTS matches_user_at ON matches(user_id,at);
