import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 콘텐츠 조회 기록
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await params
    const supabase = await createClient()
    const body = await request.json()
    const { sessionId, durationSeconds, completionRate } = body

    const { data: { user } } = await supabase.auth.getUser()

    // 비로그인 + 세션 없어도 조회 기록은 허용 (통계용)
    const insertData: any = {
      content_id: contentId,
      view_duration_seconds: durationSeconds || 0,
      completion_rate: completionRate || 0
    }

    if (user) {
      insertData.user_id = user.id
    } else if (sessionId) {
      insertData.session_id = sessionId
    } else {
      // 익명 조회 - session_id를 임시로 생성
      insertData.session_id = `anon_${Date.now()}`
    }

    const { data, error } = await supabase
      .from('user_content_views')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error recording view:', error)
      return NextResponse.json(
        { error: 'Failed to record view', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, view: data })
  } catch (error: any) {
    console.error('Error in view API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}

// 조회 기록 업데이트 (시청 시간, 완료율 업데이트용)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await params
    const supabase = await createClient()
    const body = await request.json()
    const { sessionId, viewId, durationSeconds, completionRate } = body

    const { data: { user } } = await supabase.auth.getUser()

    if (!viewId) {
      return NextResponse.json({ error: 'View ID required' }, { status: 400 })
    }

    let query = supabase
      .from('user_content_views')
      .update({
        view_duration_seconds: durationSeconds,
        completion_rate: completionRate
      })
      .eq('id', viewId)
      .eq('content_id', contentId)

    if (user) {
      query = query.eq('user_id', user.id)
    } else if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    const { data, error } = await query.select().single()

    if (error) {
      console.error('Error updating view:', error)
      return NextResponse.json(
        { error: 'Failed to update view', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, view: data })
  } catch (error: any) {
    console.error('Error in view update API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}
