import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface OnboardingData {
  sessionId?: string
  industry: string
  stage: string
  concerns: string[]
  goal: string
  name: string
}

// 온보딩 데이터 저장
export async function POST(request: Request) {
  try {
    const body: OnboardingData = await request.json()
    const { sessionId, industry, stage, concerns, goal, name } = body

    // 필수 필드 검증
    if (!industry || !stage || !concerns.length || !goal || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 로그인 상태 확인
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // 로그인 사용자: users 테이블에 저장
      const { error } = await supabase
        .from('users')
        .update({
          onboarding_industry: industry,
          onboarding_stage: stage,
          onboarding_concerns: concerns,
          onboarding_goal: goal,
          name: name,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) {
        console.error('Failed to save onboarding for user:', error)
        return NextResponse.json({ error: 'Failed to save onboarding' }, { status: 500 })
      }

      return NextResponse.json({ success: true, userId: user.id })
    } else if (sessionId) {
      // 비로그인 사용자: anonymous_sessions 테이블에 저장
      const { error } = await supabase
        .from('anonymous_sessions')
        .update({
          onboarding_industry: industry,
          onboarding_stage: stage,
          onboarding_concerns: concerns,
          onboarding_goal: goal,
          onboarding_name: name,
        })
        .eq('session_id', sessionId)

      if (error) {
        console.error('Failed to save onboarding for anonymous:', error)
        return NextResponse.json({ error: 'Failed to save onboarding' }, { status: 500 })
      }

      return NextResponse.json({ success: true, sessionId })
    } else {
      return NextResponse.json(
        { error: 'Either sessionId or authenticated user required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Onboarding save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 온보딩 데이터 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    const supabase = await createClient()

    // 로그인 상태 확인
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // 로그인 사용자
      const { data, error } = await supabase
        .from('users')
        .select('onboarding_industry, onboarding_stage, onboarding_concerns, onboarding_goal, name, onboarding_completed_at')
        .eq('id', user.id)
        .single()

      if (error) {
        return NextResponse.json({ error: 'Failed to fetch onboarding' }, { status: 500 })
      }

      return NextResponse.json({
        industry: data.onboarding_industry,
        stage: data.onboarding_stage,
        concerns: data.onboarding_concerns,
        goal: data.onboarding_goal,
        name: data.name,
        completed: !!data.onboarding_completed_at,
      })
    } else if (sessionId) {
      // 비로그인 사용자
      const { data, error } = await supabase
        .from('anonymous_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Session not found' }, { status: 404 })
        }
        return NextResponse.json({ error: 'Failed to fetch onboarding' }, { status: 500 })
      }

      return NextResponse.json({
        industry: data.onboarding_industry,
        stage: data.onboarding_stage,
        concerns: data.onboarding_concerns,
        goal: data.onboarding_goal,
        name: data.onboarding_name,
        completed: !!data.onboarding_industry, // 산업이 있으면 완료로 간주
      })
    } else {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
  } catch (error) {
    console.error('Onboarding fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
