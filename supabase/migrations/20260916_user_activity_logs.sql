-- ======================================================================
-- 紫微时空数字预测系统 (ZWTSP) - 全息用户行为日志与运营分析数据表
-- File: supabase/migrations/20260916_user_activity_logs.sql
-- ======================================================================

-- 1. 用户活动与审计流水表 (USER ACTIVITY LOGS)
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_name TEXT,
  event_type VARCHAR(64) NOT NULL, -- auth.login, auth.logout, auth.register, prediction.generate, prediction.save, compass.query, destiny.view, page.view
  event_label TEXT NOT NULL,       -- 人类可读描述
  page_path TEXT,                  -- 路由路径
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb, -- 设备指纹、停留时长、推演号码、彩种等
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 索引优化 (用于管理后台秒级筛选分析)
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type ON public.user_activity_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.user_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_email ON public.user_activity_logs(user_email);

-- 3. RLS 安全规则
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- 允许用户写入自身行为日志（或匿名写入会话埋点）
DROP POLICY IF EXISTS "Allow inserts for activity logs" ON public.user_activity_logs;
CREATE POLICY "Allow inserts for activity logs"
  ON public.user_activity_logs FOR INSERT
  WITH CHECK (true);

-- 管理员可读（通过 Service Role 或具有管理员权限的用户）
DROP POLICY IF EXISTS "Allow select for authenticated user own logs" ON public.user_activity_logs;
CREATE POLICY "Allow select for authenticated user own logs"
  ON public.user_activity_logs FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- 4. 扩充 user_profiles 用户档案表
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
