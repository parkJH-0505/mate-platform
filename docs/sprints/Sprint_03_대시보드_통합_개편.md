# Sprint 3: 대시보드 중심 IA 개편

> **목표:** 대시보드를 명확한 메인 허브로 만들고, 커리큘럼 콘텐츠를 대시보드에 통합
> **기간:** 2025-12-08 ~
> **상태:** 계획 수립 중
> **선행 조건:** Sprint 2 완료 (Wow 경험 고도화)

---

## 배경 및 문제점

### 현재 상태 진단

| 페이지 | 역할 | 문제점 |
|--------|------|--------|
| `/dashboard` | 홈 허브 (대시보드 레이아웃 안) | BottomNav 있음, 하지만 접근성 낮음 |
| `/curriculum` | 학습 로드맵 상세 | **독립 페이지** - 대시보드 레이아웃 밖, BottomNav 없음 |
| `/content/[id]` | 콘텐츠 학습 | 뒤로가기가 `/curriculum`으로 이동 |

### 핵심 문제

1. **커리큘럼 페이지가 대시보드 레이아웃 밖에 있음**
   - `/curriculum`은 `(dashboard)` 그룹 밖에 위치
   - BottomNavigation이 없어서 대시보드로 이동하기 어려움
   - 헤더에 "대시보드" 텍스트 링크만 있음 (눈에 안 띔)

2. **온보딩 후 커리큘럼으로 바로 이동**
   - 커리큘럼이 메인처럼 느껴짐
   - 대시보드의 존재를 모르는 사용자 발생

3. **콘텐츠 페이지에서 뒤로가기가 `/curriculum`으로 이동**
   - 학습 완료 후에도 커리큘럼으로 이동
   - 대시보드 중심 흐름이 아님

4. **정보 중복**
   - 대시보드: 오늘의 한 발 + 커리큘럼 요약 + 마일스톤
   - 커리큘럼: 오늘의 한 발 + 주차별 상세
   - 같은 정보가 두 곳에 분산

---

## 목표 상태 (To-Be)

### 새로운 IA 구조

```
온보딩 완료
    ↓
대시보드 (/dashboard) ← 메인 허브
    ├─ 개인화 환영 섹션
    ├─ 오늘의 한 발 카드 (최상단 CTA)
    ├─ 📋 내 로드맵 섹션 (NEW - 커리큘럼 통합)
    │   ├─ 주차별 아코디언/탭
    │   └─ 각 콘텐츠 클릭 → /content/[id]
    ├─ 마일스톤 카드
    └─ 나의 성장 (게이미피케이션)

콘텐츠 학습 (/content/[id])
    ├─ 뒤로가기 → /dashboard (변경)
    └─ 학습 완료 → /dashboard (변경)

커리큘럼 페이지 (/curriculum)
    → /dashboard로 리다이렉트 처리
```

### 온보딩 후 플로우 개선

```
온보딩 완료
    ↓
대시보드로 이동 (/dashboard)
    ↓
✨ 로드맵 완성 모달 표시 (NEW)
    - 개인화 요약 정보
    - 주차별 로드맵 미리보기
    - "학습 시작하기" CTA
    ↓
모달 닫기 → 대시보드에서 학습 시작
```

---

## 태스크 목록

### Phase 1: 온보딩 후 플로우 변경

| # | 태스크 | 우선순위 | 상태 | 설명 |
|---|--------|----------|------|------|
| 1.1 | 온보딩 완료 후 `/dashboard`로 이동 | P0 | ⬜ | `router.push('/curriculum')` → `router.push('/dashboard?showRoadmap=true')` |
| 1.2 | 로드맵 완성 모달 컴포넌트 생성 | P0 | ⬜ | 개인화 요약 + 주차별 미리보기 + CTA |
| 1.3 | 대시보드에서 모달 트리거 처리 | P0 | ⬜ | `showRoadmap` 쿼리 파라미터로 모달 표시 |

### Phase 2: 대시보드에 커리큘럼 통합

| # | 태스크 | 우선순위 | 상태 | 설명 |
|---|--------|----------|------|------|
| 2.1 | 대시보드 API에서 전체 커리큘럼 데이터 반환 | P0 | ⬜ | modules, contents 포함 |
| 2.2 | "내 로드맵" 섹션 컴포넌트 생성 | P0 | ⬜ | 주차별 아코디언 형태 |
| 2.3 | 콘텐츠 목록 표시 (완료/미완료 상태) | P0 | ⬜ | 현재 주차 자동 펼침 |
| 2.4 | 기존 "Current Curriculum Card" 제거 또는 통합 | P1 | ⬜ | 중복 제거 |

### Phase 3: 콘텐츠 페이지 네비게이션 수정

| # | 태스크 | 우선순위 | 상태 | 설명 |
|---|--------|----------|------|------|
| 3.1 | 뒤로가기 버튼 `/dashboard`로 변경 | P0 | ⬜ | 헤더의 뒤로가기 버튼 |
| 3.2 | 학습 완료 후 이동 경로 변경 | P0 | ⬜ | 다음 콘텐츠 없으면 `/dashboard`로 |
| 3.3 | 사이드바 "커리큘럼 보기" 버튼 제거/변경 | P1 | ⬜ | "대시보드로" 또는 제거 |
| 3.4 | Paywall 닫기 시 이동 경로 변경 | P1 | ⬜ | `/curriculum` → `/dashboard` |
| 3.5 | 에러 상태에서 이동 경로 변경 | P1 | ⬜ | "커리큘럼으로 돌아가기" → "대시보드로" |

### Phase 4: 커리큘럼 페이지 처리

| # | 태스크 | 우선순위 | 상태 | 설명 |
|---|--------|----------|------|------|
| 4.1 | `/curriculum` 접근 시 `/dashboard`로 리다이렉트 | P0 | ⬜ | 기존 URL 호환성 |
| 4.2 | 관련 링크들 점검 및 수정 | P1 | ⬜ | 전체 앱에서 `/curriculum` 링크 |

### Phase 5: 기타 파일 수정

| # | 태스크 | 우선순위 | 상태 | 설명 |
|---|--------|----------|------|------|
| 5.1 | `payment/success/page.tsx` 수정 | P1 | ⬜ | 결제 완료 후 이동 경로 |
| 5.2 | `onboarding/complete/page.tsx` 검토 | P2 | ⬜ | 현재 사용 여부 확인 |

---

## 수정 대상 파일

### 필수 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `app/onboarding/page.tsx` | 완료 후 `/dashboard?showRoadmap=true`로 이동 |
| `app/(dashboard)/dashboard/page.tsx` | 로드맵 모달 + 커리큘럼 섹션 통합 |
| `app/content/[id]/page.tsx` | 모든 `/curriculum` → `/dashboard` 변경 |
| `app/curriculum/page.tsx` | `/dashboard`로 리다이렉트 |

### 추가 수정 파일 (점검 필요)

| 파일 | 확인 내용 |
|------|-----------|
| `app/payment/success/page.tsx` | `/curriculum` 링크 확인 |
| `app/onboarding/complete/page.tsx` | 사용 여부 및 경로 확인 |
| `components/Paywall.tsx` | 닫기 시 이동 경로 |

---

## 새로 생성할 컴포넌트

### 1. RoadmapModal (로드맵 완성 모달)

```tsx
// app/(dashboard)/components/RoadmapModal.tsx
interface RoadmapModalProps {
  isOpen: boolean
  onClose: () => void
  curriculum: {
    userName: string
    industry: string
    stage: string
    goal: string
    durationWeeks: number
    modules: Array<{
      week: number
      title: string
      contents: Array<{ id: string; title: string }>
    }>
  }
}
```

**포함 내용:**
- 개인화 요약 (이름, 산업, 단계, 목표)
- 주차별 로드맵 미리보기 (Week 1-3 타임라인)
- "학습 시작하기" CTA 버튼
- 닫기 버튼

### 2. CurriculumSection (대시보드용 커리큘럼 섹션)

```tsx
// app/(dashboard)/components/CurriculumSection.tsx
interface CurriculumSectionProps {
  modules: CurriculumModule[]
  completedIds: string[]
  onContentClick: (contentId: string) => void
}
```

**포함 내용:**
- 주차별 아코디언 (현재 주차 자동 펼침)
- 각 콘텐츠 행 (완료/미완료 표시, 클릭 이동)
- 주차별 진행률 표시

---

## UI/UX 상세 설계

### 로드맵 완성 모달

```
┌─────────────────────────────────────┐
│              × (닫기)               │
│                                     │
│     🎉 [이름]님의 로드맵 완성!      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ IT/소프트웨어 · 아이디어 단계 │   │
│  │ 목표: 아이디어 검증 완료      │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Week 1] ─── [Week 2] ─── [Week 3] │
│   고객발굴      PMF검증     MVP설계  │
│                                     │
│  총 12개 콘텐츠 · 3주 로드맵        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     👟 학습 시작하기         │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 대시보드 내 로드맵 섹션

```
┌─────────────────────────────────────┐
│ 📚 내 로드맵                    ▾   │
├─────────────────────────────────────┤
│                                     │
│ ▼ 1주차: 고객 발굴 (2/4 완료)       │
│   ├─ ✅ 타겟 고객 정의하기          │
│   ├─ ✅ 고객 인터뷰 방법론          │
│   ├─ ⬜ 첫 고객 찾는 방법           │
│   └─ ⬜ 인터뷰 질문 작성법          │
│                                     │
│ ▶ 2주차: PMF 검증 (0/4)             │
│                                     │
│ ▶ 3주차: MVP 설계 (0/4)             │
│                                     │
└─────────────────────────────────────┘
```

---

## 참고: 현재 `/curriculum` 링크 위치

```bash
# grep 결과: router.push('/curriculum' 사용 위치

1. app/onboarding/page.tsx
   - 온보딩 완료 후 커리큘럼 이동

2. app/(dashboard)/dashboard/page.tsx
   - handleViewCurriculum 함수
   - 빠른 메뉴 "내 커리큘럼" 버튼

3. app/content/[id]/page.tsx
   - 뒤로가기 버튼 (헤더)
   - 다음 콘텐츠 없을 때 이동
   - Paywall 닫을 때 이동
   - 에러 상태에서 이동
   - 사이드바 "커리큘럼 보기" 버튼
   - 모바일 하단바 버튼

4. app/payment/success/page.tsx
   - 결제 완료 후 이동 (확인 필요)

5. app/onboarding/complete/page.tsx
   - 소셜 로그인 후 이동 (확인 필요)
```

---

## 예상 작업 순서

1. **Phase 1** (온보딩 플로우) - 먼저 진행
   - 사용자가 처음 접하는 흐름이므로 우선 수정

2. **Phase 2** (대시보드 통합) - 핵심 작업
   - 커리큘럼 섹션 추가로 대시보드 완성도 향상

3. **Phase 3** (콘텐츠 페이지) - 연속 작업
   - 학습 흐름에서 대시보드 중심으로 전환

4. **Phase 4** (리다이렉트) - 마무리
   - 기존 URL 호환성 유지

5. **Phase 5** (기타) - 점검
   - 누락된 링크들 확인

---

*최종 수정: 2025-12-08*
*상태: 계획 수립 완료, 구현 대기*
