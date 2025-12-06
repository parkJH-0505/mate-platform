# Sprint 4: 학습 콘텐츠 및 진행 추적

## 목표
- 콘텐츠 상세 페이지 구현
- 학습 진행률 추적 시스템
- 콘텐츠 완료 처리
- 대시보드 연결

---

## 현재 상태 (Sprint 3 완료 후)

### 완료된 기능
- 온보딩 플로우 (산업, 단계, 고민, 목표 수집)
- AI 커리큘럼 생성 (OpenAI API)
- 커리큘럼 결과 페이지
- Supabase DB 연동
- Vercel 배포

### 현재 문제점
- "학습 시작하기" 클릭 시 Paywall만 표시됨
- 실제 콘텐츠 상세 페이지 없음
- 학습 진행률 추적 없음
- 대시보드와 연결되지 않음

---

## 구현 계획

### 1. 콘텐츠 상세 페이지 (`/content/[id]`)

**기능:**
- 콘텐츠 제목, 설명, 제작자 정보
- 임베디드 비디오 플레이어 (프로토타입: 플레이스홀더)
- 콘텐츠 완료 버튼
- 다음 콘텐츠 안내

**UI:**
```
┌─────────────────────────────────────┐
│ ← 돌아가기                    MATE  │
├─────────────────────────────────────┤
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │      비디오 플레이어        │   │
│   │      (프로토타입)           │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
│   1주차 > MVP 출시 전략             │
│   ─────────────────────────────     │
│   MVP 출시 전 체크리스트 10가지     │
│   김창업 · 12분                     │
│                                     │
│   이 콘텐츠에서 배울 내용:          │
│   • MVP 출시 전 필수 점검 사항      │
│   • 초기 사용자 확보 전략           │
│   • 피드백 수집 방법                │
│                                     │
│   ┌─────────────────────────────┐   │
│   │      ✓ 학습 완료하기        │   │
│   └─────────────────────────────┘   │
│                                     │
│   다음 콘텐츠:                      │
│   │ 🎬 초기 고객 확보 방법          │
│                                     │
└─────────────────────────────────────┘
```

### 2. 학습 진행 추적 시스템

**데이터베이스 스키마:**
```sql
-- 사용자 학습 진행 상황
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,  -- 비로그인 사용자용
  curriculum_id UUID REFERENCES curriculums(id) ON DELETE CASCADE,
  content_id UUID REFERENCES curriculum_contents(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, content_id),
  UNIQUE(user_id, content_id)
);

-- RLS 정책
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own progress" ON user_progress
  FOR ALL USING (true);
```

### 3. API 엔드포인트

**GET /api/content/[id]**
- 콘텐츠 상세 정보 조회
- 완료 여부 포함

**POST /api/progress/complete**
- 콘텐츠 완료 처리
```json
{
  "contentId": "uuid",
  "curriculumId": "uuid"
}
```

**GET /api/progress?curriculumId=xxx**
- 커리큘럼별 진행률 조회
```json
{
  "totalContents": 12,
  "completedContents": 3,
  "progressPercent": 25,
  "completedIds": ["uuid1", "uuid2", "uuid3"]
}
```

---

## 파일 구조

```
app/
├── api/
│   ├── content/
│   │   └── [id]/
│   │       └── route.ts      # 콘텐츠 상세 조회
│   └── progress/
│       ├── route.ts          # 진행률 조회
│       └── complete/
│           └── route.ts      # 완료 처리
├── content/
│   └── [id]/
│       └── page.tsx          # 콘텐츠 상세 페이지 (수정)
└── curriculum/
    └── page.tsx              # 진행률 표시 추가
```

---

## 태스크 목록

### Phase 1: 데이터베이스
- [ ] user_progress 테이블 생성
- [ ] RLS 정책 설정

### Phase 2: API 구현
- [ ] GET /api/content/[id] 구현
- [ ] POST /api/progress/complete 구현
- [ ] GET /api/progress 구현

### Phase 3: 콘텐츠 상세 페이지
- [ ] 콘텐츠 정보 표시
- [ ] 비디오 플레이어 플레이스홀더
- [ ] 학습 완료 버튼
- [ ] 다음 콘텐츠 네비게이션

### Phase 4: 커리큘럼 페이지 업데이트
- [ ] 진행률 표시 추가
- [ ] 완료된 콘텐츠 체크 표시
- [ ] Paywall 대신 콘텐츠 페이지로 이동

### Phase 5: 테스트
- [ ] 콘텐츠 완료 플로우 테스트
- [ ] 진행률 계산 확인
- [ ] Vercel 배포 확인

---

## UI 변경 사항

### 커리큘럼 페이지 변경
- 콘텐츠 클릭 시 → 콘텐츠 상세 페이지로 이동 (Paywall 제거)
- 진행률 바 추가
- 완료된 콘텐츠에 체크 아이콘 표시

### 콘텐츠 상세 페이지
- 프로토타입용 비디오 플레이스홀더
- "학습 완료하기" 버튼
- 완료 시 축하 애니메이션
- 다음 콘텐츠 자동 추천

---

## 완료 조건

- [ ] 커리큘럼 페이지에서 콘텐츠 클릭 시 상세 페이지로 이동
- [ ] 콘텐츠 상세 페이지에서 정보 확인 가능
- [ ] "학습 완료하기" 버튼 클릭 시 완료 처리
- [ ] 커리큘럼 페이지에서 진행률 확인 가능
- [ ] 완료된 콘텐츠 표시됨
- [ ] Vercel 배포 성공
