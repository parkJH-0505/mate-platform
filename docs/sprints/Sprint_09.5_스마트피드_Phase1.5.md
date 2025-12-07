# Sprint 09.5: 스마트 피드 시스템 - Phase 1.5 (피드 & 탐색)

> **목표**: 대시보드 스마트 피드 카드 + 콘텐츠 탐색(Explore) 페이지 구현
> **참조 기획**: [11_실행기반_경험설계.md](../../../../docs/11_실행기반_경험설계.md) - Section 11, 12, 13

---

## 개요

| 항목 | 내용 |
|------|------|
| **Sprint 목표** | 개인화된 추천 피드와 전체 콘텐츠 탐색 시스템 구현 |
| **핵심 산출물** | 스마트 피드 카드, Explore 페이지, 콘텐츠 분류 시스템 |
| **선행 조건** | Phase 1 완료 (Today's Plan, Action System) |
| **의존성** | 기존 curriculum_contents 테이블, 사용자 진행 데이터 |

---

## 설계 철학

### "피드"가 아닌 "컨트롤 센터"

| ❌ 하지 않을 것 | ✅ 할 것 |
|----------------|---------|
| 무한 스크롤 중독 유도 | 목적 지향적 카드 구성 (최대 3-7개) |
| 시간 낭비 콘텐츠 | 실행과 연결된 추천만 표시 |
| 알고리즘 블랙박스 | "왜 추천하는지" 명시 |
| 수동적 시청 | 능동적 실행 유도 |

### 피드 구성 원칙

1. **실행 연결성**: 모든 추천은 "지금 할 수 있는 것"과 연결
2. **맥락 기반**: 현재 학습 단계, 산업, 레벨에 맞춤
3. **투명한 이유**: "왜 이걸 추천하는지" 항상 표시
4. **적정 분량**: 압도하지 않는 3-7개 카드

---

## 현황 진단

### 1. 기존 데이터베이스 상태

| 테이블 | 상태 | 현재 컬럼 | 확장 필요 |
|--------|------|-----------|----------|
| curriculum_contents | ✅ 존재 | title, content_type, duration_minutes | category, level, tags, is_popular |
| user_progress | ✅ 존재 | content_id, completed_at | - |
| user_actions | ✅ 존재 | action_id, status | - |
| (신규) user_saved_contents | ❌ 없음 | - | 저장 기능 |
| (신규) user_content_likes | ❌ 없음 | - | 좋아요 기능 |
| (신규) user_content_views | ❌ 없음 | - | 조회 기록 |

### 2. 현재 UI 상태

| 컴포넌트 | 상태 | 용도 |
|----------|------|------|
| TodaysPlanCard | ✅ 구현됨 | 오늘의 플랜 |
| ContinueCard | ✅ 존재 | 이어보기 |
| 추천 카드 | ❌ 없음 | 이번 주 추천 |
| 최근 활동 카드 | ❌ 없음 | 나의 최근 7일 |
| Explore 페이지 | ❌ 없음 | 콘텐츠 탐색 |

### 3. 콘텐츠 분류 체계 (신규)

**카테고리 (9개)**
```
법률/행정 | 마인드셋 | 아이디어 | 검증
MVP/개발 | 성장/스케일 | 성공사례 | 투자/IR | 정부지원
```

**레벨 (5단계)**
```
1: 입문 (처음 시작)
2: 초급 (기초 이해)
3: 중급 (실무 적용)
4: 고급 (심화 전략)
5: 전문가 (마스터)
```

**콘텐츠 유형**
```
video | article | template | project | audio
```

---

## Iteration 상세 계획

### Iteration 1.5-1: 데이터베이스 확장 (Day 1)

#### 목표
- curriculum_contents 테이블 확장
- 사용자 인터랙션 테이블 생성
- 인기도/추천 관련 인덱스 추가

#### 작업 내용

##### Task 1.5.1.1: 마이그레이션 파일 생성
```
파일: supabase/migrations/010_content_feed_system.sql
```

**curriculum_contents 확장**
```sql
-- 콘텐츠 분류 필드 추가
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 2 CHECK (level BETWEEN 1 AND 5);
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS industry_tags TEXT[] DEFAULT '{}';

-- 인기도/추천 관련 필드
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS save_count INTEGER DEFAULT 0;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS featured_reason TEXT;

-- 메타데이터
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE curriculum_contents ADD COLUMN IF NOT EXISTS preview_text TEXT;

-- 카테고리 ENUM (선택적)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_category') THEN
    CREATE TYPE content_category AS ENUM (
      'legal',        -- 법률/행정
      'mindset',      -- 마인드셋
      'idea',         -- 아이디어
      'validation',   -- 검증
      'mvp',          -- MVP/개발
      'growth',       -- 성장/스케일
      'case_study',   -- 성공사례
      'investment',   -- 투자/IR
      'government'    -- 정부지원
    );
  END IF;
END $$;
```

**테이블: user_saved_contents (콘텐츠 저장)**
```sql
CREATE TABLE IF NOT EXISTS user_saved_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  content_id UUID REFERENCES curriculum_contents(id) ON DELETE CASCADE NOT NULL,

  folder TEXT DEFAULT 'default',  -- 폴더 분류 (나중 확장용)
  notes TEXT,                      -- 개인 메모

  saved_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_or_session_save CHECK (user_id IS NOT NULL OR session_id IS NOT NULL),
  CONSTRAINT unique_user_save UNIQUE NULLS NOT DISTINCT (user_id, content_id),
  CONSTRAINT unique_session_save UNIQUE NULLS NOT DISTINCT (session_id, content_id)
);

CREATE INDEX idx_saved_contents_user ON user_saved_contents(user_id);
CREATE INDEX idx_saved_contents_session ON user_saved_contents(session_id);
CREATE INDEX idx_saved_contents_content ON user_saved_contents(content_id);
CREATE INDEX idx_saved_contents_date ON user_saved_contents(saved_at DESC);
```

**테이블: user_content_likes (좋아요)**
```sql
CREATE TABLE IF NOT EXISTS user_content_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  content_id UUID REFERENCES curriculum_contents(id) ON DELETE CASCADE NOT NULL,

  liked_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_or_session_like CHECK (user_id IS NOT NULL OR session_id IS NOT NULL),
  CONSTRAINT unique_user_like UNIQUE NULLS NOT DISTINCT (user_id, content_id),
  CONSTRAINT unique_session_like UNIQUE NULLS NOT DISTINCT (session_id, content_id)
);

CREATE INDEX idx_content_likes_user ON user_content_likes(user_id);
CREATE INDEX idx_content_likes_content ON user_content_likes(content_id);
```

**테이블: user_content_views (조회 기록)**
```sql
CREATE TABLE IF NOT EXISTS user_content_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  content_id UUID REFERENCES curriculum_contents(id) ON DELETE CASCADE NOT NULL,

  view_duration_seconds INTEGER DEFAULT 0,
  completion_rate NUMERIC(5,2) DEFAULT 0,  -- 0.00 ~ 100.00

  viewed_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_or_session_view CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX idx_content_views_user ON user_content_views(user_id);
CREATE INDEX idx_content_views_content ON user_content_views(content_id);
CREATE INDEX idx_content_views_date ON user_content_views(viewed_at DESC);
```

**트리거: 인기도 카운터 자동 업데이트**
```sql
-- 좋아요 카운트 업데이트
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE curriculum_contents SET like_count = like_count + 1 WHERE id = NEW.content_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE curriculum_contents SET like_count = like_count - 1 WHERE id = OLD.content_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_like_count
  AFTER INSERT OR DELETE ON user_content_likes
  FOR EACH ROW EXECUTE FUNCTION update_like_count();

-- 저장 카운트 업데이트
CREATE OR REPLACE FUNCTION update_save_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE curriculum_contents SET save_count = save_count + 1 WHERE id = NEW.content_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE curriculum_contents SET save_count = save_count - 1 WHERE id = OLD.content_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_save_count
  AFTER INSERT OR DELETE ON user_saved_contents
  FOR EACH ROW EXECUTE FUNCTION update_save_count();

-- 조회수 업데이트 (중복 허용, 조회마다 증가)
CREATE OR REPLACE FUNCTION update_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE curriculum_contents SET view_count = view_count + 1 WHERE id = NEW.content_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_view_count
  AFTER INSERT ON user_content_views
  FOR EACH ROW EXECUTE FUNCTION update_view_count();
```

**RLS 정책**
```sql
-- user_saved_contents
ALTER TABLE user_saved_contents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own saves" ON user_saved_contents
  FOR ALL USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- user_content_likes
ALTER TABLE user_content_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own likes" ON user_content_likes
  FOR ALL USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- user_content_views
ALTER TABLE user_content_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own views" ON user_content_views
  FOR ALL USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );
```

##### Task 1.5.1.2: 샘플 데이터 업데이트

```sql
-- 기존 콘텐츠에 분류 정보 추가 (예시)
UPDATE curriculum_contents SET
  category = 'legal',
  level = 1,
  tags = ARRAY['사업자등록', '법인설립', '필수'],
  industry_tags = ARRAY['all']
WHERE title LIKE '%사업자%' OR title LIKE '%법인%';

UPDATE curriculum_contents SET
  category = 'idea',
  level = 2,
  tags = ARRAY['아이디어', '검증', '시장조사'],
  industry_tags = ARRAY['tech', 'service']
WHERE title LIKE '%아이디어%' OR title LIKE '%검증%';

-- 인기 콘텐츠 지정
UPDATE curriculum_contents SET is_popular = true
WHERE view_count > 100 OR like_count > 20;

-- 추천 콘텐츠 지정
UPDATE curriculum_contents SET
  is_featured = true,
  featured_reason = '이번 주 가장 많이 본 콘텐츠'
WHERE id IN (SELECT id FROM curriculum_contents ORDER BY view_count DESC LIMIT 5);
```

#### 검증 체크리스트
- [ ] 마이그레이션 문법 오류 없음
- [ ] 기존 테이블 데이터 영향 없음
- [ ] 트리거 함수 정상 작동
- [ ] RLS 정책 테스트 완료

---

### Iteration 1.5-2: API 엔드포인트 구현 (Day 2-3)

#### 목표
- 추천 콘텐츠 API
- 콘텐츠 목록/검색 API
- 저장/좋아요/조회 API
- 사용자 활동 요약 API

#### 파일 구조
```
app/api/
├── feed/
│   ├── recommendations/
│   │   └── route.ts          # GET: 이번 주 추천
│   └── activity/
│       └── route.ts          # GET: 최근 7일 활동
├── contents/
│   ├── route.ts              # GET: 콘텐츠 목록 (필터/검색)
│   ├── popular/
│   │   └── route.ts          # GET: 인기 콘텐츠
│   └── [id]/
│       ├── route.ts          # GET: 콘텐츠 상세
│       ├── save/
│       │   └── route.ts      # POST/DELETE: 저장
│       ├── like/
│       │   └── route.ts      # POST/DELETE: 좋아요
│       └── view/
│           └── route.ts      # POST: 조회 기록
└── categories/
    └── route.ts              # GET: 카테고리 목록
```

##### Task 1.5.2.1: 추천 콘텐츠 API

**GET /api/feed/recommendations**
```typescript
// app/api/feed/recommendations/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  const limit = parseInt(searchParams.get('limit') || '5')

  const { data: { user } } = await supabase.auth.getUser()

  // 1. 사용자 컨텍스트 수집
  const userContext = await getUserContext(supabase, user?.id, sessionId)

  // 2. 추천 우선순위 적용
  const recommendations = await getRecommendations(supabase, userContext, limit)

  // 3. 추천 이유 생성
  const enrichedRecommendations = recommendations.map(content => ({
    ...content,
    recommendReason: generateRecommendReason(content, userContext)
  }))

  return NextResponse.json({
    success: true,
    recommendations: enrichedRecommendations,
    context: {
      currentLevel: userContext.level,
      currentModule: userContext.currentModule,
      industry: userContext.industry
    }
  })
}

async function getUserContext(supabase: any, userId?: string, sessionId?: string) {
  // 사용자의 현재 상태 분석
  // - 현재 진행 중인 모듈
  // - 완료한 콘텐츠 수
  // - 관심 산업
  // - 레벨 (진행률 기반 추정)

  let context = {
    level: 2,
    currentModule: null,
    industry: null,
    completedContentIds: [] as string[],
    recentCategories: [] as string[]
  }

  // 진행 상태 조회
  if (userId || sessionId) {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('content_id, curriculum_contents(category)')
      .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${sessionId}`)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(20)

    if (progress) {
      context.completedContentIds = progress.map((p: any) => p.content_id)
      context.recentCategories = progress
        .map((p: any) => p.curriculum_contents?.category)
        .filter(Boolean)
    }

    // 현재 커리큘럼 진행 상태
    const { data: curriculum } = await supabase
      .from('user_curricula')
      .select('current_module_id')
      .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${sessionId}`)
      .single()

    if (curriculum) {
      context.currentModule = curriculum.current_module_id
    }
  }

  return context
}

async function getRecommendations(supabase: any, context: any, limit: number) {
  // 추천 우선순위:
  // 1. 현재 커리큘럼 관련 (다음 학습할 것)
  // 2. 같은 레벨의 인기 콘텐츠
  // 3. 관심 산업 관련
  // 4. 신규 콘텐츠
  // 5. 추천 지정된 콘텐츠

  let query = supabase
    .from('curriculum_contents')
    .select(`
      id, title, content_type, duration_minutes, thumbnail_url,
      category, level, tags, view_count, like_count,
      is_featured, featured_reason
    `)
    .eq('is_active', true)

  // 이미 완료한 콘텐츠 제외
  if (context.completedContentIds.length > 0) {
    query = query.not('id', 'in', `(${context.completedContentIds.join(',')})`)
  }

  // 레벨 필터 (±1 범위)
  query = query
    .gte('level', Math.max(1, context.level - 1))
    .lte('level', Math.min(5, context.level + 1))

  // 정렬: 추천 > 인기 > 최신
  query = query
    .order('is_featured', { ascending: false })
    .order('view_count', { ascending: false })
    .limit(limit)

  const { data, error } = await query

  return data || []
}

function generateRecommendReason(content: any, context: any): string {
  if (content.is_featured && content.featured_reason) {
    return content.featured_reason
  }

  if (content.level === context.level) {
    return '현재 레벨에 딱 맞는 콘텐츠'
  }

  if (content.view_count > 100) {
    return `${content.view_count}명이 시청한 인기 콘텐츠`
  }

  if (context.recentCategories.includes(content.category)) {
    return '최근 관심사와 연결된 콘텐츠'
  }

  return '당신의 성장을 위한 추천'
}
```

##### Task 1.5.2.2: 최근 활동 API

**GET /api/feed/activity**
```typescript
// app/api/feed/activity/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  const days = parseInt(searchParams.get('days') || '7')

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sinceDate = new Date()
  sinceDate.setDate(sinceDate.getDate() - days)

  // 1. 성장 로그 통계
  let logsQuery = supabase
    .from('growth_logs')
    .select('log_type, logged_at')
    .gte('logged_at', sinceDate.toISOString())

  if (user) {
    logsQuery = logsQuery.eq('user_id', user.id)
  } else {
    logsQuery = logsQuery.eq('session_id', sessionId)
  }

  const { data: logs } = await logsQuery

  // 2. 완료한 콘텐츠 수
  let progressQuery = supabase
    .from('user_progress')
    .select('id, completed_at')
    .eq('status', 'completed')
    .gte('completed_at', sinceDate.toISOString())

  if (user) {
    progressQuery = progressQuery.eq('user_id', user.id)
  } else {
    progressQuery = progressQuery.eq('session_id', sessionId)
  }

  const { data: completedContent } = await progressQuery

  // 3. 제출한 미션 수
  let actionsQuery = supabase
    .from('user_actions')
    .select('id, submitted_at')
    .in('status', ['submitted', 'completed'])
    .gte('submitted_at', sinceDate.toISOString())

  if (user) {
    actionsQuery = actionsQuery.eq('user_id', user.id)
  } else {
    actionsQuery = actionsQuery.eq('session_id', sessionId)
  }

  const { data: completedActions } = await actionsQuery

  // 4. 활동 일수 계산
  const activeDays = new Set([
    ...(logs || []).map(l => l.logged_at.split('T')[0]),
    ...(completedContent || []).map(c => c.completed_at?.split('T')[0]),
    ...(completedActions || []).map(a => a.submitted_at?.split('T')[0])
  ].filter(Boolean)).size

  // 5. 통계 생성
  const stats = {
    period: `최근 ${days}일`,
    activeDays,
    totalDays: days,
    activeRate: Math.round((activeDays / days) * 100),
    contentsCompleted: completedContent?.length || 0,
    actionsCompleted: completedActions?.length || 0,
    totalActivities: (logs?.length || 0),

    // 일별 활동 데이터 (차트용)
    dailyActivity: generateDailyActivity(logs, completedContent, completedActions, days)
  }

  // 6. 인사이트 생성
  const insights = generateActivityInsights(stats)

  return NextResponse.json({
    success: true,
    activity: stats,
    insights
  })
}

function generateDailyActivity(
  logs: any[] | null,
  contents: any[] | null,
  actions: any[] | null,
  days: number
) {
  const activity: Record<string, number> = {}

  // 지난 N일 초기화
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    activity[date.toISOString().split('T')[0]] = 0
  }

  // 활동 카운트
  logs?.forEach(l => {
    const date = l.logged_at.split('T')[0]
    if (activity[date] !== undefined) activity[date]++
  })

  contents?.forEach(c => {
    const date = c.completed_at?.split('T')[0]
    if (date && activity[date] !== undefined) activity[date]++
  })

  actions?.forEach(a => {
    const date = a.submitted_at?.split('T')[0]
    if (date && activity[date] !== undefined) activity[date]++
  })

  return Object.entries(activity)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

function generateActivityInsights(stats: any): string[] {
  const insights: string[] = []

  if (stats.activeRate >= 70) {
    insights.push('🔥 꾸준히 잘 하고 있어요!')
  } else if (stats.activeRate >= 40) {
    insights.push('💪 조금만 더 힘내봐요')
  } else {
    insights.push('🌱 다시 시작하는 것도 괜찮아요')
  }

  if (stats.actionsCompleted > 0) {
    insights.push(`✅ ${stats.actionsCompleted}개의 미션을 완료했어요`)
  }

  if (stats.contentsCompleted >= 5) {
    insights.push('📚 학습왕! 콘텐츠를 많이 봤네요')
  }

  return insights
}
```

##### Task 1.5.2.3: 콘텐츠 목록/검색 API

**GET /api/contents**
```typescript
// app/api/contents/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  // 필터 파라미터
  const category = searchParams.get('category')
  const level = searchParams.get('level')
  const contentType = searchParams.get('type')
  const search = searchParams.get('q')
  const tags = searchParams.get('tags')?.split(',')
  const sort = searchParams.get('sort') || 'popular' // popular, newest, az

  // 페이지네이션
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  let query = supabase
    .from('curriculum_contents')
    .select(`
      id, title, content_type, duration_minutes, thumbnail_url,
      category, level, tags, view_count, like_count, save_count,
      preview_text, created_at
    `, { count: 'exact' })
    .eq('is_active', true)

  // 필터 적용
  if (category) {
    query = query.eq('category', category)
  }

  if (level) {
    query = query.eq('level', parseInt(level))
  }

  if (contentType) {
    query = query.eq('content_type', contentType)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,preview_text.ilike.%${search}%`)
  }

  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags)
  }

  // 정렬
  switch (sort) {
    case 'popular':
      query = query.order('view_count', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'az':
      query = query.order('title', { ascending: true })
      break
    case 'likes':
      query = query.order('like_count', { ascending: false })
      break
  }

  // 페이지네이션
  query = query.range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    contents: data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil((count || 0) / limit),
      hasMore: offset + limit < (count || 0)
    }
  })
}
```

##### Task 1.5.2.4: 인기 콘텐츠 API

**GET /api/contents/popular**
```typescript
// app/api/contents/popular/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const period = searchParams.get('period') || 'week' // week, month, all
  const limit = parseInt(searchParams.get('limit') || '10')

  let query = supabase
    .from('curriculum_contents')
    .select(`
      id, title, content_type, duration_minutes, thumbnail_url,
      category, level, view_count, like_count
    `)
    .eq('is_active', true)

  // 기간별 필터 (조회수 기준)
  // 실제로는 user_content_views에서 기간별로 집계해야 함
  // 여기서는 단순화를 위해 전체 view_count 사용

  query = query
    .order('view_count', { ascending: false })
    .limit(limit)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    popular: data,
    period
  })
}
```

##### Task 1.5.2.5: 저장/좋아요/조회 API

**POST/DELETE /api/contents/[id]/save**
```typescript
// app/api/contents/[id]/save/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const body = await request.json()
  const { sessionId, folder, notes } = body

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('user_saved_contents')
    .insert({
      content_id: params.id,
      user_id: user?.id,
      session_id: user ? null : sessionId,
      folder: folder || 'default',
      notes
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') { // 이미 저장됨
      return NextResponse.json({ success: true, alreadySaved: true })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, saved: data })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')

  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('user_saved_contents')
    .delete()
    .eq('content_id', params.id)

  if (user) {
    query = query.eq('user_id', user.id)
  } else if (sessionId) {
    query = query.eq('session_id', sessionId)
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
```

**POST/DELETE /api/contents/[id]/like**
```typescript
// app/api/contents/[id]/like/route.ts

// save와 유사한 구조, 테이블만 user_content_likes로 변경
```

**POST /api/contents/[id]/view**
```typescript
// app/api/contents/[id]/view/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const body = await request.json()
  const { sessionId, durationSeconds, completionRate } = body

  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('user_content_views')
    .insert({
      content_id: params.id,
      user_id: user?.id,
      session_id: user ? null : sessionId,
      view_duration_seconds: durationSeconds || 0,
      completion_rate: completionRate || 0
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, view: data })
}
```

##### Task 1.5.2.6: 카테고리 API

**GET /api/categories**
```typescript
// app/api/categories/route.ts

import { NextResponse } from 'next/server'

const CATEGORIES = [
  { id: 'legal', name: '법률/행정', icon: '⚖️', description: '창업 필수 법률 지식' },
  { id: 'mindset', name: '마인드셋', icon: '🧠', description: '창업가 마인드 형성' },
  { id: 'idea', name: '아이디어', icon: '💡', description: '아이디어 발굴과 정제' },
  { id: 'validation', name: '검증', icon: '🔍', description: '시장과 고객 검증' },
  { id: 'mvp', name: 'MVP/개발', icon: '🛠️', description: 'MVP 구축과 개발' },
  { id: 'growth', name: '성장/스케일', icon: '📈', description: '성장 전략과 스케일업' },
  { id: 'case_study', name: '성공사례', icon: '🏆', description: '실제 창업 성공 스토리' },
  { id: 'investment', name: '투자/IR', icon: '💰', description: '투자 유치와 IR' },
  { id: 'government', name: '정부지원', icon: '🏛️', description: '정부 지원사업 가이드' }
]

const LEVELS = [
  { id: 1, name: '입문', description: '처음 시작하는 분', color: 'green' },
  { id: 2, name: '초급', description: '기초를 쌓는 분', color: 'blue' },
  { id: 3, name: '중급', description: '실무 적용하는 분', color: 'yellow' },
  { id: 4, name: '고급', description: '심화 전략이 필요한 분', color: 'orange' },
  { id: 5, name: '전문가', description: '마스터 레벨', color: 'red' }
]

const CONTENT_TYPES = [
  { id: 'video', name: '영상', icon: '🎬' },
  { id: 'article', name: '아티클', icon: '📄' },
  { id: 'template', name: '템플릿', icon: '📋' },
  { id: 'project', name: '프로젝트', icon: '🎯' },
  { id: 'audio', name: '오디오', icon: '🎧' }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    categories: CATEGORIES,
    levels: LEVELS,
    contentTypes: CONTENT_TYPES
  })
}
```

#### 검증 체크리스트
- [ ] 모든 API 정상 응답
- [ ] 필터/검색 조합 테스트
- [ ] 페이지네이션 정상 작동
- [ ] 인증/비인증 처리
- [ ] 에러 케이스 처리

---

### Iteration 1.5-3: 스마트 피드 카드 UI (Day 3-4)

#### 목표
- 이번 주 추천 카드 구현
- 나의 최근 7일 카드 구현
- 대시보드 통합

#### 파일 구조
```
app/(dashboard)/components/
├── SmartFeed/
│   ├── WeeklyRecommendations.tsx   # 이번 주 추천
│   ├── RecentActivity.tsx          # 최근 7일
│   ├── RecommendationCard.tsx      # 개별 추천 카드
│   ├── ActivityChart.tsx           # 활동 차트
│   └── index.ts
```

##### Task 1.5.3.1: WeeklyRecommendations 컴포넌트

```typescript
// app/(dashboard)/components/SmartFeed/WeeklyRecommendations.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { RecommendationCard } from './RecommendationCard'

interface Recommendation {
  id: string
  title: string
  content_type: string
  duration_minutes: number
  thumbnail_url?: string
  category: string
  level: number
  recommendReason: string
}

interface Props {
  sessionId?: string
}

export function WeeklyRecommendations({ sessionId }: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecommendations()
  }, [sessionId])

  const fetchRecommendations = async () => {
    try {
      const params = new URLSearchParams()
      if (sessionId) params.set('sessionId', sessionId)
      params.set('limit', '3')

      const response = await fetch(`/api/feed/recommendations?${params}`)
      const data = await response.json()

      if (data.success) {
        setRecommendations(data.recommendations)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('추천을 불러오는데 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <RecommendationsSkeleton />
  }

  if (error || recommendations.length === 0) {
    return null // 에러 시 카드 숨김
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl p-5 border border-white/[0.06]"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">이번 주 추천</h3>
            <p className="text-xs text-white/50">당신을 위한 맞춤 콘텐츠</p>
          </div>
        </div>

        <Link
          href="/explore"
          className="text-xs text-accent-purple hover:text-accent-purple/80 transition-colors"
        >
          더 많은 추천 →
        </Link>
      </div>

      {/* 추천 목록 */}
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  )
}

function RecommendationsSkeleton() {
  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-white/[0.06]">
      <div className="h-6 w-32 bg-white/[0.05] rounded animate-pulse mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-white/[0.03] rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
```

##### Task 1.5.3.2: RecommendationCard 컴포넌트

```typescript
// app/(dashboard)/components/SmartFeed/RecommendationCard.tsx

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Props {
  recommendation: {
    id: string
    title: string
    content_type: string
    duration_minutes: number
    thumbnail_url?: string
    category: string
    level: number
    recommendReason: string
  }
  index: number
}

const TYPE_ICONS: Record<string, string> = {
  video: '🎬',
  article: '📄',
  template: '📋',
  project: '🎯',
  audio: '🎧'
}

const LEVEL_BADGES: Record<number, { label: string; color: string }> = {
  1: { label: '입문', color: 'bg-green-500/20 text-green-400' },
  2: { label: '초급', color: 'bg-blue-500/20 text-blue-400' },
  3: { label: '중급', color: 'bg-yellow-500/20 text-yellow-400' },
  4: { label: '고급', color: 'bg-orange-500/20 text-orange-400' },
  5: { label: '전문가', color: 'bg-red-500/20 text-red-400' }
}

export function RecommendationCard({ recommendation, index }: Props) {
  const levelBadge = LEVEL_BADGES[recommendation.level] || LEVEL_BADGES[2]

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={`/content/${recommendation.id}`}
        className="
          block p-3 rounded-xl
          bg-white/[0.03] border border-white/[0.06]
          hover:bg-white/[0.06] hover:border-white/[0.1]
          transition-all group
        "
      >
        <div className="flex gap-3">
          {/* 썸네일 또는 아이콘 */}
          <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-white/[0.05] overflow-hidden">
            {recommendation.thumbnail_url ? (
              <img
                src={recommendation.thumbnail_url}
                alt={recommendation.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl">
                  {TYPE_ICONS[recommendation.content_type] || '📚'}
                </span>
              </div>
            )}
          </div>

          {/* 콘텐츠 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${levelBadge.color}`}>
                {levelBadge.label}
              </span>
              <span className="text-[10px] text-white/40">
                {recommendation.duration_minutes}분
              </span>
            </div>

            <h4 className="text-sm font-medium text-white/90 truncate group-hover:text-white">
              {recommendation.title}
            </h4>

            {/* 추천 이유 */}
            <p className="text-xs text-accent-purple/80 mt-1 truncate">
              💡 {recommendation.recommendReason}
            </p>
          </div>

          {/* 화살표 */}
          <div className="flex-shrink-0 self-center">
            <svg
              className="w-5 h-5 text-white/30 group-hover:text-white/50 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
```

##### Task 1.5.3.3: RecentActivity 컴포넌트

```typescript
// app/(dashboard)/components/SmartFeed/RecentActivity.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ActivityChart } from './ActivityChart'

interface ActivityStats {
  period: string
  activeDays: number
  totalDays: number
  activeRate: number
  contentsCompleted: number
  actionsCompleted: number
  totalActivities: number
  dailyActivity: { date: string; count: number }[]
}

interface Props {
  sessionId?: string
}

export function RecentActivity({ sessionId }: Props) {
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [insights, setInsights] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchActivity()
  }, [sessionId])

  const fetchActivity = async () => {
    try {
      const params = new URLSearchParams()
      if (sessionId) params.set('sessionId', sessionId)
      params.set('days', '7')

      const response = await fetch(`/api/feed/activity?${params}`)
      const data = await response.json()

      if (data.success) {
        setStats(data.activity)
        setInsights(data.insights || [])
      }
    } catch (err) {
      console.error('Failed to fetch activity:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <ActivitySkeleton />
  }

  if (!stats) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl p-5 border border-white/[0.06]"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">나의 최근 7일</h3>
            <p className="text-xs text-white/50">성장 기록 요약</p>
          </div>
        </div>

        <Link
          href="/growth"
          className="text-xs text-accent-purple hover:text-accent-purple/80 transition-colors"
        >
          전체 기록 →
        </Link>
      </div>

      {/* 활동 차트 */}
      <ActivityChart data={stats.dailyActivity} />

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="text-center p-3 rounded-xl bg-white/[0.03]">
          <div className="text-xl font-bold text-white">{stats.activeDays}</div>
          <div className="text-xs text-white/50">활동 일수</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/[0.03]">
          <div className="text-xl font-bold text-blue-400">{stats.contentsCompleted}</div>
          <div className="text-xs text-white/50">완료 콘텐츠</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/[0.03]">
          <div className="text-xl font-bold text-purple-400">{stats.actionsCompleted}</div>
          <div className="text-xs text-white/50">완료 미션</div>
        </div>
      </div>

      {/* 인사이트 */}
      {insights.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
          <p className="text-sm text-accent-purple">
            {insights[0]}
          </p>
        </div>
      )}
    </motion.div>
  )
}

function ActivitySkeleton() {
  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-white/[0.06]">
      <div className="h-6 w-32 bg-white/[0.05] rounded animate-pulse mb-4" />
      <div className="h-20 bg-white/[0.03] rounded-xl animate-pulse mb-4" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
```

##### Task 1.5.3.4: ActivityChart 컴포넌트

```typescript
// app/(dashboard)/components/SmartFeed/ActivityChart.tsx

'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Props {
  data: { date: string; count: number }[]
}

export function ActivityChart({ data }: Props) {
  const maxCount = Math.max(...data.map(d => d.count), 1)

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return days[date.getDay()]
  }

  return (
    <div className="flex items-end justify-between gap-1 h-16">
      {data.map((day, index) => {
        const height = day.count > 0 ? (day.count / maxCount) * 100 : 10
        const isToday = index === data.length - 1

        return (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`
                w-full rounded-t-sm min-h-[4px]
                ${day.count > 0
                  ? isToday ? 'bg-accent-purple' : 'bg-accent-purple/50'
                  : 'bg-white/[0.1]'
                }
              `}
            />
            <span className={`text-[10px] ${isToday ? 'text-white/80' : 'text-white/40'}`}>
              {getDayLabel(day.date)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
```

##### Task 1.5.3.5: 대시보드 통합

```typescript
// app/(dashboard)/dashboard/page.tsx 수정

import { TodaysPlanCard } from '../components/TodaysPlan'
import { WeeklyRecommendations } from '../components/SmartFeed/WeeklyRecommendations'
import { RecentActivity } from '../components/SmartFeed/RecentActivity'

export default function DashboardPage() {
  // ... 기존 코드

  return (
    <div className="...">
      {/* 1. Today's Plan - 최상단 */}
      <section className="mb-6">
        <TodaysPlanCard sessionId={sessionId} />
      </section>

      {/* 2. 스마트 피드 - 2열 그리드 */}
      <section className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeeklyRecommendations sessionId={sessionId} />
        <RecentActivity sessionId={sessionId} />
      </section>

      {/* 3. 기존 섹션들... */}
      <section className="mb-6">
        {/* 이어보기, 커리큘럼 등 */}
      </section>
    </div>
  )
}
```

#### 검증 체크리스트
- [ ] 추천 카드 정상 렌더링
- [ ] 활동 카드 데이터 표시
- [ ] 차트 애니메이션 정상
- [ ] 모바일 반응형 확인
- [ ] 링크 동작 확인

---

### Iteration 1.5-4: Explore 페이지 구현 (Day 4-5)

#### 목표
- 콘텐츠 탐색 페이지 구현
- 필터/검색 기능
- 카테고리별 탐색
- 인기/최신 콘텐츠 섹션

#### 파일 구조
```
app/(dashboard)/explore/
├── page.tsx                    # 메인 탐색 페이지
├── components/
│   ├── ExploreHeader.tsx       # 검색바 + 필터
│   ├── CategoryTabs.tsx        # 카테고리 탭
│   ├── ContentGrid.tsx         # 콘텐츠 그리드
│   ├── ContentCard.tsx         # 개별 카드
│   ├── FilterModal.tsx         # 필터 모달
│   └── PopularSection.tsx      # 인기 콘텐츠 섹션
```

##### Task 1.5.4.1: Explore 메인 페이지

```typescript
// app/(dashboard)/explore/page.tsx

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ExploreHeader } from './components/ExploreHeader'
import { CategoryTabs } from './components/CategoryTabs'
import { ContentGrid } from './components/ContentGrid'
import { PopularSection } from './components/PopularSection'

interface Filters {
  category: string | null
  level: number | null
  contentType: string | null
  search: string
}

export default function ExplorePage() {
  const [filters, setFilters] = useState<Filters>({
    category: null,
    level: null,
    contentType: null,
    search: ''
  })
  const [contents, setContents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasMore: false
  })

  const fetchContents = useCallback(async (page = 1) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '12')

      if (filters.category) params.set('category', filters.category)
      if (filters.level) params.set('level', filters.level.toString())
      if (filters.contentType) params.set('type', filters.contentType)
      if (filters.search) params.set('q', filters.search)

      const response = await fetch(`/api/contents?${params}`)
      const data = await response.json()

      if (data.success) {
        if (page === 1) {
          setContents(data.contents)
        } else {
          setContents(prev => [...prev, ...data.contents])
        }
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch contents:', error)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchContents(1)
  }, [filters.category, filters.level, filters.contentType])

  // 검색은 debounce 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContents(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [filters.search])

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleLoadMore = () => {
    if (pagination.hasMore) {
      fetchContents(pagination.page + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* 헤더 */}
      <ExploreHeader
        search={filters.search}
        onSearchChange={(value) => handleFilterChange('search', value)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 필터가 없을 때만 인기 콘텐츠 표시 */}
        {!filters.category && !filters.level && !filters.search && (
          <PopularSection />
        )}

        {/* 카테고리 탭 */}
        <CategoryTabs
          selected={filters.category}
          onSelect={(category) => handleFilterChange('category', category)}
        />

        {/* 콘텐츠 그리드 */}
        <ContentGrid
          contents={contents}
          isLoading={isLoading}
          hasMore={pagination.hasMore}
          onLoadMore={handleLoadMore}
        />
      </main>
    </div>
  )
}
```

##### Task 1.5.4.2: ExploreHeader 컴포넌트

```typescript
// app/(dashboard)/explore/components/ExploreHeader.tsx

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FilterModal } from './FilterModal'

interface Props {
  search: string
  onSearchChange: (value: string) => void
  filters: {
    category: string | null
    level: number | null
    contentType: string | null
  }
  onFilterChange: (key: string, value: any) => void
}

export function ExploreHeader({ search, onSearchChange, filters, onFilterChange }: Props) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const activeFilterCount = [
    filters.category,
    filters.level,
    filters.contentType
  ].filter(Boolean).length

  return (
    <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          {/* 검색 입력 */}
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="콘텐츠 검색..."
              className="
                w-full pl-10 pr-4 py-3 rounded-xl
                bg-white/[0.05] border border-white/[0.08]
                text-white placeholder-white/40
                focus:border-accent-purple/50 focus:outline-none
                transition-colors
              "
            />
          </div>

          {/* 필터 버튼 */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="
              relative px-4 py-3 rounded-xl
              bg-white/[0.05] border border-white/[0.08]
              text-white/70 hover:text-white hover:bg-white/[0.08]
              transition-colors flex items-center gap-2
            "
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>필터</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-purple rounded-full text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 필터 모달 */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    </header>
  )
}
```

##### Task 1.5.4.3: CategoryTabs 컴포넌트

```typescript
// app/(dashboard)/explore/components/CategoryTabs.tsx

'use client'

import React from 'react'
import { motion } from 'framer-motion'

const CATEGORIES = [
  { id: null, name: '전체', icon: '📚' },
  { id: 'legal', name: '법률/행정', icon: '⚖️' },
  { id: 'mindset', name: '마인드셋', icon: '🧠' },
  { id: 'idea', name: '아이디어', icon: '💡' },
  { id: 'validation', name: '검증', icon: '🔍' },
  { id: 'mvp', name: 'MVP/개발', icon: '🛠️' },
  { id: 'growth', name: '성장', icon: '📈' },
  { id: 'case_study', name: '사례', icon: '🏆' },
  { id: 'investment', name: '투자/IR', icon: '💰' },
  { id: 'government', name: '정부지원', icon: '🏛️' }
]

interface Props {
  selected: string | null
  onSelect: (category: string | null) => void
}

export function CategoryTabs({ selected, onSelect }: Props) {
  return (
    <div className="mb-6 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-2">
        {CATEGORIES.map((category) => {
          const isSelected = selected === category.id

          return (
            <button
              key={category.id || 'all'}
              onClick={() => onSelect(category.id)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full
                flex items-center gap-2 text-sm font-medium
                transition-all whitespace-nowrap
                ${isSelected
                  ? 'bg-accent-purple text-white'
                  : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white/80'
                }
              `}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

##### Task 1.5.4.4: ContentGrid & ContentCard

```typescript
// app/(dashboard)/explore/components/ContentGrid.tsx

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ContentCard } from './ContentCard'

interface Content {
  id: string
  title: string
  content_type: string
  duration_minutes: number
  thumbnail_url?: string
  category: string
  level: number
  view_count: number
  like_count: number
}

interface Props {
  contents: Content[]
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
}

export function ContentGrid({ contents, isLoading, hasMore, onLoadMore }: Props) {
  if (isLoading && contents.length === 0) {
    return <GridSkeleton />
  }

  if (!isLoading && contents.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl mb-4 block">🔍</span>
        <p className="text-white/60">검색 결과가 없습니다</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents.map((content, index) => (
          <ContentCard key={content.id} content={content} index={index} />
        ))}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="
              px-6 py-3 rounded-xl
              bg-white/[0.05] text-white/70
              hover:bg-white/[0.1] hover:text-white
              transition-colors disabled:opacity-50
            "
          >
            {isLoading ? '로딩 중...' : '더 보기'}
          </button>
        </div>
      )}
    </div>
  )
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-64 bg-white/[0.03] rounded-xl animate-pulse" />
      ))}
    </div>
  )
}
```

```typescript
// app/(dashboard)/explore/components/ContentCard.tsx

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Props {
  content: {
    id: string
    title: string
    content_type: string
    duration_minutes: number
    thumbnail_url?: string
    category: string
    level: number
    view_count: number
    like_count: number
  }
  index: number
}

const TYPE_ICONS: Record<string, string> = {
  video: '🎬',
  article: '📄',
  template: '📋',
  project: '🎯',
  audio: '🎧'
}

const LEVEL_BADGES: Record<number, { label: string; color: string }> = {
  1: { label: '입문', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  2: { label: '초급', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  3: { label: '중급', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  4: { label: '고급', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  5: { label: '전문가', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
}

export function ContentCard({ content, index }: Props) {
  const levelBadge = LEVEL_BADGES[content.level] || LEVEL_BADGES[2]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/content/${content.id}`}
        className="
          block rounded-xl overflow-hidden
          bg-white/[0.03] border border-white/[0.06]
          hover:border-white/[0.12] hover:bg-white/[0.05]
          transition-all group
        "
      >
        {/* 썸네일 */}
        <div className="aspect-video bg-white/[0.05] relative overflow-hidden">
          {content.thumbnail_url ? (
            <img
              src={content.thumbnail_url}
              alt={content.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-30">
                {TYPE_ICONS[content.content_type] || '📚'}
              </span>
            </div>
          )}

          {/* 시간 뱃지 */}
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-xs">
            {content.duration_minutes}분
          </div>

          {/* 콘텐츠 유형 */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 text-white text-xs flex items-center gap-1">
            <span>{TYPE_ICONS[content.content_type]}</span>
            <span className="capitalize">{content.content_type}</span>
          </div>
        </div>

        {/* 콘텐츠 정보 */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${levelBadge.color}`}>
              {levelBadge.label}
            </span>
          </div>

          <h4 className="font-medium text-white/90 line-clamp-2 group-hover:text-white mb-3">
            {content.title}
          </h4>

          {/* 통계 */}
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {content.view_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {content.like_count.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
```

#### 검증 체크리스트
- [ ] Explore 페이지 정상 렌더링
- [ ] 카테고리 필터 작동
- [ ] 검색 기능 작동
- [ ] 페이지네이션 작동
- [ ] 모바일 반응형 확인

---

## 테스트 시나리오

### E2E 시나리오 1: 대시보드 피드 확인
```
1. 대시보드 접속
2. Today's Plan 카드 확인
3. 이번 주 추천 카드 표시 확인
4. 추천 콘텐츠 클릭 → 상세 페이지 이동
5. 최근 7일 활동 카드 확인
6. 활동 차트 렌더링 확인
```

### E2E 시나리오 2: 콘텐츠 탐색
```
1. Explore 페이지 접속
2. 인기 콘텐츠 섹션 확인
3. 카테고리 탭 클릭 → 필터링 확인
4. 검색어 입력 → 결과 확인
5. 필터 모달 → 레벨/유형 필터 적용
6. 더보기 → 추가 로딩 확인
```

### E2E 시나리오 3: 저장/좋아요
```
1. 콘텐츠 상세 페이지 접속
2. 저장 버튼 클릭 → 저장 확인
3. 좋아요 버튼 클릭 → 좋아요 확인
4. 다시 클릭 → 취소 확인
5. 저장한 콘텐츠 목록에서 확인
```

---

## 배포 체크리스트

### 배포 전
- [ ] 마이그레이션 010_content_feed_system.sql 적용
- [ ] 기존 콘텐츠에 분류 정보 업데이트
- [ ] 환경 변수 확인
- [ ] 빌드 성공 확인
- [ ] Phase 1 기능 회귀 테스트

### 배포 후
- [ ] 대시보드 피드 카드 표시 확인
- [ ] Explore 페이지 정상 동작
- [ ] API 응답 속도 확인
- [ ] 에러 로그 모니터링

---

## 리스크 및 대응

| 리스크 | 영향 | 대응 방안 |
|--------|------|-----------|
| 추천 알고리즘 복잡도 | 중 | 단순 규칙 기반 시작, 점진적 고도화 |
| 콘텐츠 분류 데이터 부족 | 중 | 기본값 설정, 관리자 도구로 보완 |
| API 응답 속도 | 중 | 캐싱 전략, 인덱스 최적화 |
| 모바일 UX | 중 | 모바일 우선 테스트 |

---

## 다음 단계 (Phase 2 예고)

Phase 1.5 완료 후 Phase 2에서 다룰 내용:
- Growth Log 타임라인 뷰 고도화
- 마일스톤 시스템 구현
- 푸시 알림 기초
- AI 기반 개인화 추천 고도화
- 월간 리포트 기초

---

*작성일: 2025-12-08*
*상태: 계획 완료, 구현 대기*
