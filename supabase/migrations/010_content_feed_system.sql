-- =====================================================
-- Migration 010: Content Feed System
-- Phase 1.5: 스마트 피드 + 콘텐츠 탐색 시스템
-- =====================================================

-- =====================================================
-- 1. curriculum_contents 테이블 확장
-- =====================================================

-- 콘텐츠 분류 필드 추가
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 2;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS industry_tags TEXT[] DEFAULT '{}';

-- 인기도/추천 관련 필드
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS save_count INTEGER DEFAULT 0;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS featured_reason TEXT;

-- 메타데이터 확장
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS preview_text TEXT;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 기존 duration 필드에서 duration_minutes 자동 변환 (예: "15분" -> 15)
UPDATE curriculum_contents
SET duration_minutes = CAST(REGEXP_REPLACE(duration, '[^0-9]', '', 'g') AS INTEGER)
WHERE duration IS NOT NULL AND duration_minutes IS NULL AND duration ~ '[0-9]';

-- level 제약 조건 추가
ALTER TABLE curriculum_contents DROP CONSTRAINT IF EXISTS curriculum_contents_level_check;
ALTER TABLE curriculum_contents ADD CONSTRAINT curriculum_contents_level_check CHECK (level BETWEEN 1 AND 5);

-- =====================================================
-- 2. user_saved_contents 테이블 (콘텐츠 저장)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_saved_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  content_id UUID REFERENCES curriculum_contents(id) ON DELETE CASCADE NOT NULL,

  folder TEXT DEFAULT 'default',
  notes TEXT,

  saved_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_or_session_save CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- 중복 저장 방지 인덱스
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_save
  ON user_saved_contents(user_id, content_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_session_save
  ON user_saved_contents(session_id, content_id)
  WHERE session_id IS NOT NULL;

-- 조회용 인덱스
CREATE INDEX IF NOT EXISTS idx_saved_contents_user ON user_saved_contents(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_contents_session ON user_saved_contents(session_id);
CREATE INDEX IF NOT EXISTS idx_saved_contents_content ON user_saved_contents(content_id);
CREATE INDEX IF NOT EXISTS idx_saved_contents_date ON user_saved_contents(saved_at DESC);

-- =====================================================
-- 3. user_content_likes 테이블 (좋아요)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_content_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  content_id UUID REFERENCES curriculum_contents(id) ON DELETE CASCADE NOT NULL,

  liked_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_or_session_like CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- 중복 좋아요 방지 인덱스
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_like
  ON user_content_likes(user_id, content_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_session_like
  ON user_content_likes(session_id, content_id)
  WHERE session_id IS NOT NULL;

-- 조회용 인덱스
CREATE INDEX IF NOT EXISTS idx_content_likes_user ON user_content_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_content_likes_session ON user_content_likes(session_id);
CREATE INDEX IF NOT EXISTS idx_content_likes_content ON user_content_likes(content_id);

-- =====================================================
-- 4. user_content_views 테이블 (조회 기록)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_content_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  content_id UUID REFERENCES curriculum_contents(id) ON DELETE CASCADE NOT NULL,

  view_duration_seconds INTEGER DEFAULT 0,
  completion_rate NUMERIC(5,2) DEFAULT 0,

  viewed_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_or_session_view CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- 조회용 인덱스
CREATE INDEX IF NOT EXISTS idx_content_views_user ON user_content_views(user_id);
CREATE INDEX IF NOT EXISTS idx_content_views_session ON user_content_views(session_id);
CREATE INDEX IF NOT EXISTS idx_content_views_content ON user_content_views(content_id);
CREATE INDEX IF NOT EXISTS idx_content_views_date ON user_content_views(viewed_at DESC);

-- =====================================================
-- 5. curriculum_contents 추가 인덱스
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_contents_category ON curriculum_contents(category);
CREATE INDEX IF NOT EXISTS idx_contents_level ON curriculum_contents(level);
CREATE INDEX IF NOT EXISTS idx_contents_popular ON curriculum_contents(is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_contents_featured ON curriculum_contents(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_contents_active ON curriculum_contents(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_contents_view_count ON curriculum_contents(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_contents_like_count ON curriculum_contents(like_count DESC);

-- =====================================================
-- 6. 트리거 함수: 카운터 자동 업데이트
-- =====================================================

-- 좋아요 카운트 업데이트
CREATE OR REPLACE FUNCTION update_content_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE curriculum_contents SET like_count = like_count + 1 WHERE id = NEW.content_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE curriculum_contents SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.content_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_content_like_count ON user_content_likes;
CREATE TRIGGER trigger_update_content_like_count
  AFTER INSERT OR DELETE ON user_content_likes
  FOR EACH ROW EXECUTE FUNCTION update_content_like_count();

-- 저장 카운트 업데이트
CREATE OR REPLACE FUNCTION update_content_save_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE curriculum_contents SET save_count = save_count + 1 WHERE id = NEW.content_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE curriculum_contents SET save_count = GREATEST(save_count - 1, 0) WHERE id = OLD.content_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_content_save_count ON user_saved_contents;
CREATE TRIGGER trigger_update_content_save_count
  AFTER INSERT OR DELETE ON user_saved_contents
  FOR EACH ROW EXECUTE FUNCTION update_content_save_count();

-- 조회수 업데이트
CREATE OR REPLACE FUNCTION update_content_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE curriculum_contents SET view_count = view_count + 1 WHERE id = NEW.content_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_content_view_count ON user_content_views;
CREATE TRIGGER trigger_update_content_view_count
  AFTER INSERT ON user_content_views
  FOR EACH ROW EXECUTE FUNCTION update_content_view_count();

-- curriculum_contents updated_at 자동 갱신
CREATE OR REPLACE FUNCTION update_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_content_updated_at ON curriculum_contents;
CREATE TRIGGER trigger_content_updated_at
  BEFORE UPDATE ON curriculum_contents FOR EACH ROW
  EXECUTE FUNCTION update_content_updated_at();

-- =====================================================
-- 7. RLS 정책
-- =====================================================

-- user_saved_contents
ALTER TABLE user_saved_contents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own saves" ON user_saved_contents;
CREATE POLICY "Users can view own saves" ON user_saved_contents
  FOR SELECT USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

DROP POLICY IF EXISTS "Users can insert own saves" ON user_saved_contents;
CREATE POLICY "Users can insert own saves" ON user_saved_contents
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

DROP POLICY IF EXISTS "Users can delete own saves" ON user_saved_contents;
CREATE POLICY "Users can delete own saves" ON user_saved_contents
  FOR DELETE USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- user_content_likes
ALTER TABLE user_content_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own likes" ON user_content_likes;
CREATE POLICY "Users can view own likes" ON user_content_likes
  FOR SELECT USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

DROP POLICY IF EXISTS "Users can insert own likes" ON user_content_likes;
CREATE POLICY "Users can insert own likes" ON user_content_likes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

DROP POLICY IF EXISTS "Users can delete own likes" ON user_content_likes;
CREATE POLICY "Users can delete own likes" ON user_content_likes
  FOR DELETE USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- user_content_views
ALTER TABLE user_content_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own views" ON user_content_views;
CREATE POLICY "Users can view own views" ON user_content_views
  FOR SELECT USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

DROP POLICY IF EXISTS "Users can insert own views" ON user_content_views;
CREATE POLICY "Users can insert own views" ON user_content_views
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- =====================================================
-- 8. 샘플 데이터: 기존 콘텐츠에 분류 정보 추가
-- =====================================================

-- 카테고리 기본값 설정 (title 기반 추정)
UPDATE curriculum_contents SET category = 'legal'
WHERE category IS NULL AND (
  title ILIKE '%사업자%' OR title ILIKE '%법인%' OR title ILIKE '%법률%' OR
  title ILIKE '%세금%' OR title ILIKE '%등록%' OR title ILIKE '%계약%'
);

UPDATE curriculum_contents SET category = 'mindset'
WHERE category IS NULL AND (
  title ILIKE '%마인드%' OR title ILIKE '%동기%' OR title ILIKE '%멘탈%' OR
  title ILIKE '%성공%' OR title ILIKE '%실패%' OR title ILIKE '%도전%'
);

UPDATE curriculum_contents SET category = 'idea'
WHERE category IS NULL AND (
  title ILIKE '%아이디어%' OR title ILIKE '%발굴%' OR title ILIKE '%브레인%' OR
  title ILIKE '%창의%' OR title ILIKE '%기획%'
);

UPDATE curriculum_contents SET category = 'validation'
WHERE category IS NULL AND (
  title ILIKE '%검증%' OR title ILIKE '%시장%' OR title ILIKE '%고객%' OR
  title ILIKE '%인터뷰%' OR title ILIKE '%조사%' OR title ILIKE '%분석%'
);

UPDATE curriculum_contents SET category = 'mvp'
WHERE category IS NULL AND (
  title ILIKE '%MVP%' OR title ILIKE '%개발%' OR title ILIKE '%프로토%' OR
  title ILIKE '%제품%' OR title ILIKE '%서비스%' OR title ILIKE '%런칭%'
);

UPDATE curriculum_contents SET category = 'growth'
WHERE category IS NULL AND (
  title ILIKE '%성장%' OR title ILIKE '%스케일%' OR title ILIKE '%확장%' OR
  title ILIKE '%마케팅%' OR title ILIKE '%영업%'
);

UPDATE curriculum_contents SET category = 'case_study'
WHERE category IS NULL AND (
  title ILIKE '%사례%' OR title ILIKE '%케이스%' OR title ILIKE '%스토리%' OR
  title ILIKE '%인터뷰%' OR title ILIKE '%성공%'
);

UPDATE curriculum_contents SET category = 'investment'
WHERE category IS NULL AND (
  title ILIKE '%투자%' OR title ILIKE '%IR%' OR title ILIKE '%펀딩%' OR
  title ILIKE '%VC%' OR title ILIKE '%엔젤%' OR title ILIKE '%피칭%'
);

UPDATE curriculum_contents SET category = 'government'
WHERE category IS NULL AND (
  title ILIKE '%정부%' OR title ILIKE '%지원%' OR title ILIKE '%사업%' OR
  title ILIKE '%공모%' OR title ILIKE '%보조금%'
);

-- 분류되지 않은 콘텐츠 기본 카테고리
UPDATE curriculum_contents SET category = 'mindset'
WHERE category IS NULL;

-- 레벨 기본값 (order_index 기반 추정)
UPDATE curriculum_contents SET level = 1 WHERE order_index <= 2 AND level = 2;
UPDATE curriculum_contents SET level = 3 WHERE order_index >= 5 AND level = 2;

-- 인기 콘텐츠 표시 (임시 랜덤)
UPDATE curriculum_contents SET is_popular = true
WHERE id IN (
  SELECT id FROM curriculum_contents
  ORDER BY RANDOM()
  LIMIT 5
);

-- 추천 콘텐츠 표시
UPDATE curriculum_contents SET
  is_featured = true,
  featured_reason = '이번 주 추천 콘텐츠'
WHERE id IN (
  SELECT id FROM curriculum_contents
  WHERE is_popular = false
  ORDER BY RANDOM()
  LIMIT 3
);

-- =====================================================
-- 완료
-- =====================================================
