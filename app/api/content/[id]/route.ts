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

    // 현재 사용자 확인
    const { data: { user } } = await supabase.auth.getUser()

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

    // 구독 상태 확인
    let isSubscribed = false
    if (user) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .in('status', ['active', 'canceled'])
        .single()

      if (subscription) {
        const now = new Date()
        const periodEnd = new Date(subscription.current_period_end)
        isSubscribed = now <= periodEnd
      }
    }

    // 콘텐츠 순서 확인 (이 콘텐츠가 커리큘럼에서 몇 번째인지)
    let contentIndex = 0
    if (content.module?.curriculum_id) {
      // 같은 커리큘럼의 모든 모듈 조회
      const { data: modules } = await supabase
        .from('curriculum_modules')
        .select('id')
        .eq('curriculum_id', content.module.curriculum_id)
        .order('week_number', { ascending: true })

      if (modules && modules.length > 0) {
        const moduleIds = modules.map(m => m.id)

        // 현재 콘텐츠보다 앞에 있는 콘텐츠 수 계산
        const { count } = await supabase
          .from('curriculum_contents')
          .select('*', { count: 'exact', head: true })
          .in('module_id', moduleIds)
          .lt('order_index', content.order_index)

        contentIndex = count || 0
      }
    }

    // 첫 번째 콘텐츠(index 0)만 무료, 나머지는 구독 필요
    const requiresSubscription = contentIndex > 0 && !isSubscribed

    // 진행 상황 조회
    let completed = false
    const progressQuery = supabase
      .from('user_progress')
      .select('completed')
      .eq('content_id', id)

    if (user) {
      progressQuery.eq('user_id', user.id)
    } else if (sessionId) {
      progressQuery.eq('session_id', sessionId)
    }

    const { data: progress } = await progressQuery.single()
    completed = progress?.completed || false

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
        creator: content.creator || 'MATE',
        duration: content.duration || '10:00',
        type: content.content_type || 'video',
        description: content.description || null,
        module: {
          id: content.module_id,
          title: content.module?.title || '',
          weekNumber: content.module?.week_number || 1,
          curriculumId: content.module?.curriculum_id
        },
        isCompleted: completed,
        contentIndex,
        requiresSubscription
      },
      isSubscribed,
      nextContent: nextContent ? {
        id: nextContent.id,
        title: nextContent.title,
        creator: 'MATE',
        duration: '10:00'
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
