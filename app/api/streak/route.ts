import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getWeekStart, getWeeklyActivityArray } from '@/lib/gamification'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 스트릭 조회
    const streakQuery = supabase
      .from('learning_streaks')
      .select('*')

    if (user) {
      streakQuery.eq('user_id', user.id)
    } else {
      streakQuery.eq('session_id', sessionId)
    }

    const { data: streak } = await streakQuery.single()

    // 이번 주 일별 활동 조회
    const weekStart = getWeekStart()
    const activitiesQuery = supabase
      .from('daily_activities')
      .select('activity_date')
      .gte('activity_date', weekStart)

    if (user) {
      activitiesQuery.eq('user_id', user.id)
    } else {
      activitiesQuery.eq('session_id', sessionId)
    }

    const { data: activities } = await activitiesQuery

    const weeklyActivity = getWeeklyActivityArray(activities || [])

    return NextResponse.json({
      success: true,
      streak: {
        current: streak?.current_streak || 0,
        longest: streak?.longest_streak || 0,
        lastActivityDate: streak?.last_activity_date || null,
        weeklyActivity
      }
    })

  } catch (error) {
    console.error('Error fetching streak:', error)
    return NextResponse.json(
      { error: 'Failed to fetch streak' },
      { status: 500 }
    )
  }
}
