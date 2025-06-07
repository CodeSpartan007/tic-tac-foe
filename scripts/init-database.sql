-- Initialize the Tic Tac Toe database
-- This script creates all necessary tables and indexes

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS highscores;

-- Create the highscores table
CREATE TABLE highscores (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  variant VARCHAR(20) NOT NULL CHECK (variant IN ('classic', '5x5', 'ultimate')),
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time INTEGER NOT NULL CHECK (time > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_highscores_variant ON highscores(variant);
CREATE INDEX idx_highscores_difficulty ON highscores(difficulty);
CREATE INDEX idx_highscores_time ON highscores(time);
CREATE INDEX idx_highscores_variant_difficulty ON highscores(variant, difficulty);

-- Create a view for the top 10 scores per variant and difficulty
CREATE OR REPLACE VIEW top_scores AS
SELECT * FROM (
  SELECT 
    *,
    ROW_NUMBER() OVER (PARTITION BY variant, difficulty ORDER BY time ASC) as rank
  FROM highscores
) ranked
WHERE rank <= 10;

-- Insert some sample data for testing
INSERT INTO highscores (username, variant, difficulty, time) VALUES
('GameMaster', 'classic', 'easy', 12),
('SpeedRunner', 'classic', 'easy', 15),
('TicTacPro', 'classic', 'easy', 18),
('QuickWin', 'classic', 'easy', 22),
('FastPlayer', 'classic', 'easy', 25),

('StrategyKing', 'classic', 'medium', 28),
('ThinkFast', 'classic', 'medium', 32),
('CleverMove', 'classic', 'medium', 35),
('SmartPlay', 'classic', 'medium', 38),
('TacticMaster', 'classic', 'medium', 42),

('AIBeater', 'classic', 'hard', 45),
('ChessGrand', 'classic', 'hard', 48),
('LogicLord', 'classic', 'hard', 52),
('BrainPower', 'classic', 'hard', 55),
('MindGames', 'classic', 'hard', 58),

('GridMaster', '5x5', 'medium', 65),
('BigBoard', '5x5', 'medium', 72),
('FiveInRow', '5x5', 'medium', 78),
('LargeGrid', '5x5', 'medium', 85),
('ExtendedPlay', '5x5', 'medium', 92),

('UltimateWin', 'ultimate', 'hard', 120),
('MetaGame', 'ultimate', 'hard', 135),
('NineBoards', 'ultimate', 'hard', 148),
('ComplexPlay', 'ultimate', 'hard', 162),
('UltimateChamp', 'ultimate', 'hard', 175);

-- Verify the data was inserted
SELECT 
  variant, 
  difficulty, 
  COUNT(*) as total_scores,
  MIN(time) as best_time,
  MAX(time) as worst_time
FROM highscores 
GROUP BY variant, difficulty 
ORDER BY variant, difficulty;
