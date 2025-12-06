import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const curriculumId = searchParams.get('curriculumId')
    const sessionId = searchParams.get('sessionId')

    if (!curriculumId) {
      return NextResponse.json(
        { error: 'curriculumId is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 커리큘럼의 모든 콘텐츠 수 조회
    const { data: modules } = await supabase
      .from('curriculum_modules')
      .select('id')
      .eq('curriculum_id', curriculumId)

    const moduleIds = modules?.map(m => m.id) || []

    const { count: totalContents } = await supabase
      .from('curriculum_contents')
      .select('*', { count: 'exact', head: true })
      .in('module_id', moduleIds)

    // 완료된 콘텐츠 조회
    let completedIds: string[] = []
    if (sessionId) {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('content_id')
        .eq('curriculum_id', curriculumId)
        .eq('session_id', sessionId)
        .eq('completed', true)

      completedIds = progress?.map(p => p.content_id) || []
    }

    const completedContents = completedIds.length
    const progressPercent = totalContents
      ? Math.round((completedContents / totalContents) * 100)
      : 0

    return NextResponse.json({
      success: true,
      totalContents: totalContents || 0,
      completedContents,
      progressPercent,
      completedIds
    })

  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}
