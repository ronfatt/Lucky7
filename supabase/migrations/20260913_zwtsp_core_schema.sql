-- ==========================================================
-- 紫微时空数字预测系统 (ZWTSP) Core Database Schema
-- Migration: 20260913_zwtsp_core_schema.sql
-- Database: Supabase PostgreSQL (15+)
-- ==========================================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS birth_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    birth_date DATE NOT NULL,
    birth_time TIME,
    is_birth_time_known BOOLEAN NOT NULL DEFAULT true,
    birth_place TEXT,
    timezone TEXT NOT NULL DEFAULT 'Asia/Shanghai',
    calendar_type TEXT NOT NULL DEFAULT 'gregorian' CHECK (calendar_type IN ('gregorian', 'lunar')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_birth_profile_user UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS destiny_charts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    birth_profile_id UUID NOT NULL REFERENCES birth_profiles(id) ON DELETE CASCADE,
    ming_palace TEXT NOT NULL,
    shen_palace TEXT NOT NULL,
    wuxing_ju TEXT NOT NULL,
    bazi_year TEXT NOT NULL,
    bazi_month TEXT NOT NULL,
    bazi_day TEXT NOT NULL,
    bazi_hour TEXT,
    dna_core_numbers INT[] NOT NULL DEFAULT '{}',
    dna_support_numbers INT[] NOT NULL DEFAULT '{}',
    dna_weak_numbers INT[] NOT NULL DEFAULT '{}',
    element_distribution JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_destiny_chart_user UNIQUE(user_id)
);

-- 2. METAPHYSICAL RULES & REPOSITORY
CREATE TABLE IF NOT EXISTS numerology_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name TEXT NOT NULL,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('digit_element', 'yin_yang', 'hetu_pair', 'luoshu_coord', 'digital_root')),
    input_value TEXT NOT NULL,
    output_value TEXT NOT NULL,
    weight NUMERIC(5,2) NOT NULL DEFAULT 1.00,
    version TEXT NOT NULL DEFAULT '1.0',
    source TEXT NOT NULL DEFAULT 'Traditional Metaphysics Standard',
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS palaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    meaning TEXT NOT NULL,
    keywords TEXT[] NOT NULL DEFAULT '{}',
    default_weight NUMERIC(5,2) NOT NULL DEFAULT 1.00,
    number_sources INT[] NOT NULL DEFAULT '{}',
    reality_keywords TEXT[] NOT NULL DEFAULT '{}',
    active BOOLEAN NOT NULL DEFAULT true,
    version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    base_element TEXT NOT NULL CHECK (base_element IN ('Wood', 'Fire', 'Earth', 'Metal', 'Water')),
    yin_yang TEXT NOT NULL CHECK (yin_yang IN ('Yang', 'Yin', 'Dual')),
    meaning TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS star_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    star_id UUID NOT NULL REFERENCES stars(id) ON DELETE CASCADE,
    source TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    mapped_numbers INT[] NOT NULL DEFAULT '{}',
    confidence NUMERIC(3,2) NOT NULL DEFAULT 0.85,
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS four_transformations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    star_name TEXT NOT NULL,
    transformation TEXT NOT NULL CHECK (transformation IN ('Lu', 'Quan', 'Ke', 'Ji')),
    meaning TEXT NOT NULL,
    number_effect TEXT NOT NULL,
    weight NUMERIC(5,2) NOT NULL DEFAULT 1.00,
    version TEXT NOT NULL DEFAULT '1.0',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. DAILY TIME SIGNATURES & DIRECTION
CREATE TABLE IF NOT EXISTS daily_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_date DATE NOT NULL UNIQUE,
    lunar_date_str TEXT NOT NULL,
    solar_term TEXT,
    ganzhi_year TEXT NOT NULL,
    ganzhi_month TEXT NOT NULL,
    ganzhi_day TEXT NOT NULL,
    wood_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    fire_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    earth_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    metal_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    water_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    opportunity_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    opportunity_level TEXT NOT NULL CHECK (opportunity_level IN ('LOW', 'WEAK', 'NORMAL', 'STRONG', 'VERY STRONG')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS time_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_signature_id UUID NOT NULL REFERENCES daily_signatures(id) ON DELETE CASCADE,
    shichen_branch TEXT NOT NULL,
    time_range TEXT NOT NULL,
    window_type TEXT NOT NULL CHECK (window_type IN ('primary', 'secondary', 'avoid')),
    score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS direction_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_signature_id UUID NOT NULL REFERENCES daily_signatures(id) ON DELETE CASCADE,
    direction TEXT NOT NULL CHECK (direction IN ('N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW')),
    azimuth_start INT NOT NULL,
    azimuth_end INT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('primary', 'secondary', 'avoid')),
    score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. REALITY SIGNALS (今日观象取数)
CREATE TABLE IF NOT EXISTS reality_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    raw_input TEXT NOT NULL,
    signal_type TEXT NOT NULL DEFAULT 'observed_number',
    extracted_digits INT[] NOT NULL DEFAULT '{}',
    digit_frequencies JSONB NOT NULL DEFAULT '{}'::jsonb,
    reality_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. HISTORICAL DRAWS & FEATURES
CREATE TABLE IF NOT EXISTS historical_draws (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lottery_type TEXT NOT NULL DEFAULT 'Lucky7',
    issue_number TEXT NOT NULL,
    draw_date DATE NOT NULL,
    draw_time TIME,
    winning_numbers INT[] NOT NULL,
    source TEXT NOT NULL,
    import_version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_historical_draw UNIQUE(lottery_type, issue_number)
);

CREATE TABLE IF NOT EXISTS number_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    historical_draw_id UUID NOT NULL REFERENCES historical_draws(id) ON DELETE CASCADE,
    digit_sum INT NOT NULL,
    digital_root INT NOT NULL,
    odd_even_ratio NUMERIC(5,2) NOT NULL,
    high_low_ratio NUMERIC(5,2) NOT NULL,
    consecutive_count INT NOT NULL DEFAULT 0,
    repeated_count INT NOT NULL DEFAULT 0,
    luoshu_coords JSONB NOT NULL DEFAULT '{}'::jsonb,
    element_counts JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. ALGORITHM VERSIONS & WEIGHT CONFIGS
CREATE TABLE IF NOT EXISTS algorithm_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    weights_snapshot JSONB NOT NULL,
    rules_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'experimental')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS weight_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_name TEXT NOT NULL UNIQUE,
    weight_destiny NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    weight_bazi NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    weight_stars NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    weight_transformations NUMERIC(5,2) NOT NULL DEFAULT 5.00,
    weight_elements NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    weight_luoshu NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    weight_reality NUMERIC(5,2) NOT NULL DEFAULT 5.00,
    weight_historical NUMERIC(5,2) NOT NULL DEFAULT 20.00,
    weight_structure NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    version TEXT NOT NULL DEFAULT '1.0',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. PREDICTIONS & NUMBER SCORES
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    draw_date DATE NOT NULL,
    draw_time TIME,
    algorithm_version TEXT NOT NULL REFERENCES algorithm_versions(version),
    input_snapshot JSONB NOT NULL,
    weights_snapshot JSONB NOT NULL,
    top20 INT[] NOT NULL DEFAULT '{}',
    top10 INT[] NOT NULL DEFAULT '{}',
    top5 INT[] NOT NULL DEFAULT '{}',
    mother_code TEXT,
    variation_codes TEXT[] NOT NULL DEFAULT '{}',
    model_consistency NUMERIC(5,2) NOT NULL,
    locked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prediction_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prediction_id UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
    digit INT NOT NULL CHECK (digit BETWEEN 0 AND 9),
    personal_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    time_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    element_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    palace_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    star_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    transformation_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    luoshu_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    historical_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    reality_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    final_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (final_score >= 0 AND final_score <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. BACKTESTS & RESULTS
CREATE TABLE IF NOT EXISTS backtests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    algorithm_version TEXT NOT NULL REFERENCES algorithm_versions(version),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_draws INT NOT NULL,
    hit_count_top5 INT NOT NULL DEFAULT 0,
    hit_rate_top5 NUMERIC(5,4) NOT NULL DEFAULT 0,
    hit_count_top10 INT NOT NULL DEFAULT 0,
    hit_rate_top10 NUMERIC(5,4) NOT NULL DEFAULT 0,
    hit_count_top20 INT NOT NULL DEFAULT 0,
    hit_rate_top20 NUMERIC(5,4) NOT NULL DEFAULT 0,
    random_baseline_rate NUMERIC(5,4) NOT NULL DEFAULT 0.5000,
    outperformance_delta NUMERIC(5,4) NOT NULL DEFAULT 0,
    has_lookahead_bias BOOLEAN NOT NULL DEFAULT false,
    bias_warning TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS backtest_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backtest_id UUID NOT NULL REFERENCES backtests(id) ON DELETE CASCADE,
    draw_id UUID NOT NULL REFERENCES historical_draws(id) ON DELETE CASCADE,
    predicted_numbers INT[] NOT NULL,
    actual_numbers INT[] NOT NULL,
    matches INT NOT NULL DEFAULT 0,
    is_top5_hit BOOLEAN NOT NULL DEFAULT false,
    is_top10_hit BOOLEAN NOT NULL DEFAULT false,
    is_top20_hit BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. USER SETTINGS & RESPONSIBLE PARTICIPATION
CREATE TABLE IF NOT EXISTS user_budget_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    daily_budget NUMERIC(10,2) DEFAULT NULL,
    monthly_budget NUMERIC(10,2) DEFAULT NULL,
    pledge_13_percent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_budget UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS ritual_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('yi', 'jing', 'wei', 'xing', 'guan', 'qu')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '传统文化/个人仪式建议，不代表能够提高实际中奖概率。',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    event_type TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_birth_profiles_user ON birth_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_historical_draws_date ON historical_draws(draw_date DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_user_date ON predictions(user_id, draw_date DESC);
CREATE INDEX IF NOT EXISTS idx_backtest_results_bt ON backtest_results(backtest_id);
CREATE INDEX IF NOT EXISTS idx_reality_signals_user ON reality_signals(user_id, created_at DESC);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE birth_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE destiny_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reality_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_budget_settings ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies using auth.uid()
CREATE POLICY "Users can only read their own birth profiles" 
    ON birth_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own birth profiles" 
    ON birth_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own birth profiles" 
    ON birth_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only read their own predictions" 
    ON predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own predictions" 
    ON predictions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own budget" 
    ON user_budget_settings FOR ALL USING (auth.uid() = user_id);
