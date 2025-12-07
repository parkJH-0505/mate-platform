import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 미션 제출
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: actionId } = await params
    const supabase = await createClient()
    const body = await request.json()
    const { sessionId, submissionType, text, url, number, fileUrl, checklistProgress } = body

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 미션 존재 확인
    const { data: action, error: actionError } = await supabase
      .from('actions')
      .select('id, type, title')
      .eq('id', actionId)
      .eq('is_active', true)
      .single()

    if (actionError || !action) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 })
    }

    // 기존 진행 기록 확인
    let existingQuery = supabase
      .from('user_actions')
      .select('*')
      .eq('action_id', actionId)

    if (user) {
      existingQuery = existingQuery.eq('user_id', user.id)
    } else {
      existingQuery = existingQuery.eq('session_id', sessionId)
    }

    const { data: existing } = await existingQuery.maybeSingle()

    // 제출 데이터 구성
    const submissionData: any = {
      submission_type: submissionType,
      status: 'submitted',
      submitted_at: new Date().toISOString()
    }

    // 유형별 제출 내용 설정
    switch (submissionType) {
      case 'text':
        submissionData.submission_text = text
        break
      case 'link':
        submissionData.submission_url = url
        break
      case 'number':
        submissionData.submission_number = number
        break
      case 'file':
        submissionData.submission_file_url = fileUrl
        break
      case 'checklist':
        submissionData.checklist_progress = checklistProgress
        break
    }

    let result

    if (existing) {
      // 기존 기록 업데이트
      const { data, error } = await supabase
        .from('user_actions')
        .update(submissionData)
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // 새 기록 생성
      const insertData = {
        action_id: actionId,
        user_id: user?.id || null,
        session_id: user ? null : sessionId,
        ...submissionData
      }

      const { data, error } = await supabase
        .from('user_actions')
        .insert(insertData)
        .select()
        .single()

      if (error) throw error
      result = data
    }

    // 성장 로그 기록
    await supabase.from('growth_logs').insert({
      user_id: user?.id || null,
      session_id: user ? null : sessionId,
      log_type: 'action_submitted',
      reference_id: actionId,
      reference_type: 'action',
      title: `"${action.title}" 미션 제출`,
      icon: '🎯',
      metadata: { submissionType }
    })

    return NextResponse.json({
      success: true,
      userAction: result
    })
  } catch (error: any) {
    console.error('Error submitting action:', error)
    return NextResponse.json(
      { error: 'Failed to submit action', details: error?.message },
      { status: 500 }
    )
  }
}

// 미션 완료 처리 (자동 또는 수동)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: actionId } = await params
    const supabase = await createClient()
    const body = await request.json()
    const { sessionId, actualMinutes } = body

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 사용자 미션 기록 조회
    let query = supabase
      .from('user_actions')
      .select('*')
      .eq('action_id', actionId)

    if (user) {
      query = query.eq('user_id', user.id)
    } else {
      query = query.eq('session_id', sessionId)
    }

    const { data: userAction, error: fetchError } = await query.single()

    if (fetchError || !userAction) {
      return NextResponse.json({ error: 'User action not found' }, { status: 404 })
    }

    // 완료 처리
    const { data, error } = await supabase
      .from('user_actions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        actual_minutes: actualMinutes || null
      })
      .eq('id', userAction.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      userAction: data
    })
  } catch (error: any) {
    console.error('Error completing action:', error)
    return NextResponse.json(
      { error: 'Failed to complete action', details: error?.message },
      { status: 500 }
    )
  }
}
