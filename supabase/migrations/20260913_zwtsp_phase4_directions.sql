-- =============================================================================
-- ZWTSP Phase 4 Migration: Direction, Nine Palaces & Personal Luck Compass
-- File: supabase/migrations/20260913_zwtsp_phase4_directions.sql
-- =============================================================================

-- 1. Directions Dimension Table
CREATE TABLE IF NOT EXISTS public.directions (
    code VARCHAR(10) PRIMARY KEY, -- 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'
    name_zh VARCHAR(20) NOT NULL,
    name_en VARCHAR(20) NOT NULL,
    degree_center NUMERIC(5, 1) NOT NULL,
    degree_min NUMERIC(5, 1) NOT NULL,
    degree_max NUMERIC(5, 1) NOT NULL,
    bagua_name VARCHAR(10) NOT NULL,
    element VARCHAR(10) NOT NULL,
    luoshu_number INTEGER NOT NULL,
    earthly_branches TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Directions Table
INSERT INTO public.directions (code, name_zh, name_en, degree_center, degree_min, degree_max, bagua_name, element, luoshu_number, earthly_branches)
VALUES
    ('N',  '正北', 'North',     0.0, 337.5,  22.5, '坎', '水', 1, ARRAY['子']),
    ('NE', '东北', 'North-East',45.0,  22.5,  67.5, '艮', '土', 8, ARRAY['丑', '寅']),
    ('E',  '正东', 'East',      90.0,  67.5, 112.5, '震', '木', 3, ARRAY['卯']),
    ('SE', '东南', 'South-East',135.0, 112.5, 157.5, '巽', '木', 4, ARRAY['辰', '巳']),
    ('S',  '正南', 'South',     180.0, 157.5, 202.5, '离', '火', 9, ARRAY['午']),
    ('SW', '西南', 'South-West',225.0, 202.5, 247.5, '坤', '土', 2, ARRAY['未', '申']),
    ('W',  '正西', 'West',      270.0, 247.5, 292.5, '兑', '金', 7, ARRAY['酉']),
    ('NW', '西北', 'North-West',315.0, 292.5, 337.5, '乾', '金', 6, ARRAY['戌', '亥'])
ON CONFLICT (code) DO UPDATE 
SET name_zh = EXCLUDED.name_zh,
    degree_center = EXCLUDED.degree_center,
    degree_min = EXCLUDED.degree_min,
    degree_max = EXCLUDED.degree_max,
    bagua_name = EXCLUDED.bagua_name,
    element = EXCLUDED.element,
    luoshu_number = EXCLUDED.luoshu_number,
    earthly_branches = EXCLUDED.earthly_branches;

-- 2. Nine Palaces Table
CREATE TABLE IF NOT EXISTS public.nine_palaces (
    palace_number INTEGER PRIMARY KEY, -- 1 to 9
    name_zh VARCHAR(20) NOT NULL,
    direction_code VARCHAR(10) NULL REFERENCES public.directions(code),
    default_element VARCHAR(10) NOT NULL,
    trigram VARCHAR(10) NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.nine_palaces (palace_number, name_zh, direction_code, default_element, trigram)
VALUES
    (1, '坎一宫', 'N',  '水', '☵'),
    (2, '坤二宫', 'SW', '土', '☷'),
    (3, '震三宫', 'E',  '木', '☳'),
    (4, '巽四宫', 'SE', '木', '☴'),
    (5, '中五宫', NULL, '土', NULL),
    (6, '乾六宫', 'NW', '金', '☰'),
    (7, '兑七宫', 'W',  '金', '☱'),
    (8, '艮八宫', 'NE', '土', '☶'),
    (9, '离九宫', 'S',  '火', '☲')
ON CONFLICT (palace_number) DO UPDATE
SET name_zh = EXCLUDED.name_zh,
    direction_code = EXCLUDED.direction_code,
    default_element = EXCLUDED.default_element,
    trigram = EXCLUDED.trigram;

-- 3. Direction Scoring Rules
CREATE TABLE IF NOT EXISTS public.direction_scoring_rules (
    rule_key VARCHAR(50) PRIMARY KEY,
    category VARCHAR(30) NOT NULL, -- 'personal' or 'daily'
    weight NUMERIC(4, 3) NOT NULL,
    description TEXT NOT NULL
);

INSERT INTO public.direction_scoring_rules (rule_key, category, weight, description)
VALUES
    ('personal_five_elements',     'personal', 0.300, '先天个人五行喜忌与方位五行生克权重'),
    ('personal_number_dna',        'personal', 0.200, '先天数字DNA与方位洛书/地支数理共振权重'),
    ('personal_life_palace',       'personal', 0.150, '先天紫微命宫地支与八方地支映射权重'),
    ('personal_body_palace',       'personal', 0.100, '先天身宫地支与八方地支映射权重'),
    ('personal_luoshu_affinity',   'personal', 0.100, '洛书本命卦/数理共振权重'),
    ('personal_bagua_alignment',   'personal', 0.100, '后天八卦与命局阴阳相生权重'),
    ('personal_bureau_element',    'personal', 0.050, '五行局局象属性加成权重'),
    ('daily_personal_direction',   'daily',    0.350, '先天个人方位兼容性基底权重'),
    ('daily_element_interaction',  'daily',    0.200, '当日日柱五行与方位五行生克权重'),
    ('daily_activated_digits',     'daily',    0.150, '当日激活数字与方位数理共振权重'),
    ('daily_palace_resonance',     'daily',    0.150, '当日流日紫微命宫/禄存宫位方位权重'),
    ('daily_time_windows',         'daily',    0.100, '当日吉时时辰地支与方位协同权重'),
    ('daily_star_transformations', 'daily',    0.050, '当日流日四化与主星感应权重')
ON CONFLICT (rule_key) DO UPDATE
SET weight = EXCLUDED.weight,
    description = EXCLUDED.description;

-- 4. Personal Direction Profiles (Static Personal Layer)
CREATE TABLE IF NOT EXISTS public.personal_direction_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    birth_profile_id UUID REFERENCES public.birth_profiles(id) ON DELETE CASCADE,
    direction_scores JSONB NOT NULL, -- Map of { 'N': score, 'NE': score, ... }
    best_direction VARCHAR(10) NOT NULL REFERENCES public.directions(code),
    secondary_direction VARCHAR(10) NOT NULL REFERENCES public.directions(code),
    weak_direction VARCHAR(10) NOT NULL REFERENCES public.directions(code),
    calculation_trace JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_personal_direction UNIQUE (user_id, birth_profile_id)
);

-- 5. Daily Direction Scores (Dynamic Day Layer)
CREATE TABLE IF NOT EXISTS public.daily_direction_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    daily_scores JSONB NOT NULL, -- { 'N': { score, tier, breakdown }, ... }
    top_direction VARCHAR(10) NOT NULL REFERENCES public.directions(code),
    secondary_direction VARCHAR(10) NOT NULL REFERENCES public.directions(code),
    is_contested BOOLEAN NOT NULL DEFAULT FALSE,
    contested_reason TEXT,
    confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 85.00,
    consistency_score NUMERIC(5, 2) NOT NULL DEFAULT 80.00,
    spatial_number_matrix JSONB NOT NULL, -- 8x10 matrix [direction][digit] => affinity
    calculation_trace JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_daily_direction UNIQUE (user_id, date)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_personal_direction_user ON public.personal_direction_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_direction_user_date ON public.daily_direction_scores(user_id, date);

-- Enable RLS
ALTER TABLE public.directions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nine_palaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direction_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_direction_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_direction_scores ENABLE ROW LEVEL SECURITY;

-- Read-only policies for public/reference tables
CREATE POLICY "Public read directions" ON public.directions FOR SELECT USING (true);
CREATE POLICY "Public read nine_palaces" ON public.nine_palaces FOR SELECT USING (true);
CREATE POLICY "Public read direction_scoring_rules" ON public.direction_scoring_rules FOR SELECT USING (true);

-- User-scoped policies for profiles and scores
CREATE POLICY "User can view own personal direction" ON public.personal_direction_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "User can insert own personal direction" ON public.personal_direction_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update own personal direction" ON public.personal_direction_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "User can view own daily direction scores" ON public.daily_direction_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "User can insert own daily direction scores" ON public.daily_direction_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update own daily direction scores" ON public.daily_direction_scores
    FOR UPDATE USING (auth.uid() = user_id);
