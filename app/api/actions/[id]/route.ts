import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 미션 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    const { data: { user } } = await supabase.auth.getUser()

    // 미션 정보 조회
    const { data: action, error } = await supabase
      .from('actions')
      .select(`
        *,
        curriculum_contents (
          id,
          title,
          content_type
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !action) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 })
    }

    // 사용자 진행 상태 조회
    let userAction = null
    if (user || sessionId) {
      let progressQuery = supabase
        .from('user_actions')
        .select('*')
        .eq('action_id', id)

      if (user) {
        progressQuery = progressQuery.eq('user_id', user.id)
      } else {
        progressQuery = progressQuery.eq('session_id', sessionId)
      }

      const { data } = await progressQuery.maybeSingle()
      userAction = data
    }

    return NextResponse.json({
      success: true,
      action: {
        ...action,
        userProgress: userAction
      }
    })
  } catch (error: any) {
    console.error('Error fetching action:', error)
    return NextResponse.json(
      { error: 'Failed to fetch action', details: error?.message },
      { status: 500 }
    )
  }
}
