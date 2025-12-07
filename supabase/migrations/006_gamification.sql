-- =====================================================
-- Sprint 6: 게이미피케이션 테이블 (스트릭, 레벨, 뱃지, 목표)
-- =====================================================

-- 학습 스트릭 테이블
CREATE TABLE IF NOT EXISTS learning_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- 비로그인 사용자용

  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_streak UNIQUE (user_id),
  CONSTRAINT unique_session_streak UNIQUE (session_id),
  CONSTRAINT streak_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- 일별 활동 기록 (스트릭 계산용)
CREATE TABLE IF NOT EXISTS daily_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,

  activity_date DATE NOT NULL,
  contents_completed INTEGER DEFAULT 0,
  learning_minutes INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_daily UNIQUE (user_id, activity_date),
  CONSTRAINT unique_session_daily UNIQUE (session_id, activity_date)
);

-- 사용자 레벨/XP 테이블
CREATE TABLE IF NOT EXISTS user_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,

  level INTEGER DEFAULT 1,
  current_xp INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_level UNIQUE (user_id),
  CONSTRAINT unique_session_level UNIQUE (session_id)
);

-- 뱃지 정의 테이블
CREATE TABLE IF NOT EXISTS badge_definitions (
  id TEXT PRIMARY KEY, -- 'first_content', 'streak_7', etc.
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  category TEXT DEFAULT 'achievement', -- 'achievement', 'streak', 'milestone'
  sort_order INTEGER DEFAULT 0
);

-- 기본 뱃지 정의 삽입
INSERT INTO badge_definitions (id, name, description, icon, category, sort_order) VALUES
  ('first_content', '첫 발걸음', '첫 번째 콘텐츠를 완료했습니다', '👣', 'achievement', 1),
  ('streak_7', '꾸준함의 힘', '7일 연속 학습을 달성했습니다', '🔥', 'streak', 2),
  ('streak_30', '불굴의 의지', '30일 연속 학습을 달성했습니다', '💪', 'streak', 3),
  ('curriculum_complete', '커리큘럼 마스터', '커리큘럼을 100% 완료했습니다', '🎓', 'milestone', 4),
  ('contents_100', '열정의 학습자', '총 100개 콘텐츠를 완료했습니다', '⭐', 'milestone', 5),
  ('first_subscription', '프리미엄 멤버', '첫 구독을 시작했습니다', '💎', 'achievement', 6),
  ('early_bird', '얼리버드', '오전 6시 전에 학습을 완료했습니다', '🌅', 'achievement', 7),
  ('night_owl', '올빼미', '자정 이후에 학습을 완료했습니다', '🦉', 'achievement', 8),
  ('weekend_warrior', '주말 전사', '주말에 3개 이상 콘텐츠를 완료했습니다', '⚔️', 'achievement', 9),
  ('goal_achiever', '목표 달성자', '주간 목표를 달성했습니다', '🎯', 'achievement', 10)
ON CONFLICT (id) DO NOTHING;

-- 사용자 획득 뱃지 테이블
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,

  badge_id TEXT REFERENCES badge_definitions(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id),
  CONSTRAINT unique_session_badge UNIQUE (session_id, badge_id)
);

-- 주간 목표 테이블
CREATE TABLE IF NOT EXISTS weekly_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,

  week_start DATE NOT NULL, -- 해당 주의 월요일
  target_contents INTEGER DEFAULT 5,
  completed_contents INTEGER DEFAULT 0,

  is_achieved BOOLEAN DEFAULT FALSE,
  achieved_at TIMESTAMPTZ,
  bonus_xp_claimed BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_weekly_goal UNIQUE (user_id, week_start),
  CONSTRAINT unique_session_weekly_goal UNIQUE (session_id, week_start)
);

-- 레벨 정의 테이블
CREATE TABLE IF NOT EXISTS level_definitions (
  level INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  required_xp INTEGER NOT NULL
);

-- 레벨 정의 삽입
INSERT INTO level_definitions (level, name, icon, required_xp) VALUES
  (1, '새싹 창업가', '🌱', 0),
  (2, '성장하는 창업가', '🌿', 100),
  (3, '도전하는 창업가', '🌳', 300),
  (4, '성취하는 창업가', '🎯', 600),
  (5, '전문 창업가', '🚀', 1000),
  (6, '마스터 창업가', '👑', 1500)
ON CONFLICT (level) DO NOTHING;

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_streaks_user ON learning_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_session ON learning_streaks(session_id);
CREATE INDEX IF NOT EXISTS idx_daily_user ON daily_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_session ON daily_activities(session_id);
CREATE INDEX IF NOT EXISTS idx_daily_date ON daily_activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_levels_user ON user_levels(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user ON weekly_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_week ON weekly_goals(week_start);

-- RLS (Row Level Security)
ALTER TABLE learning_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;

-- 사용자 자신의 데이터만 조회 가능
CREATE POLICY "Users can view own streaks" ON learning_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own daily_activities" ON daily_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own levels" ON user_levels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON weekly_goals
  FOR SELECT USING (auth.uid() = user_id);

-- 서비스 역할 정책 (API에서 사용)
CREATE POLICY "Service can manage streaks" ON learning_streaks FOR ALL USING (true);
CREATE POLICY "Service can manage daily_activities" ON daily_activities FOR ALL USING (true);
CREATE POLICY "Service can manage levels" ON user_levels FOR ALL USING (true);
CREATE POLICY "Service can manage badges" ON user_badges FOR ALL USING (true);
CREATE POLICY "Service can manage goals" ON weekly_goals FOR ALL USING (true);

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_learning_streaks_updated_at
  BEFORE UPDATE ON learning_streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_levels_updated_at
  BEFORE UPDATE ON user_levels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_goals_updated_at
  BEFORE UPDATE ON weekly_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
