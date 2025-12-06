import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contentId, curriculumId, sessionId } = body

    if (!contentId || !curriculumId || !sessionId) {
      return NextResponse.json(
        { error: 'contentId, curriculumId, and sessionId are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 이미 완료된 콘텐츠인지 확인
    const { data: existing } = await supabase
      .from('user_progress')
      .select('id')
      .eq('content_id', contentId)
      .eq('session_id', sessionId)
      .single()

    if (existing) {
      // 이미 존재하면 업데이트
      await supabase
        .from('user_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', existing.id)
    } else {
      // 새로 생성
      await supabase
        .from('user_progress')
        .insert({
          content_id: contentId,
          curriculum_id: curriculumId,
          session_id: sessionId,
          completed: true,
          completed_at: new Date().toISOString()
        })
    }

    return NextResponse.json({
      success: true,
      message: 'Content marked as completed'
    })

  } catch (error) {
    console.error('Error completing content:', error)
    return NextResponse.json(
      { error: 'Failed to complete content' },
      { status: 500 }
    )
  }
}
