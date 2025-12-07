import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface DailyActivity {
  date: string
  count: number
}

interface ActivityStats {
  period: string
  activeDays: number
  totalDays: number
  activeRate: number
  contentsCompleted: number
  actionsCompleted: number
  totalActivities: number
  dailyActivity: DailyActivity[]
}

// 최근 활동 통계 조회
export async function GET(request: NextRequest) {
  try {
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
    const sinceDateStr = sinceDate.toISOString()

    // 1. 성장 로그 조회
    let logsQuery = supabase
      .from('growth_logs')
      .select('log_type, logged_at')
      .gte('logged_at', sinceDateStr)

    if (user) {
      logsQuery = logsQuery.eq('user_id', user.id)
    } else {
      logsQuery = logsQuery.eq('session_id', sessionId)
    }

    const { data: logs } = await logsQuery

    // 2. 완료한 콘텐츠 수 조회
    let progressQuery = supabase
      .from('user_progress')
      .select('id, completed_at')
      .eq('status', 'completed')
      .gte('completed_at', sinceDateStr)

    if (user) {
      progressQuery = progressQuery.eq('user_id', user.id)
    } else {
      progressQuery = progressQuery.eq('session_id', sessionId)
    }

    const { data: completedContent } = await progressQuery

    // 3. 제출한 미션 수 조회
    let actionsQuery = supabase
      .from('user_actions')
      .select('id, submitted_at')
      .in('status', ['submitted', 'completed'])
      .gte('submitted_at', sinceDateStr)

    if (user) {
      actionsQuery = actionsQuery.eq('user_id', user.id)
    } else {
      actionsQuery = actionsQuery.eq('session_id', sessionId)
    }

    const { data: completedActions } = await actionsQuery

    // 4. 활동 일수 계산
    const activityDates = new Set<string>()

    logs?.forEach((l: any) => {
      const date = l.logged_at?.split('T')[0]
      if (date) activityDates.add(date)
    })

    completedContent?.forEach((c: any) => {
      const date = c.completed_at?.split('T')[0]
      if (date) activityDates.add(date)
    })

    completedActions?.forEach((a: any) => {
      const date = a.submitted_at?.split('T')[0]
      if (date) activityDates.add(date)
    })

    const activeDays = activityDates.size

    // 5. 일별 활동 데이터 생성
    const dailyActivity = generateDailyActivity(logs, completedContent, completedActions, days)

    // 6. 통계 생성
    const stats: ActivityStats = {
      period: `최근 ${days}일`,
      activeDays,
      totalDays: days,
      activeRate: Math.round((activeDays / days) * 100),
      contentsCompleted: completedContent?.length || 0,
      actionsCompleted: completedActions?.length || 0,
      totalActivities: (logs?.length || 0),
      dailyActivity
    }

    // 7. 인사이트 생성
    const insights = generateActivityInsights(stats)

    return NextResponse.json({
      success: true,
      activity: stats,
      insights
    })
  } catch (error: any) {
    console.error('Error fetching activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity', details: error?.message },
      { status: 500 }
    )
  }
}

// 일별 활동 데이터 생성
function generateDailyActivity(
  logs: any[] | null,
  contents: any[] | null,
  actions: any[] | null,
  days: number
): DailyActivity[] {
  const activity: Record<string, number> = {}

  // 지난 N일 초기화
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    activity[date.toISOString().split('T')[0]] = 0
  }

  // 활동 카운트
  logs?.forEach((l: any) => {
    const date = l.logged_at?.split('T')[0]
    if (date && activity[date] !== undefined) {
      activity[date]++
    }
  })

  contents?.forEach((c: any) => {
    const date = c.completed_at?.split('T')[0]
    if (date && activity[date] !== undefined) {
      activity[date]++
    }
  })

  actions?.forEach((a: any) => {
    const date = a.submitted_at?.split('T')[0]
    if (date && activity[date] !== undefined) {
      activity[date]++
    }
  })

  return Object.entries(activity)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// 활동 인사이트 생성
function generateActivityInsights(stats: ActivityStats): string[] {
  const insights: string[] = []

  // 활동률 기반 인사이트
  if (stats.activeRate >= 70) {
    insights.push('꾸준히 잘 하고 있어요!')
  } else if (stats.activeRate >= 40) {
    insights.push('조금만 더 힘내봐요')
  } else if (stats.activeRate > 0) {
    insights.push('다시 시작하는 것도 괜찮아요')
  } else {
    insights.push('첫 걸음을 내딛어 볼까요?')
  }

  // 미션 완료 인사이트
  if (stats.actionsCompleted > 0) {
    insights.push(`${stats.actionsCompleted}개의 미션을 완료했어요`)
  }

  // 학습 완료 인사이트
  if (stats.contentsCompleted >= 5) {
    insights.push('학습왕! 콘텐츠를 많이 봤네요')
  } else if (stats.contentsCompleted >= 1) {
    insights.push(`${stats.contentsCompleted}개의 콘텐츠를 학습했어요`)
  }

  // 연속 활동 인사이트
  const recentDays = stats.dailyActivity.slice(-3)
  const consecutiveActive = recentDays.every(d => d.count > 0)
  if (consecutiveActive && stats.activeDays >= 3) {
    insights.push('3일 연속 활동 중이에요!')
  }

  return insights.slice(0, 3) // 최대 3개만 반환
}
