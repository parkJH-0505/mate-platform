import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    // 커리큘럼 조회
    const { data: curriculum, error: curriculumError } = await supabase
      .from('curriculums')
      .select('*')
      .eq('id', id)
      .single()

    if (curriculumError || !curriculum) {
      return NextResponse.json(
        { error: 'Curriculum not found' },
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
      (modules || []).map(async (module) => {
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
