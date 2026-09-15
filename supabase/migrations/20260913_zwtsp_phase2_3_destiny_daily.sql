-- ==========================================================
-- 紫微时空数字预测系统 (ZWTSP) Phase 2 & 3 Database Migration
-- File: supabase/migrations/20260913_zwtsp_phase2_3_destiny_daily.sql
-- ==========================================================

-- 1. EXTEND BIRTH PROFILES
ALTER TABLE birth_profiles 
  ADD COLUMN IF NOT EXISTS birth_time_precision TEXT NOT NULL DEFAULT 'EXACT' 
    CHECK (birth_time_precision IN ('EXACT', 'APPROXIMATE', 'UNKNOWN')),
  ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6),
  ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6);

-- 2. FOUR PILLARS TABLE
CREATE TABLE IF NOT EXISTS four_pillars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    birth_profile_id UUID NOT NULL REFERENCES birth_profiles(id) ON DELETE CASCADE,
    year_stem TEXT NOT NULL,
    year_branch TEXT NOT NULL,
    month_stem TEXT NOT NULL,
    month_branch TEXT NOT NULL,
    day_stem TEXT NOT NULL,
    day_branch TEXT NOT NULL,
    hour_stem TEXT,
    hour_branch TEXT,
    year_element TEXT NOT NULL,
    month_element TEXT NOT NULL,
    day_element TEXT NOT NULL,
    hour_element TEXT,
    day_master TEXT NOT NULL,
    element_distribution JSONB NOT NULL DEFAULT '{}'::jsonb,
    calculation_version TEXT NOT NULL DEFAULT 'BAZI-V1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_four_pillars_profile UNIQUE(birth_profile_id)
);

-- 3. DESTINY PALACE INSTANCES
CREATE TABLE IF NOT EXISTS destiny_palace_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destiny_chart_id UUID NOT NULL REFERENCES destiny_charts(id) ON DELETE CASCADE,
    palace_name TEXT NOT NULL,
    position INT NOT NULL CHECK (position BETWEEN 0 AND 11),
    branch TEXT NOT NULL,
    element TEXT NOT NULL,
    stars JSONB NOT NULL DEFAULT '[]'::jsonb,
    transformations JSONB NOT NULL DEFAULT '[]'::jsonb,
    score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_chart_palace UNIQUE(destiny_chart_id, palace_name)
);

-- 4. FOUR TRANSFORMATION RULES
CREATE TABLE IF NOT EXISTS four_transformation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_stem TEXT NOT NULL,
    star_name TEXT NOT NULL,
    transformation TEXT NOT NULL CHECK (transformation IN ('Lu', 'Quan', 'Ke', 'Ji')),
    effect TEXT NOT NULL,
    weight NUMERIC(5,2) NOT NULL DEFAULT 1.00,
    source TEXT NOT NULL DEFAULT 'Traditional Zi Wei Standard',
    version TEXT NOT NULL DEFAULT '1.0',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. PERSONAL DESTINY FEATURES (Explanation & Audit)
CREATE TABLE IF NOT EXISTS personal_destiny_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destiny_chart_id UUID NOT NULL REFERENCES destiny_charts(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    feature_value JSONB NOT NULL,
    feature_type TEXT NOT NULL,
    source_engine TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. PERSONAL NUMBER DNA
CREATE TABLE IF NOT EXISTS personal_number_dna (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    birth_profile_id UUID NOT NULL REFERENCES birth_profiles(id) ON DELETE CASCADE,
    destiny_chart_id UUID NOT NULL REFERENCES destiny_charts(id) ON DELETE CASCADE,
    core_numbers INT[] NOT NULL DEFAULT '{}',
    support_numbers INT[] NOT NULL DEFAULT '{}',
    weak_numbers INT[] NOT NULL DEFAULT '{}',
    element_distribution JSONB NOT NULL DEFAULT '{}'::jsonb,
    scores_by_digit JSONB NOT NULL DEFAULT '{}'::jsonb,
    dna_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    algorithm_version TEXT NOT NULL DEFAULT 'DNA-V1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_number_dna UNIQUE(user_id)
);

-- 7. DAILY NUMBER ACTIVATION TABLE
CREATE TABLE IF NOT EXISTS daily_number_activation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_signature_id UUID NOT NULL REFERENCES daily_signatures(id) ON DELETE CASCADE,
    digit INT NOT NULL CHECK (digit BETWEEN 0 AND 9),
    personal_base_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    element_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    time_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    palace_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    star_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    transformation_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    activation_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    calculation_version TEXT NOT NULL DEFAULT 'DAILY-NUM-V1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_daily_sig_digit UNIQUE(daily_signature_id, digit)
);

-- 8. DAILY PALACE ACTIVATION TABLE
CREATE TABLE IF NOT EXISTS daily_palace_activation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_signature_id UUID NOT NULL REFERENCES daily_signatures(id) ON DELETE CASCADE,
    palace_name TEXT NOT NULL,
    base_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    time_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    element_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    star_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    transformation_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    activation_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    status TEXT NOT NULL CHECK (status IN ('LOW', 'WEAK', 'NORMAL', 'STRONG', 'VERY STRONG')),
    calculation_version TEXT NOT NULL DEFAULT 'DAILY-PALACE-V1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_daily_sig_palace UNIQUE(daily_signature_id, palace_name)
);

-- 9. DAILY STAR ACTIVATION TABLE
CREATE TABLE IF NOT EXISTS daily_star_activation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_signature_id UUID NOT NULL REFERENCES daily_signatures(id) ON DELETE CASCADE,
    star_name TEXT NOT NULL,
    palace_name TEXT NOT NULL,
    base_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    element_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    time_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    transformation_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    activation_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    calculation_version TEXT NOT NULL DEFAULT 'DAILY-STAR-V1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_four_pillars_profile ON four_pillars(birth_profile_id);
CREATE INDEX IF NOT EXISTS idx_destiny_palaces_chart ON destiny_palace_instances(destiny_chart_id);
CREATE INDEX IF NOT EXISTS idx_dna_user ON personal_number_dna(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_act_sig ON daily_number_activation(daily_signature_id);
CREATE INDEX IF NOT EXISTS idx_daily_palace_sig ON daily_palace_activation(daily_signature_id);

-- RLS POLICIES
ALTER TABLE four_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE destiny_palace_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_destiny_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_number_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_number_activation ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_palace_activation ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_star_activation ENABLE ROW LEVEL SECURITY;
