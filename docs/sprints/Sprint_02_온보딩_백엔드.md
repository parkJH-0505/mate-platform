# Sprint 2: 온보딩 백엔드 연동

> **목표:** 온보딩 데이터 저장 및 사용자 인증 시스템 구축
> **기간:** -
> **상태:** 계획 중
> **선행 조건:** Sprint 1 프로토타입 완료 (UI 구현됨)

---

## 1. 스프린트 목표

### 핵심 목표
1. Supabase 연동 및 데이터베이스 스키마 구현
2. 소셜 로그인 (Google/카카오) 구현
3. 온보딩 데이터 저장 API 구현
4. 비로그인 → 로그인 전환 시 데이터 마이그레이션

### 완료 정의
- [ ] Supabase 프로젝트 생성 및 연동
- [ ] 사용자 테이블 생성 (onboarding 데이터 포함)
- [ ] Google/카카오 소셜 로그인 동작
- [ ] 온보딩 완료 시 데이터가 DB에 저장됨
- [ ] 비로그인 상태에서도 온보딩 진행 가능

---

## 2. 기술 스택 결정

### 2.1 인프라
| 기술 | 용도 | 비고 |
|------|------|------|
| Supabase | Database + Auth | PostgreSQL 기반 |
| Supabase Auth | 소셜 로그인 | Google, 카카오 지원 |

### 2.2 프론트엔드 추가
| 기술 | 용도 |
|------|------|
| @supabase/supabase-js | Supabase 클라이언트 |
| @supabase/auth-helpers-nextjs | Next.js Auth 헬퍼 |
| Zustand | 온보딩 상태 관리 (세션 저장) |

---

## 3. 데이터베이스 스키마

### 3.1 Users 테이블
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  profile_image TEXT,

  -- 온보딩 데이터
  onboarding_industry TEXT,           -- IT/테크, 커머스, F&B 등
  onboarding_stage TEXT,              -- 아이디어, 준비, MVP, 첫고객
  onboarding_business_type TEXT,      -- B2C, B2B, B2B2C
  onboarding_concerns TEXT[],         -- 고민 목록 (배열)
  onboarding_goal TEXT,               -- 6개월 목표
  onboarding_completed_at TIMESTAMPTZ,

  -- 구독 정보
  subscription_status TEXT DEFAULT 'free', -- free, active, canceled, expired
  subscription_plan TEXT,                  -- monthly, yearly
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,

  -- 메타
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
```

### 3.2 Anonymous Sessions 테이블 (비로그인 온보딩용)
```sql
CREATE TABLE anonymous_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,  -- 브라우저 세션 ID

  -- 온보딩 데이터 (Users와 동일 구조)
  onboarding_industry TEXT,
  onboarding_stage TEXT,
  onboarding_business_type TEXT,
  onboarding_concerns TEXT[],
  onboarding_goal TEXT,
  onboarding_name TEXT,

  -- 메타
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- 인덱스
CREATE INDEX idx_anonymous_session_id ON anonymous_sessions(session_id);
```

---

## 4. 태스크 목록

### 4.1 Supabase 셋업 (Day 1)

| # | 태스크 | 우선순위 | 상태 |
|---|--------|----------|------|
| 1.1 | Supabase 프로젝트 생성 | P0 | ⬜ |
| 1.2 | 환경변수 설정 (.env.local) | P0 | ⬜ |
| 1.3 | Supabase 클라이언트 라이브러리 설치 | P0 | ⬜ |
| 1.4 | Supabase 클라이언트 초기화 설정 | P0 | ⬜ |
| 1.5 | Users 테이블 생성 (SQL) | P0 | ⬜ |
| 1.6 | Anonymous Sessions 테이블 생성 | P0 | ⬜ |
| 1.7 | RLS (Row Level Security) 정책 설정 | P1 | ⬜ |

### 4.2 소셜 로그인 구현 (Day 1-2)

| # | 태스크 | 우선순위 | 상태 |
|---|--------|----------|------|
| 2.1 | Google OAuth 앱 생성 (Google Cloud Console) | P0 | ⬜ |
| 2.2 | 카카오 OAuth 앱 생성 (Kakao Developers) | P0 | ⬜ |
| 2.3 | Supabase Auth 설정 (Google, 카카오) | P0 | ⬜ |
| 2.4 | NextAuth 또는 Supabase Auth 헬퍼 설정 | P0 | ⬜ |
| 2.5 | 로그인 페이지 UI 생성 (/login) | P0 | ⬜ |
| 2.6 | 로그인 버튼 컴포넌트 (Google, 카카오) | P0 | ⬜ |
| 2.7 | 로그인 콜백 처리 (/auth/callback) | P0 | ⬜ |
| 2.8 | 로그아웃 기능 | P1 | ⬜ |
| 2.9 | 세션 상태 확인 훅 (useAuth) | P0 | ⬜ |

### 4.3 온보딩 상태 관리 (Day 2)

| # | 태스크 | 우선순위 | 상태 |
|---|--------|----------|------|
| 3.1 | Zustand 설치 | P0 | ⬜ |
| 3.2 | onboardingStore 생성 | P0 | ⬜ |
| 3.3 | 세션 스토리지 연동 (비로그인 유지) | P0 | ⬜ |
| 3.4 | 기존 온보딩 페이지에 스토어 연동 | P0 | ⬜ |
| 3.5 | 온보딩 진행 상태 복원 로직 | P1 | ⬜ |

### 4.4 온보딩 API 구현 (Day 2-3)

| # | 태스크 | 우선순위 | 상태 |
|---|--------|----------|------|
| 4.1 | API: 익명 세션 생성 (/api/sessions) | P0 | ⬜ |
| 4.2 | API: 온보딩 데이터 저장 (/api/onboarding) | P0 | ⬜ |
| 4.3 | API: 온보딩 데이터 조회 | P1 | ⬜ |
| 4.4 | 온보딩 완료 시 API 호출 연동 | P0 | ⬜ |
| 4.5 | 에러 핸들링 및 로딩 상태 | P1 | ⬜ |

### 4.5 비로그인 → 로그인 마이그레이션 (Day 3)

| # | 태스크 | 우선순위 | 상태 |
|---|--------|----------|------|
| 5.1 | 로그인 시 익명 세션 데이터 확인 | P0 | ⬜ |
| 5.2 | 익명 → 사용자 데이터 마이그레이션 API | P0 | ⬜ |
| 5.3 | 마이그레이션 후 익명 세션 삭제 | P1 | ⬜ |
| 5.4 | 온보딩 재진입 시 기존 데이터 복원 | P1 | ⬜ |

### 4.6 UI 개선 (Day 3)

| # | 태스크 | 우선순위 | 상태 |
|---|--------|----------|------|
| 6.1 | 온보딩 완료 후 로그인 유도 화면 | P0 | ⬜ |
| 6.2 | 커리큘럼 생성 전 로그인 체크 | P1 | ⬜ |
| 6.3 | 헤더에 로그인 상태 표시 | P1 | ⬜ |
| 6.4 | 로딩/에러 상태 UI | P1 | ⬜ |

---

## 5. API 엔드포인트 설계

### 5.1 인증 관련

```
POST /api/auth/login
  - 소셜 로그인 시작 (리다이렉트)

GET /api/auth/callback
  - OAuth 콜백 처리

POST /api/auth/logout
  - 로그아웃

GET /api/auth/me
  - 현재 사용자 정보
```

### 5.2 세션 관련

```
POST /api/sessions
  - 익명 세션 생성
  - Response: { sessionId: string }

GET /api/sessions/:id
  - 익명 세션 데이터 조회

DELETE /api/sessions/:id
  - 익명 세션 삭제
```

### 5.3 온보딩 관련

```
POST /api/onboarding
  - 온보딩 데이터 저장
  - Body: {
      sessionId?: string,      // 비로그인 시
      industry: string,
      stage: string,
      businessType?: string,
      concerns: string[],
      goal: string,
      name: string
    }

GET /api/onboarding
  - 현재 사용자 온보딩 데이터 조회

PUT /api/onboarding
  - 온보딩 데이터 업데이트
```

### 5.4 마이그레이션 관련

```
POST /api/onboarding/migrate
  - 익명 세션 → 사용자 마이그레이션
  - Body: { sessionId: string }
```

---

## 6. 유저 플로우

### 6.1 비로그인 → 온보딩 → 로그인

```
[랜딩 페이지]
    ↓
[CTA 클릭: "무료로 커리큘럼 받기"]
    ↓
[익명 세션 생성] ← sessionId를 localStorage에 저장
    ↓
[온보딩 Step 1-5]
    ↓
[온보딩 완료] ← 데이터를 anonymous_sessions에 저장
    ↓
[로그인 유도 화면]
"커리큘럼을 저장하려면 로그인이 필요해요"
[Google로 계속하기] [카카오로 계속하기]
    ↓
[로그인 성공]
    ↓
[익명 세션 → 사용자 마이그레이션]
    ↓
[커리큘럼 생성 화면으로 이동]
```

### 6.2 로그인 → 온보딩

```
[랜딩 페이지에서 로그인]
    ↓
[대시보드 또는 온보딩 체크]
    ↓
[온보딩 미완료 시]
    ↓
[온보딩 Step 1-5]
    ↓
[온보딩 완료] ← 데이터를 users 테이블에 직접 저장
    ↓
[커리큘럼 생성 화면으로 이동]
```

---

## 7. 상세 구현 스펙

### 7.1 Supabase 클라이언트 설정

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        }
      }
    }
  )
}
```

### 7.2 Zustand 온보딩 스토어

```typescript
// stores/onboardingStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface OnboardingState {
  // 데이터
  industry: string
  stage: string
  businessType: string
  concerns: string[]
  goal: string
  name: string

  // 메타
  currentStep: number
  sessionId: string | null

  // 액션
  setIndustry: (industry: string) => void
  setStage: (stage: string) => void
  setBusinessType: (type: string) => void
  setConcerns: (concerns: string[]) => void
  setGoal: (goal: string) => void
  setName: (name: string) => void
  setCurrentStep: (step: number) => void
  setSessionId: (id: string) => void
  reset: () => void

  // 유틸
  getOnboardingData: () => OnboardingData
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      industry: '',
      stage: '',
      businessType: '',
      concerns: [],
      goal: '',
      name: '',
      currentStep: 0,
      sessionId: null,

      setIndustry: (industry) => set({ industry }),
      setStage: (stage) => set({ stage }),
      setBusinessType: (type) => set({ businessType: type }),
      setConcerns: (concerns) => set({ concerns }),
      setGoal: (goal) => set({ goal }),
      setName: (name) => set({ name }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setSessionId: (id) => set({ sessionId: id }),
      reset: () => set({
        industry: '',
        stage: '',
        businessType: '',
        concerns: [],
        goal: '',
        name: '',
        currentStep: 0,
      }),

      getOnboardingData: () => ({
        industry: get().industry,
        stage: get().stage,
        businessType: get().businessType,
        concerns: get().concerns,
        goal: get().goal,
        name: get().name,
      })
    }),
    {
      name: 'mate-onboarding',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
```

### 7.3 로그인 페이지 컴포넌트

```typescript
// app/login/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  const handleKakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    // ... UI 구현
  )
}
```

---

## 8. 환경 변수

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OAuth (Supabase 콘솔에서 설정)
# Google: Google Cloud Console에서 OAuth 클라이언트 ID 생성
# 카카오: Kakao Developers에서 앱 생성
```

---

## 9. 체크리스트

### Day 1 체크리스트
- [ ] Supabase 프로젝트 생성
- [ ] 환경변수 설정
- [ ] 라이브러리 설치
- [ ] 데이터베이스 테이블 생성
- [ ] Google OAuth 앱 생성
- [ ] 카카오 OAuth 앱 생성
- [ ] Supabase Auth 설정

### Day 2 체크리스트
- [ ] 로그인 페이지 UI
- [ ] 소셜 로그인 동작 확인
- [ ] 세션 상태 확인 훅
- [ ] Zustand 스토어 생성
- [ ] 온보딩 페이지에 스토어 연동
- [ ] 익명 세션 API

### Day 3 체크리스트
- [ ] 온보딩 데이터 저장 API
- [ ] 온보딩 완료 시 API 호출
- [ ] 비로그인 → 로그인 마이그레이션
- [ ] 온보딩 완료 후 로그인 유도 화면
- [ ] 전체 플로우 테스트
- [ ] 에러 핸들링

---

## 10. 리스크 및 대응

| 리스크 | 영향 | 대응 |
|--------|------|------|
| OAuth 설정 복잡 | 지연 | Supabase 문서 참조, 테스트 환경 먼저 구축 |
| 카카오 로그인 검수 | 지연 | 개발 단계에서는 테스터 등록으로 진행 |
| 세션 데이터 손실 | UX 저하 | localStorage/sessionStorage 이중 저장 |
| DB 스키마 변경 | 마이그레이션 필요 | 초기에 충분히 설계, 변경 최소화 |

---

## 11. 다음 스프린트 연결

Sprint 2 완료 후 → **Sprint 3: AI 커리큘럼 생성**

Sprint 3 준비사항:
- OpenAI API 연동
- 커리큘럼 생성 프롬프트 설계
- 커리큘럼 DB 스키마
- 커리큘럼 결과 화면 (현재 목업 → 실데이터)

---

*작성일: 2025-12-06*
*상태: 계획 중*
