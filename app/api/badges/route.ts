import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { BADGES } from '@/lib/gamification'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 획득한 뱃지 조회
    const badgesQuery = supabase
      .from('user_badges')
      .select('badge_id, earned_at')
      .order('earned_at', { ascending: true })

    if (user) {
      badgesQuery.eq('user_id', user.id)
    } else {
      badgesQuery.eq('session_id', sessionId)
    }

    const { data: earnedBadges } = await badgesQuery

    // 뱃지 정보와 합치기
    const badges = (earnedBadges || []).map(eb => {
      const badgeDef = BADGES[eb.badge_id as keyof typeof BADGES]
      return {
        id: eb.badge_id,
        name: badgeDef?.name || eb.badge_id,
        icon: badgeDef?.icon || '🏆',
        description: badgeDef?.description || '',
        earnedAt: eb.earned_at
      }
    })

    // 아직 획득하지 않은 뱃지 목록
    const earnedIds = new Set(earnedBadges?.map(b => b.badge_id) || [])
    const lockedBadges = Object.values(BADGES)
      .filter(b => !earnedIds.has(b.id))
      .map(b => ({
        id: b.id,
        name: b.name,
        icon: '🔒',
        description: b.description,
        earnedAt: null,
        locked: true
      }))

    return NextResponse.json({
      success: true,
      badges,
      lockedBadges,
      totalEarned: badges.length,
      totalAvailable: Object.keys(BADGES).length
    })

  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    )
  }
}
