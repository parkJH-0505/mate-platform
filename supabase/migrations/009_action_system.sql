-- =============================================
-- Sprint 09: 실행 기반 경험 시스템 - Phase 1
-- =============================================

-- =============================================
-- 1. 실행 미션 정의 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 콘텐츠 연결 (선택적)
  content_id UUID REFERENCES curriculum_contents(id) ON DELETE SET NULL,
  module_id UUID REFERENCES curriculum_modules(id) ON DELETE SET NULL,

  -- 미션 정보
  title TEXT NOT NULL,
  description TEXT,
  instruction TEXT,

  -- 미션 유형
  type TEXT NOT NULL CHECK (type IN ('text', 'checklist', 'file', 'link', 'number')),
  checklist_items JSONB DEFAULT '[]',

  -- 메타
  estimated_minutes INTEGER DEFAULT 15,
  difficulty INTEGER DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
  is_required BOOLEAN DEFAULT false,

  -- 힌트/예시
  tips TEXT[],
  example_submission TEXT,

  -- 순서
  order_index INTEGER DEFAULT 0,

  -- 활성화
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. 사용자 미션 수행 기록 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  action_id UUID REFERENCES actions(id) ON DELETE CASCADE NOT NULL,

  -- 제출 내용 (유형별)
  submission_type TEXT,
  submission_text TEXT,
  submission_url TEXT,
  submission_number NUMERIC,
  submission_file_url TEXT,
  checklist_progress JSONB DEFAULT '{}',

  -- 상태
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'completed')),

  -- 시간 추적
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  actual_minutes INTEGER,

  -- 메모
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_actions_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- =============================================
-- 3. 오늘의 플랜 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS daily_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  plan_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- 플랜 구성
  items JSONB NOT NULL DEFAULT '[]',
  -- 예: [{ type: 'content'|'action', id: uuid, order: 1, status: 'pending'|'completed', title: '...' }]

  estimated_minutes INTEGER DEFAULT 20,
  actual_minutes INTEGER,

  -- 상태
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'skipped')),
  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT daily_plans_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- 유니크 제약 (user_id + plan_date 또는 session_id + plan_date)
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_plans_user_date
  ON daily_plans(user_id, plan_date) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_plans_session_date
  ON daily_plans(session_id, plan_date) WHERE session_id IS NOT NULL;

-- =============================================
-- 4. 성장 기록 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS growth_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,

  -- 기록 유형
  log_type TEXT NOT NULL CHECK (log_type IN (
    'content_completed',
    'action_submitted',
    'action_completed',
    'milestone_achieved',
    'note',
    'ai_insight',
    'streak',
    'plan_completed'
  )),

  -- 참조
  reference_id UUID,
  reference_type TEXT,

  -- 표시 정보
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📝',

  -- 메타데이터
  metadata JSONB DEFAULT '{}',

  -- 시간
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT growth_logs_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- =============================================
-- 5. 인덱스 생성
-- =============================================

-- actions 인덱스
CREATE INDEX IF NOT EXISTS idx_actions_content ON actions(content_id);
CREATE INDEX IF NOT EXISTS idx_actions_module ON actions(module_id);
CREATE INDEX IF NOT EXISTS idx_actions_active ON actions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_actions_type ON actions(type);

-- user_actions 인덱스
CREATE INDEX IF NOT EXISTS idx_user_actions_user ON user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_session ON user_actions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_action ON user_actions(action_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_status ON user_actions(status);
CREATE INDEX IF NOT EXISTS idx_user_actions_user_action ON user_actions(user_id, action_id);

-- daily_plans 인덱스
CREATE INDEX IF NOT EXISTS idx_daily_plans_user ON daily_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_plans_session ON daily_plans(session_id);
CREATE INDEX IF NOT EXISTS idx_daily_plans_date ON daily_plans(plan_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_plans_status ON daily_plans(status);

-- growth_logs 인덱스
CREATE INDEX IF NOT EXISTS idx_growth_logs_user ON growth_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_logs_session ON growth_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_growth_logs_date ON growth_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_growth_logs_type ON growth_logs(log_type);

-- =============================================
-- 6. RLS 정책
-- =============================================

-- actions: 활성화된 미션은 누구나 읽기 가능
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active actions" ON actions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage actions" ON actions
  FOR ALL USING (auth.role() = 'service_role');

-- user_actions: 본인 데이터만 접근
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own user_actions" ON user_actions
  FOR SELECT USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

CREATE POLICY "Users can insert own user_actions" ON user_actions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can update own user_actions" ON user_actions
  FOR UPDATE USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

-- daily_plans: 본인 데이터만 접근
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily_plans" ON daily_plans
  FOR SELECT USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

CREATE POLICY "Users can insert own daily_plans" ON daily_plans
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can update own daily_plans" ON daily_plans
  FOR UPDATE USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

-- growth_logs: 본인 데이터만 접근
ALTER TABLE growth_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own growth_logs" ON growth_logs
  FOR SELECT USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

CREATE POLICY "Users can insert own growth_logs" ON growth_logs
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- =============================================
-- 7. 트리거 함수
-- =============================================

-- updated_at 자동 갱신 함수 (재사용)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- actions updated_at 트리거
DROP TRIGGER IF EXISTS trigger_actions_updated_at ON actions;
CREATE TRIGGER trigger_actions_updated_at
  BEFORE UPDATE ON actions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- user_actions updated_at 트리거
DROP TRIGGER IF EXISTS trigger_user_actions_updated_at ON user_actions;
CREATE TRIGGER trigger_user_actions_updated_at
  BEFORE UPDATE ON user_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- daily_plans updated_at 트리거
DROP TRIGGER IF EXISTS trigger_daily_plans_updated_at ON daily_plans;
CREATE TRIGGER trigger_daily_plans_updated_at
  BEFORE UPDATE ON daily_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 8. 미션 완료 시 성장 로그 자동 생성 트리거
-- =============================================

CREATE OR REPLACE FUNCTION log_action_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- 상태가 completed로 변경될 때만 실행
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO growth_logs (
      user_id,
      session_id,
      log_type,
      reference_id,
      reference_type,
      title,
      icon,
      metadata
    )
    SELECT
      NEW.user_id,
      NEW.session_id,
      'action_completed',
      NEW.action_id,
      'action',
      a.title,
      '🎯',
      jsonb_build_object(
        'action_type', a.type,
        'difficulty', a.difficulty,
        'actual_minutes', NEW.actual_minutes
      )
    FROM actions a
    WHERE a.id = NEW.action_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_action_completion ON user_actions;
CREATE TRIGGER trigger_log_action_completion
  AFTER UPDATE ON user_actions
  FOR EACH ROW
  EXECUTE FUNCTION log_action_completion();

-- =============================================
-- 9. 플랜 완료 시 성장 로그 자동 생성 트리거
-- =============================================

CREATE OR REPLACE FUNCTION log_plan_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- 상태가 completed로 변경될 때만 실행
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO growth_logs (
      user_id,
      session_id,
      log_type,
      reference_id,
      reference_type,
      title,
      icon,
      metadata
    )
    VALUES (
      NEW.user_id,
      NEW.session_id,
      'plan_completed',
      NEW.id,
      'daily_plan',
      '오늘의 플랜 완료',
      '✅',
      jsonb_build_object(
        'plan_date', NEW.plan_date,
        'items_count', jsonb_array_length(NEW.items),
        'estimated_minutes', NEW.estimated_minutes,
        'actual_minutes', NEW.actual_minutes
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_plan_completion ON daily_plans;
CREATE TRIGGER trigger_log_plan_completion
  AFTER UPDATE ON daily_plans
  FOR EACH ROW
  EXECUTE FUNCTION log_plan_completion();

-- =============================================
-- 10. 샘플 미션 데이터 (테스트용)
-- =============================================

-- 기본 미션 예시 (나중에 콘텐츠와 연결)
INSERT INTO actions (title, description, instruction, type, estimated_minutes, difficulty, tips, example_submission, is_active)
VALUES
  (
    '나의 타겟 고객 정의하기',
    '창업 아이디어의 핵심 타겟 고객을 구체적으로 정의해보세요.',
    '다음 질문에 답해보세요: 1) 누구의 문제를 해결하나요? 2) 그들은 어디에 있나요? 3) 왜 그들이 당신의 솔루션을 선택할까요?',
    'text',
    15,
    2,
    ARRAY['가능한 구체적으로 작성하세요', '나이, 직업, 관심사 등을 포함하면 좋아요', '한 문장으로 요약해보세요'],
    '예시: 25-35세 직장인 중 퇴근 후 요리할 시간이 없지만 건강한 식사를 원하는 1인 가구',
    true
  ),
  (
    '경쟁사 3곳 분석하기',
    '비슷한 문제를 해결하는 경쟁사를 찾아 분석해보세요.',
    '각 경쟁사에 대해 다음을 작성하세요: 1) 서비스명과 URL 2) 강점 3) 약점 4) 우리와의 차별점',
    'text',
    20,
    3,
    ARRAY['직접 경쟁사와 간접 경쟁사를 모두 고려하세요', '실제로 서비스를 사용해보면 더 좋아요'],
    NULL,
    true
  ),
  (
    '고객 인터뷰 질문 5개 작성하기',
    '잠재 고객과의 인터뷰에서 사용할 질문을 준비해보세요.',
    '좋은 질문은 예/아니오로 답할 수 없고, 고객의 진짜 경험과 감정을 끌어내는 질문입니다.',
    'text',
    10,
    2,
    ARRAY['왜?를 묻는 질문을 포함하세요', '과거 경험을 묻는 질문이 좋아요', '가격 질문은 피하세요'],
    '예시:\n1. 이 문제를 마지막으로 겪었던 때를 말씀해주세요.\n2. 그때 어떻게 해결하셨나요?\n3. 그 해결책의 가장 불편한 점은 무엇이었나요?',
    true
  )
ON CONFLICT DO NOTHING;
