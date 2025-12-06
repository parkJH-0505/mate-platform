-- MATE 초기 스키마
-- Supabase SQL Editor에서 실행

-- UUID 확장 활성화 (이미 활성화되어 있을 수 있음)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users 테이블
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  profile_image TEXT,

  -- 온보딩 데이터
  onboarding_industry TEXT,
  onboarding_stage TEXT,
  onboarding_business_type TEXT,
  onboarding_concerns TEXT[],
  onboarding_goal TEXT,
  onboarding_completed_at TIMESTAMPTZ,

  -- 구독 정보
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'canceled', 'expired')),
  subscription_plan TEXT CHECK (subscription_plan IN ('monthly', 'yearly') OR subscription_plan IS NULL),
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,

  -- 메타
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Anonymous Sessions 테이블 (비로그인 온보딩용)
CREATE TABLE IF NOT EXISTS public.anonymous_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,

  -- 온보딩 데이터
  onboarding_industry TEXT,
  onboarding_stage TEXT,
  onboarding_business_type TEXT,
  onboarding_concerns TEXT[],
  onboarding_goal TEXT,
  onboarding_name TEXT,

  -- 메타
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON public.users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_anonymous_session_id ON public.anonymous_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_anonymous_expires_at ON public.anonymous_sessions(expires_at);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_sessions ENABLE ROW LEVEL SECURITY;

-- Users 정책: 본인 데이터만 접근 가능
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Anonymous Sessions 정책: 누구나 생성 가능, session_id로 조회
CREATE POLICY "Anyone can create anonymous session" ON public.anonymous_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read anonymous session by session_id" ON public.anonymous_sessions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update anonymous session" ON public.anonymous_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete anonymous session" ON public.anonymous_sessions
  FOR DELETE USING (true);

-- 만료된 세션 자동 삭제를 위한 함수 (선택사항, cron job 필요)
CREATE OR REPLACE FUNCTION delete_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.anonymous_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
