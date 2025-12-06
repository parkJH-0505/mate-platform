import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('sessionId')

    const supabase = await createClient()

    // 현재 사용자 확인
    const { data: { user } } = await supabase.auth.getUser()

    // 커리큘럼 조회 조건
    let query = supabase
      .from('curriculums')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (user) {
      query = query.eq('user_id', user.id)
    } else if (sessionId) {
      query = query.eq('session_id', sessionId)
    } else {
      return NextResponse.json(
        { error: 'User not authenticated and no session ID provided' },
        { status: 401 }
      )
    }

    const { data: curriculum, error: curriculumError } = await query.single()

    if (curriculumError || !curriculum) {
      return NextResponse.json(
        { error: 'No curriculum found' },
        { status: 404 }
      )
    }

    // 모듈 조회
    const { data: modules, error: modulesError } = await supabase
      .from('curriculum_modules')
      .select('*')
      .eq('curriculum_id', curriculum.id)
      .order('order_index', { ascending: true })

    if (modulesError) {
      throw modulesError
    }

    // 각 모듈의 콘텐츠 조회
    const modulesWithContents = await Promise.all(
      modules.map(async (module) => {
        const { data: contents } = await supabase
          .from('curriculum_contents')
          .select('*')
          .eq('module_id', module.id)
          .order('order_index', { ascending: true })

        return {
          id: module.id,
          week: module.week_number,
          title: module.title,
          description: module.description,
          contents: contents?.map((c) => ({
            id: c.id,
            title: c.title,
            creator: c.creator,
            duration: c.duration,
            type: c.content_type,
            thumbnail: c.content_type === 'video' ? '🎬' : '📄'
          })) || []
        }
      })
    )

    return NextResponse.json({
      success: true,
      curriculum: {
        id: curriculum.id,
        title: curriculum.title,
        description: curriculum.description,
        reasoning: curriculum.reasoning,
        industry: curriculum.industry,
        stage: curriculum.stage,
        goal: curriculum.goal,
        userName: curriculum.user_name,
        durationWeeks: curriculum.duration_weeks,
        createdAt: curriculum.created_at,
        modules: modulesWithContents
      }
    })

  } catch (error) {
    console.error('Error fetching curriculum:', error)
    return NextResponse.json(
      { error: 'Failed to fetch curriculum' },
      { status: 500 }
    )
  }
}
