# Sprint 7: AI 챗봇 (차별화 = 경쟁력)

## 개요
- **목적**: "영상만 보는 플랫폼"이 아닌 "나만의 창업 멘토"로 포지셔닝
- **핵심 가치**: 학습 컨텍스트를 이해하는 맞춤형 AI 멘토링
- **예상 소요**: 5-7일

## 핵심 기능

### 1. 콘텐츠 관련 Q&A
- 현재 학습 중인 콘텐츠 맥락 이해
- "방금 본 영상에서 PMF가 뭐야?" 같은 질문 처리
- 콘텐츠 내용 기반 심화 설명

### 2. 맞춤형 조언
- 사용자 업종/단계 기반 개인화된 답변
- 온보딩 데이터 활용 (업종, 창업 단계, 목표)
- 일반 ChatGPT와 차별화되는 맥락 인지

### 3. 실행 가이드
- "내 상황에서 어떻게 적용해?" 질문 처리
- 구체적인 액션 아이템 제시
- 이론 → 실전 연결

### 4. 컨텍스트 유지
- 커리큘럼/학습 이력 반영
- 대화 히스토리 유지
- 연속성 있는 멘토링 경험

### 5. 콘텐츠 추천
- 질문 분석 후 관련 콘텐츠 추천
- "이 질문이면 이 영상이 도움될 거예요"
- 콘텐츠 소비 촉진

---

## 데이터베이스 스키마

### chat_sessions (채팅 세션)
```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT, -- 비로그인 사용자용
  title TEXT, -- 대화 제목 (자동 생성)
  context JSONB, -- 현재 컨텍스트 (콘텐츠, 커리큘럼 등)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

### chat_messages (채팅 메시지)
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB, -- 추천 콘텐츠, 액션 아이템 등
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### chat_contexts (컨텍스트 스냅샷)
```sql
CREATE TABLE chat_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  context_type TEXT NOT NULL, -- 'content', 'curriculum', 'user_profile'
  context_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API 설계

### 1. 채팅 세션 관리

#### GET /api/chat/sessions
- 사용자의 채팅 세션 목록 조회

#### POST /api/chat/sessions
- 새 채팅 세션 생성
- Request: `{ contentId?, curriculumId? }`

#### DELETE /api/chat/sessions/[id]
- 채팅 세션 삭제

### 2. 메시지 송수신

#### GET /api/chat/sessions/[id]/messages
- 세션의 메시지 히스토리 조회
- 페이지네이션 지원

#### POST /api/chat/sessions/[id]/messages
- 메시지 전송 및 AI 응답 받기
- Request: `{ message: string, context?: object }`
- Response: 스트리밍 (SSE)

### 3. 컨텍스트 관리

#### GET /api/chat/context
- 현재 사용자 컨텍스트 조회 (프로필, 학습 현황)

#### POST /api/chat/context
- 컨텍스트 업데이트 (콘텐츠 페이지에서 호출)

---

## AI 시스템 프롬프트 설계

### 기본 시스템 프롬프트
```
당신은 MATE의 AI 창업 멘토입니다. 사용자의 창업 여정을 돕는 것이 목표입니다.

## 역할
- 창업 교육 콘텐츠에 대한 질문에 친절하게 답변
- 사용자의 상황(업종, 단계)에 맞는 맞춤형 조언 제공
- 이론을 실제 적용할 수 있는 구체적인 가이드 제시

## 사용자 정보
- 이름: {userName}
- 업종: {industry}
- 창업 단계: {stage}
- 목표: {goal}
- 현재 학습 중인 콘텐츠: {currentContent}
- 완료한 콘텐츠: {completedContents}

## 응답 가이드라인
1. 친근하지만 전문적인 톤 유지
2. 사용자의 업종에 맞는 구체적인 예시 제공
3. 실행 가능한 액션 아이템 포함
4. 필요시 관련 학습 콘텐츠 추천
5. 한국어로 답변
6. 응답은 간결하게, 필요시 구조화된 형식 사용
```

### 콘텐츠 컨텍스트 추가
```
## 현재 콘텐츠 정보
- 제목: {contentTitle}
- 모듈: {moduleName}
- 주차: {weekNumber}주차
- 핵심 키워드: {keywords}
- 콘텐츠 요약: {summary}
```

---

## UI 컴포넌트

### 1. ChatWindow (메인 채팅 창)
```typescript
interface ChatWindowProps {
  sessionId: string
  initialContext?: ChatContext
  onClose?: () => void
}
```

### 2. ChatMessage (메시지 컴포넌트)
```typescript
interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  metadata?: {
    recommendedContents?: ContentItem[]
    actionItems?: string[]
  }
  timestamp: Date
  isStreaming?: boolean
}
```

### 3. ChatInput (입력 컴포넌트)
```typescript
interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
  suggestions?: string[] // 빠른 질문 제안
}
```

### 4. ChatSidebar (세션 목록)
```typescript
interface ChatSidebarProps {
  sessions: ChatSession[]
  activeSessionId?: string
  onSelectSession: (id: string) => void
  onNewSession: () => void
}
```

### 5. QuickQuestions (빠른 질문)
```typescript
// 콘텐츠 페이지에서 표시될 빠른 질문 버튼들
const quickQuestions = [
  "이 개념을 쉽게 설명해줘",
  "내 업종에 어떻게 적용할 수 있어?",
  "실제 사례가 있어?",
  "다음 단계로 뭘 해야 해?"
]
```

---

## 파일 구조

```
app/
├── (dashboard)/
│   ├── ai/
│   │   └── page.tsx              # AI 챗봇 메인 페이지 (전체 화면)
│   └── components/
│       ├── chat/
│       │   ├── ChatWindow.tsx     # 메인 채팅 창
│       │   ├── ChatMessage.tsx    # 메시지 컴포넌트
│       │   ├── ChatInput.tsx      # 입력 컴포넌트
│       │   ├── ChatSidebar.tsx    # 세션 목록
│       │   ├── QuickQuestions.tsx # 빠른 질문 버튼
│       │   ├── ContentRecommendation.tsx # 추천 콘텐츠
│       │   └── index.ts
│       └── ...
├── api/
│   └── chat/
│       ├── sessions/
│       │   ├── route.ts           # 세션 목록/생성
│       │   └── [id]/
│       │       ├── route.ts       # 세션 상세/삭제
│       │       └── messages/
│       │           └── route.ts   # 메시지 조회/전송
│       └── context/
│           └── route.ts           # 컨텍스트 관리
├── content/
│   └── [id]/
│       └── page.tsx               # 채팅 버튼 추가
lib/
├── ai/
│   ├── prompts.ts                 # 시스템 프롬프트
│   ├── context.ts                 # 컨텍스트 빌더
│   └── anthropic.ts               # Claude API 클라이언트
```

---

## 구현 순서

### Phase 1: 기반 구축 (Day 1-2)
1. [ ] 데이터베이스 마이그레이션 생성
2. [ ] Claude API 클라이언트 설정
3. [ ] 기본 시스템 프롬프트 작성
4. [ ] 채팅 세션 API 구현

### Phase 2: 핵심 기능 (Day 2-3)
5. [ ] 메시지 스트리밍 API 구현
6. [ ] 컨텍스트 빌더 구현
7. [ ] ChatWindow 컴포넌트 구현
8. [ ] ChatMessage 컴포넌트 구현

### Phase 3: UI 완성 (Day 4-5)
9. [ ] ChatInput 컴포넌트 구현
10. [ ] ChatSidebar 컴포넌트 구현
11. [ ] AI 페이지 전체 레이아웃
12. [ ] 모바일 반응형 처리

### Phase 4: 고급 기능 (Day 5-6)
13. [ ] 콘텐츠 페이지 채팅 통합
14. [ ] 빠른 질문 기능
15. [ ] 콘텐츠 추천 기능
16. [ ] 히스토리 관리

### Phase 5: 테스트/최적화 (Day 6-7)
17. [ ] 프롬프트 튜닝
18. [ ] 에러 핸들링
19. [ ] 성능 최적화
20. [ ] 테스트 및 배포

---

## UI 목업

### AI 챗봇 페이지 (전체 화면)
```
┌────────────────────────────────────────────────────────┐
│ ← 뒤로    AI 멘토                           [새 대화]  │
├──────────────┬─────────────────────────────────────────┤
│              │                                         │
│  대화 목록   │   안녕하세요, {name}님! 👋              │
│              │   창업에 대해 무엇이든 물어보세요.       │
│  ┌─────────┐ │                                         │
│  │ 오늘    │ │   ┌─────────────────────────────────┐   │
│  │ PMF에...│ │   │ 👤 PMF가 정확히 뭐야?           │   │
│  └─────────┘ │   └─────────────────────────────────┘   │
│              │                                         │
│  ┌─────────┐ │   ┌─────────────────────────────────┐   │
│  │ 어제    │ │   │ 🤖 PMF(Product-Market Fit)는    │   │
│  │ 린스타..│ │   │ 제품이 시장의 니즈에 딱 맞는    │   │
│  └─────────┘ │   │ 상태를 말합니다...              │   │
│              │   │                                 │   │
│              │   │ 💡 관련 콘텐츠:                 │   │
│              │   │ • PMF 찾기 완벽 가이드         │   │
│              │   └─────────────────────────────────┘   │
│              │                                         │
├──────────────┴─────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────┐     │
│  │ 메시지를 입력하세요...                    [→] │     │
│  └───────────────────────────────────────────────┘     │
│                                                        │
│  [이 개념 설명해줘] [내 업종에 적용] [실제 사례]       │
└────────────────────────────────────────────────────────┘
```

### 콘텐츠 페이지 내 채팅 버튼
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                   [영상 콘텐츠]                        │
│                                                        │
├────────────────────────────────────────────────────────┤
│ PMF 찾기: 초기 스타트업의 핵심                         │
│ 1주차 · 비즈니스 기초                                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  💬 AI 멘토에게 질문하기                               │
│  ┌──────────────────────────────────────────────────┐ │
│  │ [이 내용 설명해줘] [적용 방법] [다음 단계]       │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 기술 스택

### AI
- **Claude API** (claude-sonnet-4-20250514)
- 스트리밍 응답 (SSE)
- 컨텍스트 윈도우 관리

### 프론트엔드
- React + TypeScript
- Framer Motion (애니메이션)
- react-markdown (마크다운 렌더링)

### 백엔드
- Next.js API Routes
- Supabase (채팅 저장)
- Edge Functions (스트리밍)

---

## 성공 지표

### 정량적 지표
- 일일 활성 채팅 사용자 수
- 세션당 평균 메시지 수
- 추천 콘텐츠 클릭률

### 정성적 지표
- 응답 품질 만족도
- "도움이 됐어요" 피드백 비율
- 재사용률

---

## 리스크 및 대응

### API 비용
- 토큰 사용량 모니터링
- 컨텍스트 크기 최적화
- 무료 사용자 일일 제한

### 응답 품질
- 시스템 프롬프트 지속 개선
- 사용자 피드백 수집
- A/B 테스트

### 성능
- 스트리밍으로 체감 속도 개선
- 메시지 페이지네이션
- 컨텍스트 캐싱
