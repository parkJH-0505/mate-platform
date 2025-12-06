-- 커리큘럼 테이블
CREATE TABLE curriculums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id TEXT,  -- 비로그인 사용자용

  -- 온보딩 입력값 (커리큘럼 생성 기준)
  industry TEXT NOT NULL,
  stage TEXT NOT NULL,
  concerns TEXT[],
  goal TEXT NOT NULL,
  user_name TEXT,

  -- AI 생성 결과
  title TEXT NOT NULL,
  description TEXT,
  reasoning TEXT[],
  duration_weeks INTEGER DEFAULT 4,

  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 커리큘럼 모듈 (주차별)
CREATE TABLE curriculum_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_id UUID REFERENCES curriculums(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 모듈 내 콘텐츠
CREATE TABLE curriculum_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES curriculum_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  creator TEXT,
  duration TEXT,
  content_type TEXT DEFAULT 'video',
  thumbnail_url TEXT,
  content_url TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_curriculums_user_id ON curriculums(user_id);
CREATE INDEX idx_curriculums_session_id ON curriculums(session_id);
CREATE INDEX idx_curriculum_modules_curriculum_id ON curriculum_modules(curriculum_id);
CREATE INDEX idx_curriculum_contents_module_id ON curriculum_contents(module_id);

-- RLS 정책
ALTER TABLE curriculums ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read curriculums" ON curriculums
  FOR SELECT USING (true);
CREATE POLICY "Anyone can insert curriculums" ON curriculums
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own curriculums" ON curriculums
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can read modules" ON curriculum_modules
  FOR SELECT USING (true);
CREATE POLICY "Anyone can insert modules" ON curriculum_modules
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read contents" ON curriculum_contents
  FOR SELECT USING (true);
CREATE POLICY "Anyone can insert contents" ON curriculum_contents
  FOR INSERT WITH CHECK (true);
