import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { calculateLevel, LEVELS } from '@/lib/gamification'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 레벨 조회
    const levelQuery = supabase
      .from('user_levels')
      .select('*')

    if (user) {
      levelQuery.eq('user_id', user.id)
    } else {
      levelQuery.eq('session_id', sessionId)
    }

    const { data: levelData } = await levelQuery.single()

    const totalXP = levelData?.total_xp || 0
    const levelInfo = calculateLevel(totalXP)

    return NextResponse.json({
      success: true,
      level: {
        ...levelInfo,
        totalXP
      },
      allLevels: LEVELS
    })

  } catch (error) {
    console.error('Error fetching level:', error)
    return NextResponse.json(
      { error: 'Failed to fetch level' },
      { status: 500 }
    )
  }
}
