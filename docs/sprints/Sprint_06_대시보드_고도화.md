# Sprint 6: 대시보드 고도화 (리텐션 강화)

## 목표
- 사용자가 매일 돌아오게 만드는 동기부여 시스템 구축
- 학습 습관 형성을 위한 스트릭 및 목표 시스템
- 성취감을 주는 레벨/뱃지 시스템
- 시각적으로 매력적인 학습 통계 제공

---

## 핵심 지표 (KPI)

| 지표 | 현재 | 목표 |
|------|------|------|
| DAU/MAU | - | 40%+ |
| 평균 세션 시간 | - | 10분+ |
| 주간 리텐션 | - | 50%+ |
| 월간 구독 갱신율 | - | 80%+ |

---

## 구현 기능

### 1. 학습 스트릭 (Learning Streak)

#### 개념
- 연속으로 학습한 일수를 추적
- 불꽃 아이콘과 함께 시각적으로 표시
- 스트릭이 끊기지 않도록 동기부여

#### 데이터베이스

```sql
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

  UNIQUE(user_id),
  UNIQUE(session_id)
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

  UNIQUE(user_id, activity_date),
  UNIQUE(session_id, activity_date)
);
```

#### UI 컴포넌트

```
┌─────────────────────────────────────┐
│  🔥 7일 연속 학습 중!               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  월  화  수  목  금  토  일         │
│  ●   ●   ●   ●   ●   ●   ○         │
│                                     │
│  최장 기록: 14일                    │
└─────────────────────────────────────┘
```

### 2. 레벨 및 뱃지 시스템

#### 레벨 체계

| 레벨 | 이름 | 필요 XP | 아이콘 |
|------|------|---------|--------|
| 1 | 새싹 창업가 | 0 | 🌱 |
| 2 | 성장하는 창업가 | 100 | 🌿 |
| 3 | 도전하는 창업가 | 300 | 🌳 |
| 4 | 성취하는 창업가 | 600 | 🎯 |
| 5 | 전문 창업가 | 1000 | 🚀 |
| 6 | 마스터 창업가 | 1500 | 👑 |

#### XP 획득 조건

| 활동 | XP |
|------|-----|
| 콘텐츠 완료 | +10 |
| 일일 첫 학습 | +5 |
| 7일 연속 학습 | +50 |
| 30일 연속 학습 | +200 |
| 커리큘럼 완료 | +100 |

#### 뱃지 시스템

| 뱃지 | 조건 | 아이콘 |
|------|------|--------|
| 첫 발걸음 | 첫 콘텐츠 완료 | 👣 |
| 꾸준함의 힘 | 7일 연속 학습 | 🔥 |
| 불굴의 의지 | 30일 연속 학습 | 💪 |
| 커리큘럼 마스터 | 커리큘럼 100% 완료 | 🎓 |
| 열정의 학습자 | 총 100개 콘텐츠 완료 | ⭐ |
| 구독의 시작 | 첫 구독 | 💎 |

#### 데이터베이스

```sql
-- 사용자 레벨/XP
CREATE TABLE IF NOT EXISTS user_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  session_id TEXT UNIQUE,

  level INTEGER DEFAULT 1,
  current_xp INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 획득한 뱃지
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,

  badge_type TEXT NOT NULL, -- 'first_content', 'streak_7', 'streak_30', etc.
  earned_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, badge_type),
  UNIQUE(session_id, badge_type)
);
```

### 3. 주간 목표 설정

#### 기능
- 사용자가 주간 학습 목표 설정
- 목표 달성 시 추가 XP 보상
- 진행률 시각화

#### UI

```
┌─────────────────────────────────────┐
│  📎 이번 주 목표                    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  콘텐츠 5개 완료하기         │   │
│  │  ████████░░░░░░░░  3/5 (60%) │   │
│  │                             │   │
│  │  달성 시 +30 XP 🎁          │   │
│  └─────────────────────────────┘   │
│                                     │
│  [목표 수정하기]                    │
└─────────────────────────────────────┘
```

#### 데이터베이스

```sql
CREATE TABLE IF NOT EXISTS weekly_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,

  week_start DATE NOT NULL, -- 해당 주의 월요일
  target_contents INTEGER DEFAULT 5,
  completed_contents INTEGER DEFAULT 0,

  is_achieved BOOLEAN DEFAULT FALSE,
  achieved_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, week_start),
  UNIQUE(session_id, week_start)
);
```

### 4. 학습 통계 리포트

#### 주간 리포트

```
┌─────────────────────────────────────┐
│  📊 이번 주 학습 리포트             │
│                                     │
│  총 학습 시간: 2시간 30분           │
│  완료 콘텐츠: 8개                   │
│  획득 XP: +95                       │
│                                     │
│  일별 학습 (분)                     │
│  50│     ▄▄                        │
│  40│  ▄▄ ██ ▄▄                     │
│  30│  ██ ██ ██ ▄▄                  │
│  20│  ██ ██ ██ ██ ▄▄               │
│  10│  ██ ██ ██ ██ ██               │
│   0└──월──화──수──목──금──토──일    │
│                                     │
│  지난 주 대비 +25% 📈              │
└─────────────────────────────────────┘
```

---

## 파일 구조

```
app/
├── api/
│   ├── dashboard/
│   │   └── route.ts              # 수정: 스트릭, 레벨, 목표 포함
│   ├── streak/
│   │   └── route.ts              # 스트릭 조회/업데이트
│   ├── levels/
│   │   └── route.ts              # 레벨/XP 조회
│   ├── badges/
│   │   └── route.ts              # 뱃지 조회
│   └── goals/
│       ├── route.ts              # 목표 조회/생성
│       └── [id]/route.ts         # 목표 수정
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx              # 수정: 새 컴포넌트 추가
│   └── components/
│       ├── StreakCard.tsx        # 스트릭 카드
│       ├── LevelProgress.tsx     # 레벨 진행률
│       ├── WeeklyGoal.tsx        # 주간 목표
│       ├── BadgeShowcase.tsx     # 뱃지 표시
│       └── WeeklyReport.tsx      # 주간 리포트
└── hooks/
    ├── useStreak.ts              # 스트릭 훅
    ├── useLevel.ts               # 레벨 훅
    └── useGoals.ts               # 목표 훅

supabase/migrations/
└── 006_gamification.sql          # 게이미피케이션 테이블
```

---

## API 설계

### GET /api/dashboard (수정)

```typescript
// Response 추가 필드
{
  // ... 기존 필드
  streak: {
    current: number,
    longest: number,
    lastActivityDate: string,
    weeklyActivity: boolean[] // [월, 화, 수, 목, 금, 토, 일]
  },
  level: {
    current: number,
    name: string,
    icon: string,
    currentXP: number,
    nextLevelXP: number,
    progress: number // 0-100%
  },
  weeklyGoal: {
    target: number,
    completed: number,
    progress: number,
    bonusXP: number,
    isAchieved: boolean
  },
  badges: Array<{
    type: string,
    name: string,
    icon: string,
    earnedAt: string
  }>
}
```

### POST /api/goals

```typescript
// Request
{ targetContents: number }

// Response
{ success: true, goal: WeeklyGoal }
```

### POST /api/progress/complete (수정)

```typescript
// Response 추가 필드
{
  // ... 기존 필드
  xpEarned: number,
  newBadges: string[], // 새로 획득한 뱃지
  levelUp: boolean,
  newLevel: number | null,
  streakUpdated: {
    current: number,
    isNew: boolean // 오늘 첫 학습인지
  }
}
```

---

## 태스크 목록

### Phase 1: 데이터베이스 (1일)
- [ ] 006_gamification.sql 마이그레이션 파일 생성
- [ ] learning_streaks 테이블
- [ ] daily_activities 테이블
- [ ] user_levels 테이블
- [ ] user_badges 테이블
- [ ] weekly_goals 테이블

### Phase 2: 스트릭 시스템 (1일)
- [ ] 스트릭 계산 로직 구현
- [ ] /api/streak 엔드포인트
- [ ] useStreak 훅
- [ ] StreakCard 컴포넌트

### Phase 3: 레벨/뱃지 시스템 (1일)
- [ ] XP 계산 로직
- [ ] 레벨 업 로직
- [ ] 뱃지 획득 조건 체크
- [ ] /api/levels, /api/badges 엔드포인트
- [ ] LevelProgress, BadgeShowcase 컴포넌트

### Phase 4: 목표 시스템 (0.5일)
- [ ] 주간 목표 API
- [ ] useGoals 훅
- [ ] WeeklyGoal 컴포넌트

### Phase 5: 대시보드 통합 (1일)
- [ ] Dashboard API 수정
- [ ] 대시보드 UI 재구성
- [ ] 애니메이션 및 인터랙션
- [ ] 반응형 디자인

### Phase 6: 완료 플로우 개선 (0.5일)
- [ ] 콘텐츠 완료 시 XP/뱃지 표시
- [ ] 레벨업 축하 모달
- [ ] 뱃지 획득 알림

---

## UI 목업 (대시보드)

```
┌─────────────────────────────────────────────────────┐
│  안녕하세요, 준홍님! 👋                             │
│  오늘도 학습을 이어가볼까요?                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │  🔥 7일 연속    │  │  🌳 Lv.3        │          │
│  │  최장: 14일     │  │  450/600 XP     │          │
│  │  ● ● ● ● ● ● ○ │  │  ████████░░ 75% │          │
│  └─────────────────┘  └─────────────────┘          │
│                                                     │
│  ┌───────────────────────────────────────────┐     │
│  │  📎 이번 주 목표: 5개 중 3개 완료 (60%)   │     │
│  │  ████████████░░░░░░░░░░░░░░░  달성 시 +30XP│     │
│  └───────────────────────────────────────────┘     │
│                                                     │
│  ┌───────────────────────────────────────────┐     │
│  │  📚 현재 학습 중                          │     │
│  │  F&B 창업 커리큘럼                        │     │
│  │  ████████████░░░░░░░░░ 60%  6/10 완료     │     │
│  │                                           │     │
│  │  다음: 고객 세그먼트 정의하기             │     │
│  │  [학습 계속하기]                          │     │
│  └───────────────────────────────────────────┘     │
│                                                     │
│  ┌───────────────────────────────────────────┐     │
│  │  🏆 획득한 뱃지                           │     │
│  │  👣 첫 발걸음  🔥 꾸준함의 힘  💎 구독자  │     │
│  └───────────────────────────────────────────┘     │
│                                                     │
│  ┌───────────────────────────────────────────┐     │
│  │  📊 이번 주 통계                          │     │
│  │  학습 시간: 2시간 30분 (+25%)             │     │
│  │  완료: 8개  |  XP: +95                    │     │
│  └───────────────────────────────────────────┘     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 완료 조건

- [ ] 대시보드에 스트릭 카드 표시
- [ ] 레벨 및 XP 진행률 표시
- [ ] 주간 목표 설정 및 진행률 표시
- [ ] 뱃지 컬렉션 표시
- [ ] 콘텐츠 완료 시 XP 획득 & 표시
- [ ] 레벨업 시 축하 모달
- [ ] 뱃지 획득 시 알림
- [ ] 모바일 반응형 완벽 지원

---

## 예상 소요 시간

총 5일 (Phase 1-6)

---

## 다음 단계

Sprint 6 완료 후:
- Sprint 7: AI 챗봇 (학습 중 질문 답변)
- Sprint 8: 크리에이터 시스템 (콘텐츠 확장)
