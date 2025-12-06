import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    // 콘텐츠 조회
    const { data: content, error: contentError } = await supabase
      .from('curriculum_contents')
      .select(`
        *,
        module:curriculum_modules(
          id,
          week_number,
          title,
          curriculum_id
        )
      `)
      .eq('id', id)
      .single()

    if (contentError || !content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // 진행 상황 조회
    let completed = false
    if (sessionId) {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('completed')
        .eq('content_id', id)
        .eq('session_id', sessionId)
        .single()

      completed = progress?.completed || false
    }

    // 같은 모듈의 다음 콘텐츠 조회
    const { data: nextContent } = await supabase
      .from('curriculum_contents')
      .select('id, title, content_type')
      .eq('module_id', content.module_id)
      .gt('order_index', content.order_index)
      .order('order_index', { ascending: true })
      .limit(1)
      .single()

    return NextResponse.json({
      success: true,
      content: {
        id: content.id,
        title: content.title,
        creator: content.creator,
        duration: content.duration,
        type: content.content_type,
        moduleId: content.module_id,
        moduleTitle: content.module?.title,
        weekNumber: content.module?.week_number,
        curriculumId: content.module?.curriculum_id,
        completed
      },
      nextContent: nextContent ? {
        id: nextContent.id,
        title: nextContent.title,
        type: nextContent.content_type
      } : null
    })

  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}
