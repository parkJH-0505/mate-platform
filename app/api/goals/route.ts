import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getWeekStart, XP_REWARDS } from '@/lib/gamification'

// 주간 목표 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const weekStart = getWeekStart()

    // 이번 주 목표 조회
    const goalQuery = supabase
      .from('weekly_goals')
      .select('*')
      .eq('week_start', weekStart)

    if (user) {
      goalQuery.eq('user_id', user.id)
    } else {
      goalQuery.eq('session_id', sessionId)
    }

    const { data: goal } = await goalQuery.single()

    if (!goal) {
      // 기본 목표 반환 (아직 설정 안 됨)
      return NextResponse.json({
        success: true,
        goal: {
          target: 5,
          completed: 0,
          progress: 0,
          isAchieved: false,
          bonusXP: XP_REWARDS.WEEKLY_GOAL_ACHIEVED,
          weekStart
        },
        isNew: true
      })
    }

    const progress = goal.target_contents > 0
      ? Math.round((goal.completed_contents / goal.target_contents) * 100)
      : 0

    return NextResponse.json({
      success: true,
      goal: {
        id: goal.id,
        target: goal.target_contents,
        completed: goal.completed_contents,
        progress: Math.min(progress, 100),
        isAchieved: goal.is_achieved,
        achievedAt: goal.achieved_at,
        bonusXP: XP_REWARDS.WEEKLY_GOAL_ACHIEVED,
        bonusXPClaimed: goal.bonus_xp_claimed,
        weekStart: goal.week_start
      },
      isNew: false
    })

  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

// 주간 목표 생성/수정
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const body = await request.json()
    const { targetContents = 5, sessionId } = body

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const weekStart = getWeekStart()

    // 기존 목표 확인
    const existingQuery = supabase
      .from('weekly_goals')
      .select('id')
      .eq('week_start', weekStart)

    if (user) {
      existingQuery.eq('user_id', user.id)
    } else {
      existingQuery.eq('session_id', sessionId)
    }

    const { data: existing } = await existingQuery.single()

    let goal
    if (existing) {
      // 업데이트
      const { data, error } = await supabase
        .from('weekly_goals')
        .update({ target_contents: targetContents })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      goal = data
    } else {
      // 새로 생성
      const insertData: any = {
        week_start: weekStart,
        target_contents: targetContents
      }

      if (user) {
        insertData.user_id = user.id
      } else {
        insertData.session_id = sessionId
      }

      const { data, error } = await supabase
        .from('weekly_goals')
        .insert(insertData)
        .select()
        .single()

      if (error) throw error
      goal = data
    }

    return NextResponse.json({
      success: true,
      goal: {
        id: goal.id,
        target: goal.target_contents,
        completed: goal.completed_contents,
        progress: 0,
        isAchieved: goal.is_achieved,
        bonusXP: XP_REWARDS.WEEKLY_GOAL_ACHIEVED
      }
    })

  } catch (error) {
    console.error('Error saving goal:', error)
    return NextResponse.json(
      { error: 'Failed to save goal' },
      { status: 500 }
    )
  }
}
