# Sprint 5: 사용자 인증 및 대시보드 통합

## 개요

### 스프린트 목표
MVP 완성도를 높이기 위해 **사용자 인증 시스템**과 **대시보드 실제 데이터 연동**을 구현합니다. 현재 온보딩 → 커리큘럼 생성 → 학습 플로우가 완성되었으나, 사용자 데이터가 세션 기반(localStorage/sessionStorage)으로만 유지되어 재방문 시 데이터 손실 문제가 있습니다.

### 비즈니스 임팩트
| 지표 | 현재 | 목표 | 기대 효과 |
|------|------|------|----------|
| 재방문율 | 0% (데이터 손실) | 60%+ | 학습 지속성 |
| 회원가입 전환율 | - | 30%+ | 유저 락인 |
| 학습 완료율 | 측정 불가 | 측정 가능 | 데이터 기반 개선 |

---

## 현재 상태 분석

### 완료된 기능 (Sprint 1-4)
- 랜딩 페이지 및 온보딩 플로우
- AI 커리큘럼 생성 (OpenAI 연동)
- 커리큘럼 결과 페이지 (진행률 표시)
- 콘텐츠 상세 페이지 (학습 완료 기능)
- 대시보드 UI (목업 데이터)
- Supabase 기본 테이블 구조

### 핵심 문제점

#### 1. 데이터 영속성 부재
```
현재: sessionStorage → 브라우저 닫으면 데이터 손실
목표: Supabase DB → 영구 저장, 기기 간 동기화
```

#### 2. 인증 시스템 미완성
- Supabase Auth 설정됨 (useAuth 훅 존재)
- 실제 로그인/회원가입 플로우 없음
- 소셜 로그인 미구현

#### 3. 대시보드 데이터 분리
```
현재 구조:
├── /dashboard → mockData 사용
├── /status → mockData 사용
├── /curriculum → 실제 DB 연동
└── /content → 실제 DB 연동

목표 구조:
└── 모든 페이지 → Supabase 실제 데이터
```

#### 4. 사용자 플로우 단절
```
비로그인 사용자:
온보딩 완료 → 커리큘럼 생성 → 학습 시작 → ❌ 브라우저 닫음 → 데이터 손실

로그인 사용자 (목표):
온보딩 완료 → 커리큘럼 생성 → 학습 시작 → 브라우저 닫음 → ✅ 재접속 시 이어서
```

---

## 구현 계획

### Phase 1: 인증 시스템 구축

#### 1.1 로그인/회원가입 페이지 개선

**파일:** `app/login/page.tsx` (기존 수정)

```
┌─────────────────────────────────────┐
│              MATE                   │
│                                     │
│     창업 학습의 새로운 시작          │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  📧  이메일로 계속하기         │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  🔵  Google로 계속하기         │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  ⚫  GitHub로 계속하기         │  │
│  └───────────────────────────────┘  │
│                                     │
│        ─── 또는 ───                 │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  이메일                        │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  비밀번호                      │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │        로그인                  │  │
│  └───────────────────────────────┘  │
│                                     │
│     계정이 없으신가요? 회원가입     │
│                                     │
└─────────────────────────────────────┘
```

**기능 요구사항:**
- 이메일/비밀번호 로그인
- Google OAuth 로그인
- GitHub OAuth 로그인 (개발자 타겟)
- 회원가입 플로우
- 비밀번호 재설정
- 로그인 상태 유지 (Remember me)

#### 1.2 API 엔드포인트

**POST /api/auth/signup**
```typescript
interface SignupRequest {
  email: string
  password: string
  name: string
}

interface SignupResponse {
  success: boolean
  user?: User
  error?: string
}
```

**POST /api/auth/login**
```typescript
interface LoginRequest {
  email: string
  password: string
}
```

**POST /api/auth/logout**
**GET /api/auth/me** - 현재 사용자 정보

#### 1.3 세션 데이터 마이그레이션

비로그인 상태에서 학습한 데이터를 로그인 후 계정에 연결:

```typescript
// 마이그레이션 로직
async function migrateAnonymousData(sessionId: string, userId: string) {
  // 1. 세션 기반 온보딩 데이터 → 사용자 계정 연결
  await supabase
    .from('onboarding_responses')
    .update({ user_id: userId })
    .eq('session_id', sessionId)
    .is('user_id', null)

  // 2. 세션 기반 커리큘럼 → 사용자 계정 연결
  await supabase
    .from('curriculums')
    .update({ user_id: userId })
    .eq('session_id', sessionId)
    .is('user_id', null)

  // 3. 세션 기반 학습 진행 → 사용자 계정 연결
  await supabase
    .from('user_progress')
    .update({ user_id: userId })
    .eq('session_id', sessionId)
    .is('user_id', null)
}
```

---

### Phase 2: 대시보드 실제 데이터 연동

#### 2.1 데이터베이스 스키마 확장

```sql
-- 사용자 프로필 확장
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  industry TEXT,
  stage TEXT,
  goal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자 통계 (집계 테이블)
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_contents_completed INTEGER DEFAULT 0,
  total_curriculums INTEGER DEFAULT 0,
  total_learning_time_minutes INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 학습 활동 로그 (타임라인용)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  activity_type TEXT NOT NULL, -- 'content_started', 'content_completed', 'curriculum_created', 'login'
  entity_type TEXT, -- 'content', 'curriculum', 'module'
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_session ON activity_logs(session_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- RLS 정책
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can view own stats" ON user_stats
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own activities" ON activity_logs
  FOR ALL USING (auth.uid() = user_id);
```

#### 2.2 대시보드 API

**GET /api/dashboard**
```typescript
interface DashboardResponse {
  user: {
    name: string
    avatar: string
  }
  stats: {
    totalContentsCompleted: number
    totalCurriculums: number
    currentStreak: number
    totalLearningMinutes: number
  }
  currentCurriculum: {
    id: string
    title: string
    progress: number
    nextContent: ContentPreview | null
  } | null
  recentActivities: Activity[]
}
```

**GET /api/stats**
```typescript
interface StatsResponse {
  overview: {
    contentsCompleted: number
    modulesCompleted: number
    curriculumsCompleted: number
    totalLearningTime: string
  }
  curriculumProgress: CurriculumProgress[]
  weeklyActivity: WeeklyActivity[]
  achievements: Achievement[]
}
```

#### 2.3 대시보드 페이지 수정

**파일:** `app/(dashboard)/dashboard/page.tsx`

주요 변경사항:
- `mockData` 제거
- `useAuth()` 훅으로 사용자 정보 가져오기
- `/api/dashboard` API 호출
- 로딩/에러 상태 처리
- 실시간 데이터 갱신 (선택적 SWR 사용)

```typescript
// 기존 (mockData 사용)
const stats = mockDashboardData.stats

// 변경 (실제 API 호출)
const { data: dashboard, isLoading } = useSWR('/api/dashboard', fetcher)
```

---

### Phase 3: 사용자 플로우 최적화

#### 3.1 인증 상태에 따른 라우팅

```typescript
// middleware.ts 수정
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await getSession(request)

  // 보호된 라우트
  const protectedRoutes = ['/dashboard', '/status', '/settings', '/ai']

  // 인증 필요 페이지 접근 시
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      // 비로그인 시 로그인 페이지로 (원래 URL 저장)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 이미 로그인된 사용자가 로그인 페이지 접근 시
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}
```

#### 3.2 온보딩 후 회원가입 유도

온보딩 완료 후 자연스러운 회원가입 유도:

```
┌─────────────────────────────────────┐
│                                     │
│   🎉 커리큘럼이 준비되었습니다!      │
│                                     │
│   학습 진행 상황을 저장하고          │
│   언제든 이어서 학습하세요           │
│                                     │
│   ┌───────────────────────────────┐ │
│   │  📧 이메일로 저장하기          │ │
│   └───────────────────────────────┘ │
│                                     │
│   ┌───────────────────────────────┐ │
│   │  🔵 Google로 저장하기          │ │
│   └───────────────────────────────┘ │
│                                     │
│         나중에 할게요 →             │
│                                     │
└─────────────────────────────────────┘
```

#### 3.3 학습 연속성 UX

로그인 사용자의 재방문 시:

```
┌─────────────────────────────────────┐
│   👋 돌아오셨네요, 준홍님!           │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  📚 이어서 학습하기          │   │
│   │                             │   │
│   │  [MVP 전략 수립]             │   │
│   │  2/5 콘텐츠 완료            │   │
│   │  ───────────────            │   │
│   │  ██████████░░░░░ 40%        │   │
│   │                             │   │
│   │  마지막 학습: 2시간 전       │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  + 새 커리큘럼 만들기        │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 파일 구조 변경

```
app/
├── (auth)/                      # 인증 관련 그룹
│   ├── login/
│   │   └── page.tsx            # 로그인/회원가입 통합
│   ├── signup/
│   │   └── page.tsx            # 회원가입 상세 (선택적)
│   └── reset-password/
│       └── page.tsx            # 비밀번호 재설정
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx            # 실제 데이터 연동
│   ├── status/
│   │   └── page.tsx            # 실제 데이터 연동
│   └── settings/
│       └── page.tsx            # 프로필 저장 기능
├── api/
│   ├── auth/
│   │   ├── signup/route.ts     # NEW
│   │   ├── login/route.ts      # NEW
│   │   ├── logout/route.ts     # NEW
│   │   ├── me/route.ts         # NEW
│   │   └── callback/route.ts   # 기존
│   ├── dashboard/
│   │   └── route.ts            # NEW
│   ├── stats/
│   │   └── route.ts            # NEW
│   ├── activities/
│   │   └── route.ts            # NEW
│   └── profile/
│       └── route.ts            # NEW
├── curriculum/
│   └── page.tsx                # 회원가입 유도 추가
└── onboarding/
    └── complete/
        └── page.tsx            # 회원가입 유도 화면
```

---

## 태스크 목록

### Phase 1: 인증 시스템 (우선순위: 높음)
- [ ] Supabase Auth 설정 확인 (Google, GitHub OAuth)
- [ ] 로그인 페이지 UI 개선 (소셜 로그인 버튼)
- [ ] 이메일 회원가입 API 구현
- [ ] 이메일 로그인 API 구현
- [ ] 소셜 로그인 콜백 처리
- [ ] 세션 데이터 마이그레이션 API 구현
- [ ] 미들웨어 인증 체크 구현

### Phase 2: 대시보드 연동 (우선순위: 높음)
- [ ] user_profiles 테이블 생성
- [ ] user_stats 테이블 생성
- [ ] activity_logs 테이블 생성
- [ ] GET /api/dashboard 구현
- [ ] GET /api/stats 구현
- [ ] 대시보드 페이지 실제 데이터 연동
- [ ] 스테이터스 페이지 실제 데이터 연동

### Phase 3: 사용자 플로우 (우선순위: 중간)
- [ ] 온보딩 완료 후 회원가입 유도 화면
- [ ] 재방문 사용자 이어서 학습 UX
- [ ] 설정 페이지 프로필 저장 기능
- [ ] 로그아웃 기능

### Phase 4: 테스트 및 배포 (우선순위: 중간)
- [ ] 인증 플로우 E2E 테스트
- [ ] 데이터 마이그레이션 테스트
- [ ] Vercel 배포 및 환경변수 설정
- [ ] 프로덕션 테스트

---

## 기술적 고려사항

### 1. Supabase Auth 설정

```typescript
// lib/supabase/auth.ts
export async function signUpWithEmail(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  })

  if (data.user) {
    // 프로필 생성
    await supabase.from('user_profiles').insert({
      id: data.user.id,
      name
    })
  }

  return { data, error }
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback`
    }
  })
}
```

### 2. 상태 관리 확장

```typescript
// stores/authStore.ts (NEW)
interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean

  setUser: (user: User | null) => void
  signOut: () => Promise<void>
  migrateSessionData: () => Promise<void>
}
```

### 3. 캐싱 전략

```typescript
// SWR 설정
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 60000, // 1분마다 갱신
}

// 대시보드 데이터 캐싱
const { data, mutate } = useSWR('/api/dashboard', fetcher, swrConfig)
```

---

## 완료 조건

### 필수 (Must Have)
- [ ] 이메일 회원가입/로그인 작동
- [ ] 소셜 로그인 (Google) 작동
- [ ] 비로그인 세션 데이터 → 로그인 후 마이그레이션
- [ ] 대시보드에서 실제 사용자 데이터 표시
- [ ] 재방문 시 학습 진행 상황 유지

### 권장 (Should Have)
- [ ] GitHub 소셜 로그인
- [ ] 비밀번호 재설정 기능
- [ ] 설정에서 프로필 수정 가능
- [ ] 활동 타임라인 실제 데이터

### 선택 (Nice to Have)
- [ ] 이메일 인증 (Confirm email)
- [ ] 로그인 기기 관리
- [ ] 데이터 내보내기

---

## 예상 일정

| Phase | 작업 | 예상 시간 |
|-------|------|----------|
| 1 | 인증 시스템 | 핵심 작업 |
| 2 | 대시보드 연동 | 핵심 작업 |
| 3 | 사용자 플로우 | 부가 작업 |
| 4 | 테스트/배포 | 마무리 |

---

## 리스크 및 대응

| 리스크 | 영향 | 대응 방안 |
|--------|------|----------|
| OAuth 설정 복잡성 | 중간 | 이메일 로그인 우선 구현 |
| 데이터 마이그레이션 실패 | 높음 | 트랜잭션 처리, 롤백 로직 |
| 세션 만료 처리 | 중간 | Supabase 자동 갱신 활용 |
| 모바일 OAuth 이슈 | 낮음 | 딥링크 설정 확인 |

---

## 다음 스프린트 예고

**Sprint 6: 알림 시스템 및 개인화**
- 학습 리마인더 알림
- 진행 상황 요약 이메일
- 개인화된 콘텐츠 추천
- 목표 달성 축하 알림
