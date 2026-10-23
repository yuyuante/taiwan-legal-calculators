CREATE TABLE IF NOT EXISTS usage_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  taipei_date TEXT NOT NULL,
  user_hash TEXT NOT NULL,
  masked_email TEXT
);
CREATE INDEX IF NOT EXISTS idx_usage_events_taipei_date ON usage_events(taipei_date);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON usage_events(created_at);
