export const MIGRATION_V1_BOOKMARKS = `
  CREATE TABLE IF NOT EXISTS bookmarks (
    source  TEXT PRIMARY KEY NOT NULL,
    poster  TEXT,
    title   TEXT
  )
`;

export const MIGRATION_V1_HISTORY = `
  CREATE TABLE IF NOT EXISTS history (
    source     TEXT PRIMARY KEY NOT NULL,
    poster     TEXT,
    title      TEXT,
    viewed_at  INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  )
`;
