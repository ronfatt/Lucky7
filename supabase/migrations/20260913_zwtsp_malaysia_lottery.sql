-- ======================================================================
-- ZWTSP V1.0: Phase 6.1 - Malaysian Lottery Operators & 23-Prize Schema
-- Operators: Magnum 4D, DaMaCai 1+3D, Sports Toto 4D, Sabah 88, STC, CashSweep
-- ======================================================================

-- 1. Insert Game Profiles for Malaysian Operators
INSERT INTO game_profiles (id, name, type, digit_count, min_digit, max_digit, draw_frequency, active, version)
VALUES
  ('MAGNUM_4D', 'Magnum 4D (万能)', '4D', 4, 0, 9, 'Wed, Sat, Sun & Special Tue', true, '1.0'),
  ('DAMACAI_4D', 'DaMaCai 1+3D (大马彩)', '4D', 4, 0, 9, 'Wed, Sat, Sun & Special Tue', true, '1.0'),
  ('TOTO_4D', 'Sports Toto 4D (多多)', '4D', 4, 0, 9, 'Wed, Sat, Sun & Special Tue', true, '1.0'),
  ('SABAH_88', 'Sabah 88 (沙巴88)', '4D', 4, 0, 9, 'Wed, Sat, Sun', true, '1.0'),
  ('STC_4D', 'Sandakan STC 4D (山打根)', '4D', 4, 0, 9, 'Wed, Sat, Sun', true, '1.0'),
  ('CASHSWEEP', 'Special CashSweep (砂拉越特别大马彩)', '4D', 4, 0, 9, 'Wed, Sat, Sun', true, '1.0')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  draw_frequency = EXCLUDED.draw_frequency,
  active = true;

-- 2. Extend draw_results table to support 23 winning numbers per draw
ALTER TABLE draw_results
  ADD COLUMN IF NOT EXISTS operator VARCHAR(32) DEFAULT 'MAGNUM',
  ADD COLUMN IF NOT EXISTS draw_no VARCHAR(32),
  ADD COLUMN IF NOT EXISTS first_prize CHAR(4),
  ADD COLUMN IF NOT EXISTS second_prize CHAR(4),
  ADD COLUMN IF NOT EXISTS third_prize CHAR(4),
  ADD COLUMN IF NOT EXISTS special_prizes TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS consolation_prizes TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS all_winning_numbers TEXT[] DEFAULT '{}';

-- Indexing for fast search on draw_date and operator
CREATE INDEX IF NOT EXISTS idx_draw_results_operator_date ON draw_results(operator, draw_date DESC);
CREATE INDEX IF NOT EXISTS idx_draw_results_draw_no ON draw_results(operator, draw_no);
