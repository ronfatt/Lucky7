-- =============================================================================
-- ZWTSP Phase 6 Migration: Number Synthesis, Predictions & Backtesting
-- File: supabase/migrations/20260913_zwtsp_phase6_synthesis_backtest.sql
-- =============================================================================

-- 1. Game Profiles Table (Configurable Number Systems)
CREATE TABLE IF NOT EXISTS public.game_profiles (
    id VARCHAR(30) PRIMARY KEY, -- 'GAME_4D', 'GAME_3D', 'GAME_2D', etc.
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL DEFAULT 'GLOBAL',
    operator VARCHAR(100) NOT NULL DEFAULT 'Standard Generic',
    digit_length INTEGER NOT NULL CHECK (digit_length >= 1 AND digit_length <= 10),
    min_digit INTEGER NOT NULL DEFAULT 0,
    max_digit INTEGER NOT NULL DEFAULT 9,
    draw_frequency VARCHAR(50) NOT NULL DEFAULT 'Daily',
    active BOOLEAN NOT NULL DEFAULT true,
    version VARCHAR(20) NOT NULL DEFAULT 'V1.0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Canonical Game Profiles
INSERT INTO public.game_profiles (id, name, country, operator, digit_length, min_digit, max_digit, draw_frequency, active, version)
VALUES
    ('GAME_4D', '标准四位数 (4-Digit Generic)', 'GLOBAL', 'Universal 4D', 4, 0, 9, 'Daily', true, 'V1.0'),
    ('GAME_3D', '精选三位数 (3-Digit Generic)', 'GLOBAL', 'Universal 3D', 3, 0, 9, 'Daily', true, 'V1.0'),
    ('GAME_2D', '双位特征数 (2-Digit Generic)', 'GLOBAL', 'Universal 2D', 2, 0, 9, 'Daily', true, 'V1.0')
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    digit_length = EXCLUDED.digit_length,
    active = EXCLUDED.active;

-- 2. Verified Historical Draw Results Table
CREATE TABLE IF NOT EXISTS public.draw_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_profile_id VARCHAR(30) NOT NULL REFERENCES public.game_profiles(id),
    draw_date DATE NOT NULL,
    draw_time TIME NOT NULL DEFAULT '19:00:00',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Shanghai',
    result_number VARCHAR(20) NOT NULL,
    digits INTEGER[] NOT NULL,
    source VARCHAR(100) NOT NULL DEFAULT 'Official Draw Audit',
    verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_game_draw UNIQUE (game_profile_id, draw_date, draw_time)
);

-- 3. Daily Prediction Snapshots (Immutable Historical Records)
CREATE TABLE IF NOT EXISTS public.daily_prediction_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_profile_id VARCHAR(30) NOT NULL REFERENCES public.game_profiles(id),
    prediction_date DATE NOT NULL,
    mother_code VARCHAR(20) NOT NULL,
    mother_code_score NUMERIC(5, 2) NOT NULL,
    top_candidates JSONB NOT NULL, -- Array of top candidates
    digit_ranking JSONB NOT NULL,   -- 0-9 composite scores
    direction_used VARCHAR(10) NULL,
    reality_signals_used JSONB NULL,
    data_quality_score NUMERIC(5, 2) NOT NULL DEFAULT 85.0,
    model_consistency VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    algorithm_version VARCHAR(30) NOT NULL DEFAULT 'SYNTHESIS-V1.0',
    rule_version VARCHAR(30) NOT NULL DEFAULT 'RULE-V1.0',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_game_date_snapshot UNIQUE (user_id, game_profile_id, prediction_date)
);

-- 4. Prediction Candidates Detail Table
CREATE TABLE IF NOT EXISTS public.prediction_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_id UUID NOT NULL REFERENCES public.daily_prediction_snapshots(id) ON DELETE CASCADE,
    number VARCHAR(20) NOT NULL,
    rank INTEGER NOT NULL,
    score NUMERIC(5, 2) NOT NULL,
    digit_strength NUMERIC(5, 2) NOT NULL,
    dna_score NUMERIC(5, 2) NOT NULL,
    daily_score NUMERIC(5, 2) NOT NULL,
    reality_score NUMERIC(5, 2) NOT NULL,
    direction_score NUMERIC(5, 2) NOT NULL,
    pattern_score NUMERIC(5, 2) NOT NULL,
    confidence VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    generation_method VARCHAR(50) NOT NULL,
    parent_number VARCHAR(20) NULL,
    calculation_version VARCHAR(30) NOT NULL DEFAULT 'CANDIDATE-V1.0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Prediction Variations Table
CREATE TABLE IF NOT EXISTS public.prediction_variations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_id UUID NOT NULL REFERENCES public.daily_prediction_snapshots(id) ON DELETE CASCADE,
    parent_number VARCHAR(20) NOT NULL,
    variation_type VARCHAR(30) NOT NULL, -- 'PERMUTATION', 'REVERSE', 'MIRROR', 'ROTATION', 'PAIR_SWAP'
    result_number VARCHAR(20) NOT NULL,
    variation_score NUMERIC(5, 2) NOT NULL,
    rank INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Digit Feature Vectors Table
CREATE TABLE IF NOT EXISTS public.digit_feature_vectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    digit INTEGER NOT NULL CHECK (digit >= 0 AND digit <= 9),
    personal_dna_score NUMERIC(5, 2) NOT NULL,
    daily_activation_score NUMERIC(5, 2) NOT NULL,
    reality_resonance_score NUMERIC(5, 2) NOT NULL,
    direction_score NUMERIC(5, 2) NOT NULL,
    frequency_score NUMERIC(5, 2) NOT NULL,
    pattern_score NUMERIC(5, 2) NOT NULL,
    element_score NUMERIC(5, 2) NOT NULL,
    overall_digit_score NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_date_digit UNIQUE (user_id, date, digit)
);

-- 7. Backtest Runs Table
CREATE TABLE IF NOT EXISTS public.backtest_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_profile_id VARCHAR(30) NOT NULL REFERENCES public.game_profiles(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    model_version VARCHAR(50) NOT NULL DEFAULT 'FULL-MODEL-V1.0',
    sample_size INTEGER NOT NULL,
    exact_hit_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    top_5_hit_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    top_10_hit_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    top_20_hit_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    avg_digit_hits NUMERIC(4, 2) NOT NULL DEFAULT 0.0,
    baseline_comparison JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Backtest Draw-by-Draw Results Table
CREATE TABLE IF NOT EXISTS public.backtest_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES public.backtest_runs(id) ON DELETE CASCADE,
    draw_id UUID NOT NULL REFERENCES public.draw_results(id) ON DELETE CASCADE,
    draw_date DATE NOT NULL,
    actual_number VARCHAR(20) NOT NULL,
    mother_code VARCHAR(20) NOT NULL,
    top_candidates TEXT[] NOT NULL,
    exact_match BOOLEAN NOT NULL DEFAULT false,
    position_matches INTEGER NOT NULL DEFAULT 0,
    digit_set_match BOOLEAN NOT NULL DEFAULT false,
    partial_digit_hits INTEGER NOT NULL DEFAULT 0,
    rank_of_actual INTEGER NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_draw_results_game_date ON public.draw_results(game_profile_id, draw_date);
CREATE INDEX IF NOT EXISTS idx_prediction_snapshots_user_date ON public.daily_prediction_snapshots(user_id, prediction_date);
CREATE INDEX IF NOT EXISTS idx_prediction_candidates_snapshot ON public.prediction_candidates(snapshot_id);
CREATE INDEX IF NOT EXISTS idx_backtest_runs_game ON public.backtest_runs(game_profile_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_backtest_results_run ON public.backtest_results(run_id);

-- Enable RLS
ALTER TABLE public.game_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_prediction_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digit_feature_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backtest_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backtest_results ENABLE ROW LEVEL SECURITY;

-- Public read for reference/draw data
CREATE POLICY "Public read game_profiles" ON public.game_profiles FOR SELECT USING (true);
CREATE POLICY "Public read draw_results" ON public.draw_results FOR SELECT USING (true);

-- User-isolated policies for prediction snapshots
CREATE POLICY "User can view own predictions" ON public.daily_prediction_snapshots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "User can insert own predictions" ON public.daily_prediction_snapshots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can view own candidates" ON public.prediction_candidates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.daily_prediction_snapshots s
            WHERE s.id = snapshot_id AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "User can view own digit feature vectors" ON public.digit_feature_vectors
    FOR SELECT USING (auth.uid() = user_id);

-- Read-only policy for backtest runs & results
CREATE POLICY "Public read backtest runs" ON public.backtest_runs FOR SELECT USING (true);
CREATE POLICY "Public read backtest results" ON public.backtest_results FOR SELECT USING (true);
