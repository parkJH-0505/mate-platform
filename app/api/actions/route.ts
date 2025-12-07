import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 미션 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const contentId = searchParams.get('contentId')
    const moduleId = searchParams.get('moduleId')
    const sessionId = searchParams.get('sessionId')
    const limit = parseInt(searchParams.get('limit') || '20')

    const { data: { user } } = await supabase.auth.getUser()

    // 기본 쿼리: 활성화된 미션만
    let query = supabase
      .from('actions')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
      .limit(limit)

    // 필터 적용
    if (contentId) {
      query = query.eq('content_id', contentId)
    }
    if (moduleId) {
      query = query.eq('module_id', moduleId)
    }

    const { data: actions, error } = await query

    if (error) throw error

    // 사용자의 진행 상태 조회
    let actionsWithProgress = actions || []

    if ((user || sessionId) && actions && actions.length > 0) {
      const actionIds = actions.map(a => a.id)

      let progressQuery = supabase
        .from('user_actions')
        .select('action_id, status, submitted_at, completed_at')
        .in('action_id', actionIds)

      if (user) {
        progressQuery = progressQuery.eq('user_id', user.id)
      } else if (sessionId) {
        progressQuery = progressQuery.eq('session_id', sessionId)
      }

      const { data: userActions } = await progressQuery

      // 진행 상태 병합
      actionsWithProgress = actions.map(action => {
        const userAction = userActions?.find(ua => ua.action_id === action.id)
        return {
          ...action,
          userProgress: userAction || null
        }
      })
    }

    return NextResponse.json({
      success: true,
      actions: actionsWithProgress
    })
  } catch (error: any) {
    console.error('Error fetching actions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch actions', details: error?.message },
      { status: 500 }
    )
  }
}
