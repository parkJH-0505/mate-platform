import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// 익명 세션 데이터를 로그인 사용자로 마이그레이션
export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    const supabase = await createClient()

    // 로그인 상태 확인
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // 익명 세션 데이터 조회
    const { data: sessionData, error: sessionError } = await supabase
      .from('anonymous_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    if (sessionError || !sessionData) {
      // 세션이 없어도 에러가 아닐 수 있음 (이미 마이그레이션됨)
      return NextResponse.json({ success: true, message: 'No session to migrate' })
    }

    // 사용자 데이터 업데이트
    const { error: updateError } = await supabase
      .from('users')
      .update({
        onboarding_industry: sessionData.onboarding_industry,
        onboarding_stage: sessionData.onboarding_stage,
        onboarding_concerns: sessionData.onboarding_concerns,
        onboarding_goal: sessionData.onboarding_goal,
        name: sessionData.onboarding_name || user.user_metadata.full_name,
        onboarding_completed_at: sessionData.onboarding_industry ? new Date().toISOString() : null,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to migrate data:', updateError)
      return NextResponse.json({ error: 'Failed to migrate data' }, { status: 500 })
    }

    // 익명 세션 삭제
    await supabase
      .from('anonymous_sessions')
      .delete()
      .eq('session_id', sessionId)

    return NextResponse.json({ success: true, message: 'Migration complete' })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
