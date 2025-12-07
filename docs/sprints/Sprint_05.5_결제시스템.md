# Sprint 5.5: 결제 시스템 (Paywall & 토스페이먼츠)

## 목표
- 토스페이먼츠 연동으로 월 구독 결제 구현
- Paywall로 두 번째 콘텐츠부터 결제 유도
- 구독 상태 관리 및 콘텐츠 접근 제어

---

## 상태: ✅ 완료

---

## 비즈니스 모델

| 플랜 | 가격 | 포함 내용 |
|------|------|----------|
| **무료** | 0원 | 온보딩 + 커리큘럼 생성 + 첫 콘텐츠 1개 |
| **월 구독** | 17,000원/월 | 모든 콘텐츠 무제한, AI 커리큘럼 무제한 |
| **연 구독** | 170,000원/년 | 동일 + 17% 할인 |

---

## 구현된 기능

### 1. 결제 API
- **POST /api/payments/create** - 결제 요청 생성
- **POST /api/payments/confirm** - 결제 승인 (토스 결제 완료 후 호출)
- **GET /api/subscriptions/status** - 구독 상태 확인
- **POST /api/subscriptions/cancel** - 구독 취소

### 2. UI 컴포넌트
- **Paywall** (`components/Paywall.tsx`) - 구독 유도 모달
- **결제 페이지** (`app/payment/page.tsx`) - 플랜 선택 및 결제
- **결제 완료** (`app/payment/success/page.tsx`) - 결제 성공 화면
- **구독 관리** (`app/(dashboard)/components/settings/SubscriptionSection.tsx`)

### 3. 콘텐츠 접근 제어
- 첫 번째 콘텐츠: 무료 (contentIndex === 0)
- 두 번째 이후: 구독 필요
- 콘텐츠 페이지에서 Paywall 자동 표시
- 블러 오버레이로 프리미엄 콘텐츠 표시

### 4. 커스텀 훅
- **useSubscription** (`hooks/useSubscription.ts`) - 구독 상태 관리

---

## 파일 구조

```
app/
├── api/
│   ├── payments/
│   │   ├── create/route.ts      ✅ 결제 요청 생성
│   │   └── confirm/route.ts     ✅ 결제 승인
│   └── subscriptions/
│       ├── status/route.ts      ✅ 구독 상태 확인
│       └── cancel/route.ts      ✅ 구독 취소
├── payment/
│   ├── page.tsx                 ✅ 결제 페이지
│   └── success/page.tsx         ✅ 결제 완료
├── content/[id]/
│   └── page.tsx                 ✅ Paywall 통합
└── (dashboard)/
    └── components/settings/
        └── SubscriptionSection.tsx  ✅ 구독 관리

components/
└── Paywall.tsx                  ✅ Paywall 모달

hooks/
└── useSubscription.ts           ✅ 구독 훅

supabase/migrations/
└── 005_subscriptions.sql        ✅ DB 스키마
```

---

## 환경 변수 설정

`.env.local` 파일에 다음을 추가:

```env
# 토스페이먼츠 (https://developers.tosspayments.com/)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...  # 클라이언트 키
TOSS_SECRET_KEY=test_sk_...               # 시크릿 키
```

### 토스페이먼츠 설정 방법
1. [토스페이먼츠 개발자센터](https://developers.tosspayments.com/) 가입
2. 테스트 가맹점 생성
3. 연동 > 연동 정보에서 Client Key, Secret Key 복사
4. 환경 변수에 설정

---

## 데이터베이스 설정

Supabase SQL Editor에서 실행:

```sql
-- supabase/migrations/005_subscriptions.sql 파일 내용 실행
```

또는 마이그레이션 명령:
```bash
npx supabase db push
```

---

## 태스크 목록

### Phase 1: 기반 ✅
- [x] 토스페이먼츠 SDK 설치 (`@tosspayments/payment-sdk`)
- [x] subscriptions 테이블 생성
- [x] payment_history 테이블 생성
- [x] 환경변수 설정

### Phase 2: API ✅
- [x] POST /api/payments/create
- [x] POST /api/payments/confirm
- [x] GET /api/subscriptions/status
- [x] POST /api/subscriptions/cancel

### Phase 3: UI ✅
- [x] Paywall 컴포넌트
- [x] 결제 페이지
- [x] 결제 완료 페이지
- [x] 구독 관리 (설정 페이지)

### Phase 4: 통합 ✅
- [x] 콘텐츠 페이지에 Paywall 적용
- [x] 구독 상태에 따른 UI 변경
- [x] 콘텐츠 API에 구독 체크 추가

---

## 완료 조건 ✅

- [x] 두 번째 콘텐츠 클릭 시 Paywall 노출
- [x] 토스페이먼츠로 결제 가능
- [x] 결제 완료 후 모든 콘텐츠 접근 가능
- [x] 구독 상태가 DB에 저장됨
- [x] 설정에서 구독 상태 확인/해지 가능

---

## 테스트 방법

### 1. 테스트 결제
- 토스페이먼츠 테스트 모드에서는 실제 결제 없이 테스트 가능
- 테스트 카드 번호: `9430-0000-0000-0001`

### 2. 플로우 테스트
1. 온보딩 완료 후 첫 번째 콘텐츠 학습 (무료)
2. 두 번째 콘텐츠 클릭 → Paywall 노출
3. "구독 시작하기" 클릭 → 결제 페이지
4. 플랜 선택 후 "결제하기" → 토스페이먼츠 결제창
5. 결제 완료 → 성공 페이지 → 커리큘럼으로 이동
6. 모든 콘텐츠 접근 가능 확인
7. 설정 → 구독 섹션에서 상태 확인

---

## 향후 개선사항

- [ ] 자동 결제 (빌링키 방식)
- [ ] 결제 웹훅 처리
- [ ] 결제 실패 시 재시도 로직
- [ ] 결제 내역 조회 페이지
- [ ] 영수증 발급 기능
