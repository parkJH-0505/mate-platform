-- =============================================
-- Sprint 7: AI 챗봇 테이블
-- =============================================

-- 채팅 세션 테이블
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- 비로그인 사용자용
  title TEXT DEFAULT '새 대화',
  context JSONB DEFAULT '{}', -- 현재 컨텍스트 (콘텐츠, 커리큘럼 등)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,

  CONSTRAINT user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- 채팅 메시지 테이블
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- 추천 콘텐츠, 액션 아이템 등
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 컨텍스트 스냅샷 테이블 (히스토리용)
CREATE TABLE IF NOT EXISTS chat_contexts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  context_type TEXT NOT NULL, -- 'content', 'curriculum', 'user_profile'
  context_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(chat_session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_contexts_session_id ON chat_contexts(chat_session_id);

-- RLS 활성화
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_contexts ENABLE ROW LEVEL SECURITY;

-- chat_sessions RLS 정책
CREATE POLICY "Users can view own chat sessions"
  ON chat_sessions FOR SELECT
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

CREATE POLICY "Users can create chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions FOR UPDATE
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

CREATE POLICY "Users can delete own chat sessions"
  ON chat_sessions FOR DELETE
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

-- chat_messages RLS 정책
CREATE POLICY "Users can view messages in own sessions"
  ON chat_messages FOR SELECT
  USING (
    chat_session_id IN (
      SELECT id FROM chat_sessions
      WHERE user_id = auth.uid() OR session_id IS NOT NULL
    )
  );

CREATE POLICY "Users can create messages in own sessions"
  ON chat_messages FOR INSERT
  WITH CHECK (
    chat_session_id IN (
      SELECT id FROM chat_sessions
      WHERE user_id = auth.uid() OR session_id IS NOT NULL
    )
  );

-- chat_contexts RLS 정책
CREATE POLICY "Users can view contexts in own sessions"
  ON chat_contexts FOR SELECT
  USING (
    chat_session_id IN (
      SELECT id FROM chat_sessions
      WHERE user_id = auth.uid() OR session_id IS NOT NULL
    )
  );

CREATE POLICY "Users can create contexts in own sessions"
  ON chat_contexts FOR INSERT
  WITH CHECK (
    chat_session_id IN (
      SELECT id FROM chat_sessions
      WHERE user_id = auth.uid() OR session_id IS NOT NULL
    )
  );

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_chat_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_chat_session_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_session_updated_at();

-- 메시지 추가 시 세션 updated_at 갱신 트리거
CREATE OR REPLACE FUNCTION update_session_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET updated_at = NOW()
  WHERE id = NEW.chat_session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_on_message
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_on_message();
