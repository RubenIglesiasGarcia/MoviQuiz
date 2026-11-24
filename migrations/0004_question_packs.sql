CREATE TABLE IF NOT EXISTS question_packs (
 id TEXT PRIMARY KEY,
 owner TEXT NOT NULL,
 title TEXT NOT NULL,
 description TEXT NOT NULL DEFAULT '',
 visibility TEXT NOT NULL CHECK(visibility IN ('private','link','public')),
 questions TEXT NOT NULL,
 count INTEGER NOT NULL,
 updated INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS packs_owner ON question_packs(owner,updated DESC);
CREATE INDEX IF NOT EXISTS packs_public ON question_packs(visibility,updated DESC);
CREATE TABLE IF NOT EXISTS question_pack_reports (
 pack_id TEXT NOT NULL,
 reporter TEXT NOT NULL,
 reason TEXT NOT NULL,
 created INTEGER NOT NULL,
 PRIMARY KEY(pack_id,reporter)
);
