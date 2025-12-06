# Sprint 3: AI 커리큘럼 생성

## 목표
- OpenAI API 연동하여 AI 커리큘럼 생성
- 커리큘럼 생성 로딩 UI
- 커리큘럼 결과 화면 (DB 연동)
- 생성된 커리큘럼 저장

---

## 데이터베이스 스키마

### curriculums 테이블
```sql
CREATE TABLE curriculums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id TEXT,  -- 비로그인 사용자용

  -- 온보딩 입력값 (커리큘럼 생성 기준)
  industry TEXT NOT NULL,
  stage TEXT NOT NULL,
  concerns TEXT[],
  goal TEXT NOT NULL,

  -- AI 생성 결과
  title TEXT NOT NULL,
  description TEXT,
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
  content_type TEXT DEFAULT 'video', -- video, article, quiz
  thumbnail_url TEXT,
  content_url TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE curriculums ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own curriculums" ON curriculums
  FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "Users can insert curriculums" ON curriculums
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own curriculums" ON curriculums
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Read curriculum modules" ON curriculum_modules
  FOR SELECT USING (true);
CREATE POLICY "Insert curriculum modules" ON curriculum_modules
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Read curriculum contents" ON curriculum_contents
  FOR SELECT USING (true);
CREATE POLICY "Insert curriculum contents" ON curriculum_contents
  FOR INSERT WITH CHECK (true);
```

---

## API 설계

### POST /api/curriculum/generate
AI 커리큘럼 생성

**Request:**
```json
{
  "industry": "IT/소프트웨어",
  "stage": "MVP 개발/출시",
  "concerns": ["고객확보", "매출"],
  "goal": "첫 유료 고객 확보",
  "userName": "준영"
}
```

**Response:**
```json
{
  "success": true,
  "curriculum": {
    "id": "uuid",
    "title": "준영님을 위한 맞춤 커리큘럼",
    "description": "IT 서비스 MVP 출시 후 첫 유료 고객 확보를 위한 4주 과정",
    "duration_weeks": 4,
    "modules": [
      {
        "week": 1,
        "title": "MVP 출시 전 핵심 점검",
        "description": "출시 전 반드시 확인해야 할 체크리스트",
        "contents": [
          {
            "title": "MVP 출시 전 체크리스트 10가지",
            "creator": "김창업",
            "duration": "12분",
            "type": "video"
          }
        ]
      }
    ],
    "reasoning": "왜 이 커리큘럼이 적합한지에 대한 AI 설명"
  }
}
```

### GET /api/curriculum/[id]
특정 커리큘럼 조회

### GET /api/curriculum/latest
최근 커리큘럼 조회 (user_id 또는 session_id 기준)

---

## 파일 구조

```
app/
├── api/
│   └── curriculum/
│       ├── generate/
│       │   └── route.ts      # AI 커리큘럼 생성
│       ├── [id]/
│       │   └── route.ts      # 특정 커리큘럼 조회
│       └── latest/
│           └── route.ts      # 최근 커리큘럼 조회
├── curriculum/
│   ├── page.tsx              # 커리큘럼 결과 화면 (수정)
│   └── loading/
│       └── page.tsx          # 생성 중 로딩 화면 (새로 생성)
lib/
├── openai.ts                 # OpenAI 클라이언트 설정
└── prompts/
    └── curriculum.ts         # 커리큘럼 생성 프롬프트
```

---

## 태스크 목록

### Phase 1: OpenAI 연동
- [ ] OpenAI 패키지 설치 및 설정
- [ ] 환경변수 추가 (OPENAI_API_KEY)
- [ ] 커리큘럼 생성 프롬프트 설계

### Phase 2: API 구현
- [ ] POST /api/curriculum/generate 구현
- [ ] GET /api/curriculum/[id] 구현
- [ ] GET /api/curriculum/latest 구현

### Phase 3: DB 연동
- [ ] curriculums 테이블 생성
- [ ] curriculum_modules 테이블 생성
- [ ] curriculum_contents 테이블 생성
- [ ] 생성된 커리큘럼 저장 로직

### Phase 4: UI 연동
- [ ] 커리큘럼 생성 로딩 페이지
- [ ] 커리큘럼 결과 페이지 수정 (실제 데이터 사용)
- [ ] 온보딩 완료 → 커리큘럼 생성 플로우 연결

### Phase 5: 테스트 및 최적화
- [ ] 빌드 테스트
- [ ] 커리큘럼 생성 E2E 테스트

---

## OpenAI 프롬프트 설계

```typescript
const systemPrompt = `
당신은 스타트업 창업자를 위한 교육 커리큘럼 설계 전문가입니다.
사용자의 산업, 현재 단계, 고민, 목표를 분석하여 최적의 4주 학습 커리큘럼을 생성합니다.

규칙:
1. 각 주차는 명확한 학습 목표가 있어야 합니다
2. 콘텐츠는 실용적이고 즉시 적용 가능해야 합니다
3. 진행 순서는 논리적으로 이전 주차가 다음 주차의 기반이 되어야 합니다
4. 각 주차당 3-4개의 콘텐츠를 추천합니다
5. 콘텐츠 유형은 video, article, quiz 중 하나입니다

응답은 반드시 JSON 형식으로 해주세요.
`;

const userPrompt = `
다음 창업자를 위한 4주 학습 커리큘럼을 만들어주세요:

- 산업: ${industry}
- 현재 단계: ${stage}
- 주요 고민: ${concerns.join(', ')}
- 목표: ${goal}

JSON 형식으로 응답해주세요:
{
  "title": "커리큘럼 제목",
  "description": "커리큘럼 설명",
  "reasoning": "왜 이 커리큘럼이 적합한지 설명",
  "modules": [
    {
      "week": 1,
      "title": "주차 제목",
      "description": "주차 설명",
      "contents": [
        {
          "title": "콘텐츠 제목",
          "creator": "제작자 이름",
          "duration": "12분",
          "type": "video"
        }
      ]
    }
  ]
}
`;
```

---

## 환경변수

```env
# .env.local에 추가
OPENAI_API_KEY=sk-...
```

---

## 완료 조건

- [ ] 온보딩 완료 후 AI 커리큘럼이 자동 생성됨
- [ ] 생성 중 로딩 애니메이션이 표시됨
- [ ] 생성된 커리큘럼이 DB에 저장됨
- [ ] 커리큘럼 결과 화면에서 실제 데이터 표시
- [ ] "왜 이 커리큘럼인가요?" 섹션에 AI 추천 이유 표시
- [ ] 빌드 성공
