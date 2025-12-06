# Visible.vc Design System

Visible.vc Data Rooms 테마 기반의 재사용 가능한 컴포넌트 라이브러리입니다.

## 시작하기

### 1. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 2. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열어 확인하세요.

## 프로젝트 구조

```
visible-vc-project/
├── app/                    # Next.js 13+ App Router
│   ├── page.tsx           # 홈페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── globals.css        # 글로벌 스타일
│   └── components/
│       └── page.tsx       # 컴포넌트 데모 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── Button.tsx        # 버튼 컴포넌트
│   ├── Card.tsx          # 카드 컴포넌트
│   ├── Input.tsx         # 폼 입력 컴포넌트
│   ├── Typography.tsx    # 타이포그래피 컴포넌트
│   ├── Navigation.tsx    # 네비게이션 컴포넌트
│   ├── Modal.tsx         # 모달 & 알림 컴포넌트
│   └── index.ts          # 컴포넌트 내보내기
├── lib/
│   └── theme.ts          # 테마 설정 (중앙화)
└── public/               # 정적 파일
```

## 주요 컴포넌트

### 1. **Button**
- Variants: `primary`, `secondary`, `ghost`
- Sizes: `small`, `medium`, `large`
- States: `loading`, `disabled`
- Props: `icon`, `fullWidth` 등

### 2. **Card**
- Variants: `default`, `bordered`, `elevated`, `glass`
- 구성요소: `CardHeader`, `CardBody`, `CardFooter`
- `CardGrid`: 여러 카드를 그리드로 배치

### 3. **Typography**
- `Heading`: h1~h6 제목
- `Text`: 일반 텍스트
- `Label`: 폼 라벨
- `Link`: 링크
- `Badge`: 배지

### 4. **Input**
- `Input`: 텍스트 입력
- `Textarea`: 여러 줄 입력
- `Select`: 드롭다운
- `Checkbox`: 체크박스
- `Radio`: 라디오 버튼
- `Switch`: 토글 스위치

### 5. **Navigation**
- `Navigation`: 상단 네비게이션 바
- `Breadcrumb`: 경로 표시
- `Tabs`: 탭 네비게이션
- `Sidebar`: 사이드바 메뉴

### 6. **Table**
- `Table`: 데이터 테이블
- Features: `striped`, `hoverable`, `bordered`, `compact`
- Components: `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
- `Pagination`: 페이지네이션

### 7. **Progress**
- `ProgressBar`: 진행 표시줄
- `CircularProgress`: 원형 진행 표시
- `Spinner`: 로딩 스피너
- `Skeleton`: 스켈레톤 로딩
- `LoadingOverlay`: 로딩 오버레이

### 8. **Avatar & User**
- `Avatar`: 사용자 아바타
- `AvatarGroup`: 아바타 그룹
- `Chip`: 인터랙티브 칩/태그
- `Divider`: 구분선

### 9. **Overlay**
- `Dropdown`: 드롭다운 메뉴
- `Tooltip`: 툴팁
- `Popover`: 팝오버
- `ContextMenu`: 컨텍스트 메뉴

### 10. **Modal & Alert**
- `Modal`: 모달 대화상자
- `Alert`: 알림 메시지
- `Toast`: 토스트 알림
- `Dialog`: 확인 대화상자

## 테마 커스터마이징

`lib/theme.ts` 파일에서 테마를 수정할 수 있습니다:

```typescript
export const theme = {
  colors: {
    primary: {
      main: "rgb(15, 82, 222)",
      hover: "rgb(12, 66, 178)",
      light: "rgba(15, 82, 222, 0.1)"
    },
    // ... 다른 색상들
  },
  // ... 다른 테마 설정
}
```

## 컴포넌트 사용 예시

```tsx
import { Button, Card, CardBody, Heading, Text } from '@/components'

export default function Example() {
  return (
    <Card>
      <CardBody>
        <Heading as="h3">제목</Heading>
        <Text>내용</Text>
        <Button variant="primary" onClick={() => alert('클릭!')}>
          버튼
        </Button>
      </CardBody>
    </Card>
  )
}
```

## 스타일링

이 프로젝트는 Tailwind CSS를 사용합니다. 커스텀 클래스를 추가하거나 기존 유틸리티 클래스를 사용할 수 있습니다.

## 빌드

프로덕션 빌드를 생성하려면:

```bash
npm run build
# 또는
yarn build
```

## 라이선스

이 프로젝트는 Visible.vc 테마를 기반으로 제작되었습니다.
