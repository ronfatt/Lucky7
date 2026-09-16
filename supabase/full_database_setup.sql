-- ======================================================================
-- 紫微时空数字预测系统 (ZWTSP) V1.0 - Supabase 全量数据库架构与初始化脚本
-- File: supabase/full_database_setup.sql
-- 整合包含：
-- 1. 会员系统 (auth.users 关联 user_profiles、自动同步触发器、RLS 安全规则)
-- 2. 6 大经典古籍易理文库 (classical_literature、章节、引文、飞星四化表)
-- 3. 新马七大博彩历史出奖库 (lottery_draws)
-- 4. 会员心水收藏 (saved_predictions) 与推演复盘账本 (prediction_ledger)
-- 5. 八卦洛书与十天干十二地支数理规则库 (numerology_rules)
-- ======================================================================

-- 开启扩展
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------
-- 1. 会员与命盘资料表 (USER PROFILES)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT NOT NULL DEFAULT '命主',
  gender TEXT NOT NULL DEFAULT 'male' CHECK (gender IN ('male', 'female', 'other')),
  birth_date DATE NOT NULL DEFAULT '1990-05-18',
  birth_time TIME NOT NULL DEFAULT '14:30',
  birth_hour INT NOT NULL DEFAULT 14,
  birth_minute INT NOT NULL DEFAULT 30,
  birth_place TEXT DEFAULT 'Kuala Lumpur',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kuala_Lumpur',
  calendar_type TEXT NOT NULL DEFAULT 'gregorian' CHECK (calendar_type IN ('gregorian', 'lunar')),
  membership_tier TEXT NOT NULL DEFAULT 'FREE' CHECK (membership_tier IN ('FREE', 'PRO', 'VIP')),
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 开启 RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 会员 RLS 策略：仅本人能查看与修改自己的 Profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 自动触发器：当新会员注册时，自动在 user_profiles 建立初始命盘
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------
-- 2. 经典古籍易理资料库 (CLASSICAL LITERATURE)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classical_literature (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(128) NOT NULL,
  lineage VARCHAR(64) NOT NULL,
  lineage_name VARCHAR(64) NOT NULL,
  page_count INT NOT NULL DEFAULT 0,
  file_name VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  core_theories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.literature_chapters (
  id VARCHAR(64) PRIMARY KEY,
  literature_id VARCHAR(64) REFERENCES public.classical_literature(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  key_quotes TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.literature_citations (
  id VARCHAR(64) PRIMARY KEY,
  source_literature_id VARCHAR(64) REFERENCES public.classical_literature(id) ON DELETE CASCADE,
  chapter_title VARCHAR(255),
  original_quote TEXT NOT NULL,
  metaphysical_interpretation TEXT NOT NULL,
  applied_aspect VARCHAR(32) NOT NULL,
  related_digits INT[] DEFAULT '{}',
  related_elements TEXT[] DEFAULT '{}',
  related_transformations TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.flying_star_sihua_patterns (
  id VARCHAR(64) PRIMARY KEY,
  from_palace VARCHAR(32) NOT NULL,
  sihua_type VARCHAR(16) NOT NULL,
  sihua_name VARCHAR(16) NOT NULL,
  to_palace VARCHAR(32) NOT NULL,
  canonical_meaning TEXT NOT NULL,
  number_implication TEXT NOT NULL,
  source_literature VARCHAR(128) NOT NULL
);

-- 所有人只读访问经典古籍
ALTER TABLE public.classical_literature ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.literature_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.literature_citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flying_star_sihua_patterns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view classical literature" ON public.classical_literature;
CREATE POLICY "Public can view classical literature" ON public.classical_literature FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view chapters" ON public.literature_chapters;
CREATE POLICY "Public can view chapters" ON public.literature_chapters FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view citations" ON public.literature_citations;
CREATE POLICY "Public can view citations" ON public.literature_citations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view sihua" ON public.flying_star_sihua_patterns;
CREATE POLICY "Public can view sihua" ON public.flying_star_sihua_patterns FOR SELECT USING (true);

-- ----------------------------------------------------------------------
-- 3. 新马七大博彩出奖数据库 (LOTTERY DRAWS)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lottery_draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator VARCHAR(32) NOT NULL,
  draw_date DATE NOT NULL,
  draw_no VARCHAR(32),
  prize_1st VARCHAR(8) NOT NULL,
  prize_2nd VARCHAR(8) NOT NULL,
  prize_3rd VARCHAR(8) NOT NULL,
  special_prizes TEXT[] NOT NULL DEFAULT '{}',
  consolation_prizes TEXT[] NOT NULL DEFAULT '{}',
  all_numbers TEXT[] NOT NULL DEFAULT '{}',
  day_stem_branch VARCHAR(16),
  dominant_element VARCHAR(16),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_operator_date_draw UNIQUE (operator, draw_date)
);

ALTER TABLE public.lottery_draws ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view lottery draws" ON public.lottery_draws;
CREATE POLICY "Public can view lottery draws" ON public.lottery_draws FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_draws_operator_date ON public.lottery_draws(operator, draw_date DESC);
CREATE INDEX IF NOT EXISTS idx_draws_all_numbers ON public.lottery_draws USING gin(all_numbers);

-- ----------------------------------------------------------------------
-- 4. 会员心水收藏 (SAVED PREDICTIONS)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  number VARCHAR(8) NOT NULL,
  source_type VARCHAR(32) NOT NULL,
  source_title_zh VARCHAR(64) NOT NULL,
  date DATE NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.saved_predictions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own saved predictions" ON public.saved_predictions;
CREATE POLICY "Users can manage own saved predictions"
  ON public.saved_predictions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------
-- 5. 会员推演复盘账本 (PREDICTION LEDGER)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prediction_ledger (
  id VARCHAR(64) PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  day_stem_branch VARCHAR(16) NOT NULL,
  mother_code VARCHAR(8) NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  windfall_score NUMERIC(5,2),
  windfall_suitability VARCHAR(32),
  has_hit BOOLEAN NOT NULL DEFAULT false,
  hit_type VARCHAR(32) DEFAULT 'NONE',
  hit_tier VARCHAR(64),
  hit_operator VARCHAR(64),
  hit_date VARCHAR(32),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.prediction_ledger ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own ledger" ON public.prediction_ledger;
CREATE POLICY "Users can manage own ledger"
  ON public.prediction_ledger FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------
-- 6. 河洛九宫数理规则库 (NUMEROLOGY RULES)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.numerology_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  input_value TEXT NOT NULL,
  output_value TEXT NOT NULL,
  weight NUMERIC(3,2) NOT NULL DEFAULT 1.0,
  version TEXT NOT NULL DEFAULT '1.0',
  source TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.numerology_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view numerology rules" ON public.numerology_rules;
CREATE POLICY "Public can view numerology rules" ON public.numerology_rules FOR SELECT USING (true);

-- ----------------------------------------------------------------------
-- 7. 全息用户行为日志与运营分析数据表 (USER ACTIVITY LOGS & TELEMETRY)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_name TEXT,
  event_type VARCHAR(64) NOT NULL, -- auth.login, auth.logout, auth.register, prediction.generate, prediction.save, compass.query, destiny.view, page.view
  event_label TEXT NOT NULL,       -- 人类可读描述，如 '用户登录系统'、'推演今日四位数 [8823]'
  page_path TEXT,                  -- 路由路径
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb, -- 设备指纹、停留时长、推演号码、彩种等
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type ON public.user_activity_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.user_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_email ON public.user_activity_logs(user_email);

ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow inserts for activity logs" ON public.user_activity_logs;
CREATE POLICY "Allow inserts for activity logs"
  ON public.user_activity_logs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select for authenticated user own logs" ON public.user_activity_logs;
CREATE POLICY "Allow select for authenticated user own logs"
  ON public.user_activity_logs FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- 扩充 user_profiles 统计字段
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='last_login_at') THEN
    ALTER TABLE public.user_profiles ADD COLUMN last_login_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='last_logout_at') THEN
    ALTER TABLE public.user_profiles ADD COLUMN last_logout_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='login_count') THEN
    ALTER TABLE public.user_profiles ADD COLUMN login_count INT NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='total_actions') THEN
    ALTER TABLE public.user_profiles ADD COLUMN total_actions INT NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='last_device') THEN
    ALTER TABLE public.user_profiles ADD COLUMN last_device TEXT;
  END IF;
END $$;
