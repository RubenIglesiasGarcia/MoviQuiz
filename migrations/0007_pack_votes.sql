CREATE TABLE IF NOT EXISTS question_pack_votes (pack_id TEXT NOT NULL, voter TEXT NOT NULL, vote INTEGER NOT NULL CHECK(vote IN (-1,1)), PRIMARY KEY(pack_id,voter));
CREATE INDEX IF NOT EXISTS pack_votes_voter ON question_pack_votes(voter);
