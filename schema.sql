-- Create the highscores table
CREATE TABLE IF NOT EXISTS highscores (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  variant VARCHAR(20) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  time INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_highscores_variant ON highscores(variant);
CREATE INDEX IF NOT EXISTS idx_highscores_difficulty ON highscores(difficulty);
CREATE INDEX IF NOT EXISTS idx_highscores_time ON highscores(time);

-- Create a view for the top 10 scores per variant and difficulty
CREATE OR REPLACE VIEW top_scores AS
SELECT * FROM (
  SELECT 
    *,
    ROW_NUMBER() OVER (PARTITION BY variant, difficulty ORDER BY time ASC) as rank
  FROM highscores
) ranked
WHERE rank <= 10;
