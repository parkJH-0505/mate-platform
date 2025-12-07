import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface PlanItem {
  type: 'content' | 'action'
  id: string
  order: number
  status: 'pending' | 'completed'
  title: string
  duration?: string
  actionType?: string
}

// 오늘의 플랜 조회 또는 자동 생성
export async function GET(request: NextRequest) {
  try {
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

    const { data: existingPlan } = await query.maybeSingle()

    if (existingPlan) {
      // 기존 플랜 반환 (아이템 정보 enrichment)
      const enrichedPlan = await enrichPlanItems(supabase, existingPlan)
      return NextResponse.json({ success: true, plan: enrichedPlan })
    }

    // 플랜이 없으면 자동 생성
    const newPlan = await generateDailyPlan(supabase, user?.id || null, sessionId)
    return NextResponse.json({ success: true, plan: newPlan, isNew: true })
  } catch (error: any) {
    console.error('Error fetching/creating daily plan:', error)
    return NextResponse.json(
      { error: 'Failed to get daily plan', details: error?.message },
      { status: 500 }
    )
  }
}

// 플랜 아이템 상세 정보 enrichment
async function enrichPlanItems(supabase: any, plan: any) {
  const items = plan.items as PlanItem[]

  if (!items || items.length === 0) {
    return {
      ...plan,
      items: [],
      progress: 0
    }
  }

  const completedCount = items.filter(item => item.status === 'completed').length
  const progress = Math.round((completedCount / items.length) * 100)

  return {
    ...plan,
    items,
    progress,
    completedCount,
    totalCount: items.length
  }
}

// 오늘의 플랜 자동 생성
async function generateDailyPlan(
  supabase: any,
  userId: string | null,
  sessionId: string | null
) {
  const items: PlanItem[] = []
  let estimatedMinutes = 0

  // 1. 현재 커리큘럼 진행 상태 확인
  let curriculumQuery = supabase
    .from('curriculums')
    .select(`
      id,
      title,
      curriculum_modules (
        id,
        title,
        week_number,
        order_index,
        curriculum_contents (
          id,
          title,
          duration,
          content_type,
          order_index
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(1)

  if (userId) {
    curriculumQuery = curriculumQuery.eq('user_id', userId)
  } else if (sessionId) {
    curriculumQuery = curriculumQuery.eq('session_id', sessionId)
  }

  const { data: curriculums } = await curriculumQuery

  // 2. 활성 미션 조회
  const { data: actions } = await supabase
    .from('actions')
    .select('*')
    .eq('is_active', true)
    .order('order_index')
    .limit(5)

  // 3. 커리큘럼 콘텐츠 추가 (최대 2개)
  if (curriculums && curriculums.length > 0) {
    const curriculum = curriculums[0]
    const modules = curriculum.curriculum_modules || []

    // 모듈을 순서대로 정렬
    const sortedModules = modules.sort((a: any, b: any) => a.order_index - b.order_index)

    let contentCount = 0
    for (const module of sortedModules) {
      const contents = module.curriculum_contents || []
      const sortedContents = contents.sort((a: any, b: any) => a.order_index - b.order_index)

      for (const content of sortedContents) {
        if (contentCount >= 2) break

        items.push({
          type: 'content',
          id: content.id,
          order: items.length + 1,
          status: 'pending',
          title: content.title,
          duration: content.duration || '5분'
        })

        // 대략적인 시간 계산 (분 추출)
        const durationMatch = content.duration?.match(/(\d+)/)
        if (durationMatch) {
          estimatedMinutes += parseInt(durationMatch[1])
        } else {
          estimatedMinutes += 5
        }

        contentCount++
      }
      if (contentCount >= 2) break
    }
  }

  // 4. 미션 추가 (최대 1개)
  if (actions && actions.length > 0) {
    const action = actions[0]
    items.push({
      type: 'action',
      id: action.id,
      order: items.length + 1,
      status: 'pending',
      title: action.title,
      duration: `${action.estimated_minutes}분`,
      actionType: action.type
    })
    estimatedMinutes += action.estimated_minutes || 15
  }

  // 5. 아이템이 없으면 기본 미션만 추가
  if (items.length === 0 && actions && actions.length > 0) {
    const action = actions[0]
    items.push({
      type: 'action',
      id: action.id,
      order: 1,
      status: 'pending',
      title: action.title,
      duration: `${action.estimated_minutes}분`,
      actionType: action.type
    })
    estimatedMinutes = action.estimated_minutes || 15
  }

  // 6. 플랜 저장
  const insertData: any = {
    plan_date: new Date().toISOString().split('T')[0],
    items,
    estimated_minutes: estimatedMinutes || 20,
    status: 'active'
  }

  if (userId) {
    insertData.user_id = userId
  } else {
    insertData.session_id = sessionId
  }

  const { data: newPlan, error } = await supabase
    .from('daily_plans')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('Error creating daily plan:', error)
    throw error
  }

  return {
    ...newPlan,
    progress: 0,
    completedCount: 0,
    totalCount: items.length
  }
}
