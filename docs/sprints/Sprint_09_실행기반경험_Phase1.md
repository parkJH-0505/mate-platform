# Sprint 09: 실행 기반 경험 - Phase 1 (기반 구축)

> **목표**: Today's Plan + Action System의 데이터베이스, API, 기본 UI 구현
> **참조 기획**: [11_실행기반_경험설계.md](../../../../docs/11_실행기반_경험설계.md)

---

## 개요

| 항목 | 내용 |
|------|------|
| **Sprint 목표** | 실행 기반 경험의 기술적 기반 완성 |
| **핵심 산출물** | DB 스키마, Today's Plan API/UI, Action 제출 기능 |
| **선행 조건** | 기존 커리큘럼/콘텐츠 시스템 정상 작동 |
| **의존성** | Supabase, 기존 인증 시스템 |

---

## 현황 진단

### 1. 현재 데이터베이스 상태

| 마이그레이션 | 상태 | 비고 |
|-------------|------|------|
| 001_initial_schema.sql | ✅ 적용 | 사용자 기본 테이블 |
| 002_curriculum_schema.sql | ✅ 적용 | 커리큘럼, 모듈, 콘텐츠 |
| 005_subscriptions.sql | ✅ 적용 | 구독/결제 |
| 006_gamification.sql | ⚠️ 적용 | 시청 기반 (전략과 충돌) |
| 007_chat.sql | ❓ 미확인 | AI 챗봇용 |
| 008_fix_curriculum_foreign_key.sql | ✅ 적용 | FK 수정 |

### 2. 현재 UI 컴포넌트 상태

| 컴포넌트 | 위치 | 용도 | 재사용 가능 |
|----------|------|------|-------------|
| CurriculumAccordion | app/(dashboard)/components | 커리큘럼 표시 | ✅ |
| ContinueCard | app/(dashboard)/components | 이어보기 카드 | 🔄 수정 필요 |
| StreakCard | app/(dashboard)/components | 연속 학습 (시청 기반) | ❌ 교체 필요 |
| WeeklyGoal | app/(dashboard)/components | 주간 목표 | 🔄 수정 필요 |
| ChatWindow/Input | app/(dashboard)/components/chat | AI 채팅 | ✅ 참고 |

### 3. 필요한 신규 테이블

```
┌─────────────────┐     ┌─────────────────┐
│ actions         │────>│ curriculum_     │
│ (실행 미션 정의)│     │ contents        │
└─────────────────┘     └─────────────────┘
        │
        v
┌─────────────────┐     ┌─────────────────┐
│ user_actions    │────>│ users /         │
│ (사용자 수행)   │     │ session_id      │
└─────────────────┘     └─────────────────┘
        │
        v
┌─────────────────┐     ┌─────────────────┐
│ daily_plans     │     │ growth_logs     │
│ (오늘의 플랜)   │     │ (성장 기록)     │
└─────────────────┘     └─────────────────┘
```

---

## Iteration 상세 계획

### Iteration 1-1: 데이터베이스 마이그레이션 (Day 1)

#### 목표
- Phase 1에 필요한 모든 테이블 생성
- 기존 테이블과의 관계 설정
- RLS 정책 적용

#### 작업 내용

##### Task 1.1.1: 마이그레이션 파일 생성
```
파일: supabase/migrations/009_action_system.sql
```

**테이블 1: actions (실행 미션 정의)**
```sql
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 콘텐츠 연결 (선택적)
  content_id UUID REFERENCES curriculum_contents(id) ON DELETE SET NULL,
  module_id UUID REFERENCES curriculum_modules(id) ON DELETE SET NULL,

  -- 미션 정보
  title TEXT NOT NULL,
  description TEXT,
  instruction TEXT,

  -- 미션 유형
  type TEXT NOT NULL CHECK (type IN ('text', 'checklist', 'file', 'link', 'number')),
  checklist_items JSONB DEFAULT '[]',

  -- 메타
  estimated_minutes INTEGER DEFAULT 15,
  difficulty INTEGER DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
  is_required BOOLEAN DEFAULT false,

  -- 힌트/예시
  tips TEXT[],
  example_submission TEXT,

  -- 순서
  order_index INTEGER DEFAULT 0,

  -- 활성화
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**테이블 2: user_actions (사용자 수행 기록)**
```sql
CREATE TABLE user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  action_id UUID REFERENCES actions(id) ON DELETE CASCADE NOT NULL,

  -- 제출 내용
  submission_type TEXT NOT NULL,
  submission_text TEXT,
  submission_url TEXT,
  submission_number NUMERIC,
  submission_file_url TEXT,
  checklist_progress JSONB DEFAULT '{}',

  -- 상태
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'completed')),

  -- 시간 추적
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  actual_minutes INTEGER,

  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);
```

**테이블 3: daily_plans (오늘의 플랜)**
```sql
CREATE TABLE daily_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  plan_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- 플랜 구성
  items JSONB NOT NULL DEFAULT '[]',
  -- [{ type: 'content'|'action', id: uuid, order: 1, status: 'pending'|'completed' }]

  estimated_minutes INTEGER DEFAULT 20,
  actual_minutes INTEGER,

  -- 상태
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'skipped')),
  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_plan UNIQUE NULLS NOT DISTINCT (user_id, plan_date),
  CONSTRAINT unique_session_plan UNIQUE NULLS NOT DISTINCT (session_id, plan_date),
  CONSTRAINT user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);
```

**테이블 4: growth_logs (성장 기록)**
```sql
CREATE TABLE growth_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,

  log_type TEXT NOT NULL CHECK (log_type IN (
    'content_completed',
    'action_submitted',
    'action_completed',
    'milestone_achieved',
    'note',
    'ai_insight',
    'streak',
    'plan_completed'
  )),

  reference_id UUID,
  reference_type TEXT,

  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📝',

  metadata JSONB DEFAULT '{}',

  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);
```

##### Task 1.1.2: 인덱스 생성
```sql
-- actions
CREATE INDEX idx_actions_content ON actions(content_id);
CREATE INDEX idx_actions_module ON actions(module_id);
CREATE INDEX idx_actions_active ON actions(is_active);

-- user_actions
CREATE INDEX idx_user_actions_user ON user_actions(user_id);
CREATE INDEX idx_user_actions_session ON user_actions(session_id);
CREATE INDEX idx_user_actions_action ON user_actions(action_id);
CREATE INDEX idx_user_actions_status ON user_actions(status);

-- daily_plans
CREATE INDEX idx_daily_plans_user ON daily_plans(user_id);
CREATE INDEX idx_daily_plans_session ON daily_plans(session_id);
CREATE INDEX idx_daily_plans_date ON daily_plans(plan_date DESC);

-- growth_logs
CREATE INDEX idx_growth_logs_user ON growth_logs(user_id);
CREATE INDEX idx_growth_logs_session ON growth_logs(session_id);
CREATE INDEX idx_growth_logs_date ON growth_logs(logged_at DESC);
CREATE INDEX idx_growth_logs_type ON growth_logs(log_type);
```

##### Task 1.1.3: RLS 정책
```sql
-- actions: 모든 사용자 읽기 가능 (미션 정의는 공개)
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active actions" ON actions
  FOR SELECT USING (is_active = true);

-- user_actions: 본인 데이터만 접근
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own actions" ON user_actions
  FOR ALL USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- daily_plans: 본인 데이터만 접근
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own plans" ON daily_plans
  FOR ALL USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- growth_logs: 본인 데이터만 접근
ALTER TABLE growth_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own logs" ON growth_logs
  FOR SELECT USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );
CREATE POLICY "Users can create own logs" ON growth_logs
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );
```

##### Task 1.1.4: 트리거 함수
```sql
-- updated_at 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actions_updated_at
  BEFORE UPDATE ON actions FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_user_actions_updated_at
  BEFORE UPDATE ON user_actions FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_daily_plans_updated_at
  BEFORE UPDATE ON daily_plans FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 미션 완료 시 성장 로그 자동 생성
CREATE OR REPLACE FUNCTION log_action_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO growth_logs (user_id, session_id, log_type, reference_id, reference_type, title, icon)
    SELECT
      NEW.user_id,
      NEW.session_id,
      'action_completed',
      NEW.action_id,
      'action',
      a.title,
      '🎯'
    FROM actions a WHERE a.id = NEW.action_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_action_completion
  AFTER UPDATE ON user_actions FOR EACH ROW
  EXECUTE FUNCTION log_action_completion();
```

#### 검증 체크리스트
- [ ] 마이그레이션 파일 문법 오류 없음
- [ ] Supabase 로컬 환경에서 적용 테스트
- [ ] 외래키 관계 정상 작동
- [ ] RLS 정책 권한 테스트
- [ ] 트리거 함수 실행 확인

---

### Iteration 1-2: API 엔드포인트 구현 (Day 2-3)

#### 목표
- Today's Plan CRUD API
- Action 제출/조회 API
- Growth Log 기록 API

#### 파일 구조
```
app/api/
├── plans/
│   ├── today/
│   │   └── route.ts          # GET: 오늘 플랜 조회/생성
│   └── [id]/
│       └── items/
│           └── route.ts      # PATCH: 아이템 상태 업데이트
├── actions/
│   ├── route.ts              # GET: 미션 목록
│   └── [id]/
│       ├── route.ts          # GET: 미션 상세
│       └── submit/
│           └── route.ts      # POST: 미션 제출
└── growth-logs/
    └── route.ts              # GET: 로그 목록, POST: 메모 추가
```

#### Task 1.2.1: Today's Plan API

**GET /api/plans/today**
```typescript
// app/api/plans/today/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]

  // 오늘 플랜 조회
  let query = supabase
    .from('daily_plans')
    .select('*')
    .eq('plan_date', today)

  if (user) {
    query = query.eq('user_id', user.id)
  } else {
    query = query.eq('session_id', sessionId)
  }

  const { data: existingPlan, error } = await query.single()

  if (existingPlan) {
    // 플랜 아이템 상세 정보 조회
    const enrichedPlan = await enrichPlanItems(supabase, existingPlan)
    return NextResponse.json({ success: true, plan: enrichedPlan })
  }

  // 플랜이 없으면 자동 생성
  const newPlan = await generateDailyPlan(supabase, user?.id, sessionId)
  return NextResponse.json({ success: true, plan: newPlan, isNew: true })
}

async function generateDailyPlan(supabase, userId, sessionId) {
  // 1. 현재 커리큘럼 진행 상태 확인
  // 2. 다음 학습할 콘텐츠 결정
  // 3. 연결된 미션 포함
  // 4. 플랜 생성 및 저장

  // 구현 상세...
}

async function enrichPlanItems(supabase, plan) {
  // 각 아이템의 상세 정보 조회
  // 콘텐츠 제목, 미션 정보 등

  // 구현 상세...
}
```

**PATCH /api/plans/[id]/items**
```typescript
// app/api/plans/[id]/items/route.ts

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const body = await request.json()
  const { itemId, itemType, status } = body

  // 플랜 아이템 상태 업데이트
  // 진행률 계산
  // 완료 시 플랜 상태 업데이트

  // 구현 상세...
}
```

#### Task 1.2.2: Action API

**GET /api/actions**
```typescript
// app/api/actions/route.ts

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const contentId = searchParams.get('contentId')
  const moduleId = searchParams.get('moduleId')
  const sessionId = searchParams.get('sessionId')

  let query = supabase
    .from('actions')
    .select(`
      *,
      user_actions!left (
        id, status, submitted_at, completed_at
      )
    `)
    .eq('is_active', true)

  if (contentId) query = query.eq('content_id', contentId)
  if (moduleId) query = query.eq('module_id', moduleId)

  query = query.order('order_index')

  const { data, error } = await query

  return NextResponse.json({ success: true, actions: data })
}
```

**POST /api/actions/[id]/submit**
```typescript
// app/api/actions/[id]/submit/route.ts

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const body = await request.json()
  const { sessionId, submissionType, ...submissionData } = body

  const { data: { user } } = await supabase.auth.getUser()

  // 기존 진행 중인 기록 확인
  let query = supabase
    .from('user_actions')
    .select('*')
    .eq('action_id', params.id)

  if (user) {
    query = query.eq('user_id', user.id)
  } else {
    query = query.eq('session_id', sessionId)
  }

  const { data: existing } = await query.single()

  if (existing) {
    // 업데이트
    const { data, error } = await supabase
      .from('user_actions')
      .update({
        submission_type: submissionType,
        [`submission_${submissionType}`]: submissionData[submissionType],
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single()

    return NextResponse.json({ success: true, userAction: data })
  }

  // 새로 생성
  const insertData = {
    action_id: params.id,
    user_id: user?.id,
    session_id: user ? null : sessionId,
    submission_type: submissionType,
    [`submission_${submissionType}`]: submissionData[submissionType],
    status: 'submitted',
    submitted_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('user_actions')
    .insert(insertData)
    .select()
    .single()

  return NextResponse.json({ success: true, userAction: data })
}
```

#### Task 1.2.3: Growth Log API

**GET /api/growth-logs**
```typescript
// app/api/growth-logs/route.ts

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const sessionId = searchParams.get('sessionId')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const logType = searchParams.get('type')

  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('growth_logs')
    .select('*', { count: 'exact' })

  if (user) {
    query = query.eq('user_id', user.id)
  } else {
    query = query.eq('session_id', sessionId)
  }

  if (logType) {
    query = query.eq('log_type', logType)
  }

  query = query
    .order('logged_at', { ascending: false })
    .range(offset, offset + limit - 1)

  const { data, count, error } = await query

  return NextResponse.json({
    success: true,
    logs: data,
    total: count,
    hasMore: (offset + limit) < count
  })
}
```

#### 검증 체크리스트
- [ ] 모든 API 엔드포인트 정상 응답
- [ ] 인증/비인증 사용자 모두 처리
- [ ] 에러 핸들링 완료
- [ ] 타입 정의 완료

---

### Iteration 1-3: Today's Plan UI 구현 (Day 3-4)

#### 목표
- 대시보드에 Today's Plan 카드 추가
- 콘텐츠/미션 아이템 표시
- 완료 체크 기능

#### 컴포넌트 구조
```
app/(dashboard)/components/
├── TodaysPlan/
│   ├── TodaysPlanCard.tsx      # 메인 카드
│   ├── PlanItem.tsx            # 개별 아이템
│   ├── PlanProgress.tsx        # 진행률 바
│   └── index.ts
```

#### Task 1.3.1: TodaysPlanCard 컴포넌트

```typescript
// app/(dashboard)/components/TodaysPlan/TodaysPlanCard.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlanItem } from './PlanItem'
import { PlanProgress } from './PlanProgress'

interface PlanItemData {
  id: string
  type: 'content' | 'action'
  title: string
  duration?: string
  status: 'pending' | 'completed'
  actionType?: string
}

interface TodaysPlanData {
  id: string
  items: PlanItemData[]
  estimatedMinutes: number
  progress: number
}

interface Props {
  sessionId?: string
}

export function TodaysPlanCard({ sessionId }: Props) {
  const [plan, setPlan] = useState<TodaysPlanData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTodaysPlan()
  }, [sessionId])

  const fetchTodaysPlan = async () => {
    try {
      const params = new URLSearchParams()
      if (sessionId) params.set('sessionId', sessionId)

      const response = await fetch(`/api/plans/today?${params}`)
      const data = await response.json()

      if (data.success) {
        setPlan(data.plan)
      }
    } catch (error) {
      console.error('Failed to fetch plan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemComplete = async (itemId: string, itemType: string) => {
    if (!plan) return

    try {
      await fetch(`/api/plans/${plan.id}/items`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, itemType, status: 'completed' })
      })

      // 로컬 상태 업데이트
      setPlan(prev => {
        if (!prev) return prev
        const updatedItems = prev.items.map(item =>
          item.id === itemId ? { ...item, status: 'completed' as const } : item
        )
        const completedCount = updatedItems.filter(i => i.status === 'completed').length
        return {
          ...prev,
          items: updatedItems,
          progress: Math.round((completedCount / updatedItems.length) * 100)
        }
      })
    } catch (error) {
      console.error('Failed to update item:', error)
    }
  }

  if (isLoading) {
    return <TodaysPlanSkeleton />
  }

  if (!plan || plan.items.length === 0) {
    return <TodaysPlanEmpty />
  }

  const completedCount = plan.items.filter(i => i.status === 'completed').length

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
            <span className="text-xl">📋</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">오늘의 플랜</h3>
            <p className="text-xs text-white/50">약 {plan.estimatedMinutes}분</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-bold text-accent-purple">{plan.progress}%</span>
          <p className="text-xs text-white/40">{completedCount}/{plan.items.length} 완료</p>
        </div>
      </div>

      {/* 진행률 바 */}
      <PlanProgress progress={plan.progress} />

      {/* 아이템 목록 */}
      <div className="mt-4 space-y-2">
        {plan.items.map((item, index) => (
          <PlanItem
            key={item.id}
            item={item}
            index={index}
            onComplete={() => handleItemComplete(item.id, item.type)}
          />
        ))}
      </div>

      {/* 완료 상태 */}
      {plan.progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center"
        >
          <span className="text-green-400 font-medium">
            오늘 플랜 완료! 수고했어요 🎉
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}
```

#### Task 1.3.2: PlanItem 컴포넌트

```typescript
// app/(dashboard)/components/TodaysPlan/PlanItem.tsx

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Props {
  item: {
    id: string
    type: 'content' | 'action'
    title: string
    duration?: string
    status: 'pending' | 'completed'
    actionType?: string
    contentUrl?: string
  }
  index: number
  onComplete: () => void
}

export function PlanItem({ item, index, onComplete }: Props) {
  const isCompleted = item.status === 'completed'

  const getIcon = () => {
    if (item.type === 'content') return '📚'
    switch (item.actionType) {
      case 'text': return '✍️'
      case 'checklist': return '☑️'
      case 'file': return '📎'
      case 'link': return '🔗'
      case 'number': return '🔢'
      default: return '🎯'
    }
  }

  const getLabel = () => {
    return item.type === 'content' ? '학습' : '미션'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        relative flex items-center gap-3 p-3 rounded-xl
        ${isCompleted
          ? 'bg-white/[0.02] border border-white/[0.04]'
          : 'bg-white/[0.05] border border-white/[0.08]'
        }
        transition-all
      `}
    >
      {/* 체크박스 */}
      <button
        onClick={onComplete}
        disabled={isCompleted}
        className={`
          w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0
          transition-all
          ${isCompleted
            ? 'bg-green-500/20 text-green-400'
            : 'bg-white/[0.05] hover:bg-white/[0.1] text-white/30'
          }
        `}
      >
        {isCompleted ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="text-xs">{index + 1}</span>
        )}
      </button>

      {/* 아이콘 */}
      <span className="text-lg">{getIcon()}</span>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`
            text-[10px] px-1.5 py-0.5 rounded
            ${item.type === 'content'
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-purple-500/20 text-purple-400'
            }
          `}>
            {getLabel()}
          </span>
          {item.duration && (
            <span className="text-[10px] text-white/30">{item.duration}</span>
          )}
        </div>
        <p className={`
          text-sm mt-0.5 truncate
          ${isCompleted ? 'text-white/40 line-through' : 'text-white/80'}
        `}>
          {item.title}
        </p>
      </div>

      {/* 액션 버튼 */}
      {!isCompleted && (
        <Link
          href={item.type === 'content'
            ? `/content/${item.id}`
            : `/action/${item.id}`
          }
          className="
            px-3 py-1.5 rounded-lg
            bg-accent-purple/20 text-accent-purple text-xs font-medium
            hover:bg-accent-purple/30 transition-colors
          "
        >
          시작
        </Link>
      )}
    </motion.div>
  )
}
```

#### Task 1.3.3: 대시보드 통합

```typescript
// app/(dashboard)/page.tsx 수정

import { TodaysPlanCard } from './components/TodaysPlan'

export default function DashboardPage() {
  // 기존 코드...

  return (
    <div className="...">
      {/* Today's Plan - 최상단 배치 */}
      <section className="mb-6">
        <TodaysPlanCard sessionId={sessionId} />
      </section>

      {/* 기존 섹션들... */}
    </div>
  )
}
```

#### 검증 체크리스트
- [ ] Today's Plan 카드 정상 렌더링
- [ ] 아이템 완료 체크 작동
- [ ] 진행률 실시간 업데이트
- [ ] 모바일 반응형 확인
- [ ] 로딩/빈 상태 처리

---

### Iteration 1-4: Action 제출 UI 구현 (Day 4-5)

#### 목표
- 미션 상세 페이지
- 텍스트 유형 제출 폼
- 제출 완료 피드백

#### 파일 구조
```
app/action/
└── [id]/
    ├── page.tsx              # 미션 상세 페이지
    └── components/
        ├── ActionHeader.tsx  # 미션 헤더
        ├── ActionForm.tsx    # 제출 폼
        └── ActionTips.tsx    # 팁/가이드
```

#### Task 1.4.1: 미션 상세 페이지

```typescript
// app/action/[id]/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ActionHeader } from './components/ActionHeader'
import { ActionForm } from './components/ActionForm'
import { ActionTips } from './components/ActionTips'

interface Action {
  id: string
  title: string
  description: string
  instruction: string
  type: 'text' | 'checklist' | 'file' | 'link' | 'number'
  estimated_minutes: number
  tips: string[]
  example_submission: string
  user_actions?: {
    id: string
    status: string
    submission_text?: string
  }[]
}

export default function ActionPage() {
  const params = useParams()
  const router = useRouter()
  const [action, setAction] = useState<Action | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    fetchAction()
  }, [params.id])

  const fetchAction = async () => {
    try {
      const response = await fetch(`/api/actions/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setAction(data.action)
        // 이미 제출된 경우
        if (data.action.user_actions?.[0]?.status === 'submitted') {
          setIsSubmitted(true)
        }
      }
    } catch (error) {
      console.error('Failed to fetch action:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (submission: any) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/actions/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)
        // 3초 후 대시보드로 이동
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      }
    } catch (error) {
      console.error('Failed to submit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <ActionSkeleton />
  }

  if (!action) {
    return <ActionNotFound />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <ActionHeader
        title={action.title}
        estimatedMinutes={action.estimated_minutes}
        onBack={() => router.back()}
      />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {isSubmitted ? (
          <SubmissionSuccess action={action} />
        ) : (
          <>
            {/* 설명 */}
            <section className="mb-6">
              <p className="text-white/70 leading-relaxed">
                {action.description}
              </p>
              {action.instruction && (
                <div className="mt-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                  <p className="text-sm text-white/60">
                    {action.instruction}
                  </p>
                </div>
              )}
            </section>

            {/* 제출 폼 */}
            <ActionForm
              type={action.type}
              exampleSubmission={action.example_submission}
              existingSubmission={action.user_actions?.[0]}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />

            {/* 팁 */}
            {action.tips?.length > 0 && (
              <ActionTips tips={action.tips} />
            )}
          </>
        )}
      </main>
    </div>
  )
}

function SubmissionSuccess({ action }: { action: Action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
        <span className="text-4xl">🎉</span>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">
        미션 완료!
      </h2>
      <p className="text-white/60 mb-4">
        "{action.title}" 미션을 완료했습니다
      </p>
      <p className="text-sm text-white/40">
        잠시 후 대시보드로 이동합니다...
      </p>
    </motion.div>
  )
}
```

#### Task 1.4.2: ActionForm 컴포넌트

```typescript
// app/action/[id]/components/ActionForm.tsx

'use client'

import React, { useState } from 'react'

interface Props {
  type: 'text' | 'checklist' | 'file' | 'link' | 'number'
  exampleSubmission?: string
  existingSubmission?: {
    submission_text?: string
  }
  isSubmitting: boolean
  onSubmit: (data: any) => void
}

export function ActionForm({
  type,
  exampleSubmission,
  existingSubmission,
  isSubmitting,
  onSubmit
}: Props) {
  const [text, setText] = useState(existingSubmission?.submission_text || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (type === 'text' && text.trim()) {
      onSubmit({
        submissionType: 'text',
        text: text.trim()
      })
    }
  }

  // Phase 1에서는 텍스트 유형만 지원
  if (type !== 'text') {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <p className="text-yellow-400 text-sm">
          이 미션 유형은 곧 지원될 예정입니다.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          내 답변
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={exampleSubmission || '여기에 작성해주세요...'}
          rows={6}
          className="
            w-full px-4 py-3 rounded-xl
            bg-white/[0.05] border border-white/[0.08]
            text-white placeholder-white/30
            focus:border-accent-purple/50 focus:outline-none
            resize-none
          "
        />
        <p className="mt-2 text-xs text-white/40 text-right">
          {text.length}자
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="
            flex-1 py-3 rounded-xl
            bg-white/[0.05] text-white/70
            hover:bg-white/[0.08] transition-colors
          "
        >
          임시저장
        </button>
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className="
            flex-1 py-3 rounded-xl
            bg-accent-purple text-white font-medium
            hover:bg-accent-purple/80 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? '제출 중...' : '제출하기'}
        </button>
      </div>
    </form>
  )
}
```

#### 검증 체크리스트
- [ ] 미션 상세 페이지 정상 렌더링
- [ ] 텍스트 제출 폼 작동
- [ ] 제출 성공 피드백
- [ ] 기존 제출 내용 복원
- [ ] 에러 핸들링

---

## 테스트 시나리오

### E2E 시나리오 1: 첫 방문 사용자
```
1. 대시보드 접속
2. Today's Plan 자동 생성 확인
3. 콘텐츠 학습 → 완료 체크
4. 미션 시작 → 제출
5. Growth Log 기록 확인
```

### E2E 시나리오 2: 재방문 사용자
```
1. 대시보드 접속
2. 기존 Today's Plan 로드 확인
3. 진행률 정확성 확인
4. 미완료 아이템 이어서 진행
```

### 단위 테스트
- [ ] Daily Plan 생성 로직
- [ ] 아이템 상태 업데이트
- [ ] 미션 제출 유효성 검증
- [ ] Growth Log 자동 생성

---

## 배포 체크리스트

### 배포 전
- [ ] 마이그레이션 Supabase Production 적용
- [ ] 환경 변수 확인
- [ ] 빌드 성공 확인
- [ ] 기존 기능 회귀 테스트

### 배포 후
- [ ] Today's Plan 카드 표시 확인
- [ ] 미션 제출 정상 작동
- [ ] DB 레코드 생성 확인
- [ ] 에러 로그 모니터링

---

## 리스크 및 대응

| 리스크 | 영향 | 대응 방안 |
|--------|------|-----------|
| 기존 gamification과 충돌 | 중 | Phase 1에서는 병행, Phase 2에서 교체 |
| 플랜 생성 로직 복잡도 | 중 | 단순 규칙 기반으로 시작, 점진적 고도화 |
| 모바일 UX 이슈 | 중 | 모바일 우선 디자인, 빠른 피드백 수집 |

---

## 다음 단계 (Phase 2 예고)

Phase 1 완료 후 Phase 2에서 다룰 내용:
- Growth Log 타임라인 뷰
- 마일스톤 시스템 기초
- Action 다양한 유형 지원 (체크리스트, 파일, 링크)
- 푸시 알림 기초

---

*작성일: 2025-12-08*
*상태: 계획 완료, 구현 대기*
