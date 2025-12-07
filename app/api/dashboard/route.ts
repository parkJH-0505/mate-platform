import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    // 현재 사용자 확인
    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 사용자 프로필 조회
    let userName = '학습자'
    let userAvatar = null

    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('name, profile_image')
        .eq('id', user.id)
        .single()

      if (profile) {
        userName = profile.name || user.user_metadata?.name || '학습자'
        userAvatar = profile.profile_image || user.user_metadata?.avatar_url
      }
    }

    // 현재 커리큘럼 조회
    const curriculumQuery = supabase
      .from('curriculums')
      .select(`
        id,
        title,
        description,
        industry,
        stage,
        goal,
        duration_weeks,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(1)

    if (user) {
      curriculumQuery.eq('user_id', user.id)
    } else if (sessionId) {
      curriculumQuery.eq('session_id', sessionId)
    }

    const { data: curriculums } = await curriculumQuery

    const currentCurriculum = curriculums?.[0] || null

    // 학습 진행률 계산
    let stats = {
      totalContentsCompleted: 0,
      totalCurriculums: 0,
      currentStreak: 0,
      totalLearningMinutes: 0
    }

    let progress = {
      totalContents: 0,
      completedContents: 0,
      progressPercent: 0
    }

    let nextContent = null

    if (currentCurriculum) {
      // 전체 콘텐츠 수
      const { data: modules } = await supabase
        .from('curriculum_modules')
        .select('id')
        .eq('curriculum_id', currentCurriculum.id)

      if (modules && modules.length > 0) {
        const moduleIds = modules.map(m => m.id)

        const { count: totalCount } = await supabase
          .from('curriculum_contents')
          .select('*', { count: 'exact', head: true })
          .in('module_id', moduleIds)

        progress.totalContents = totalCount || 0

        // 완료한 콘텐츠 수
        const progressQuery = supabase
          .from('user_progress')
          .select('content_id')
          .eq('curriculum_id', currentCurriculum.id)
          .eq('completed', true)

        if (user) {
          progressQuery.eq('user_id', user.id)
        } else if (sessionId) {
          progressQuery.eq('session_id', sessionId)
        }

        const { data: completedProgress } = await progressQuery
        progress.completedContents = completedProgress?.length || 0
        progress.progressPercent = progress.totalContents > 0
          ? Math.round((progress.completedContents / progress.totalContents) * 100)
          : 0

        stats.totalContentsCompleted = progress.completedContents

        // 다음 학습할 콘텐츠 찾기
        const completedIds = completedProgress?.map(p => p.content_id) || []

        const { data: nextContents } = await supabase
          .from('curriculum_contents')
          .select(`
            id,
            title,
            content_type,
            duration,
            module:curriculum_modules(week_number, title)
          `)
          .in('module_id', moduleIds)
          .not('id', 'in', completedIds.length > 0 ? `(${completedIds.join(',')})` : '(00000000-0000-0000-0000-000000000000)')
          .order('order_index', { ascending: true })
          .limit(1)

        if (nextContents && nextContents.length > 0) {
          const next = nextContents[0]
          const moduleData = Array.isArray(next.module) ? next.module[0] : next.module
          nextContent = {
            id: next.id,
            title: next.title,
            type: next.content_type,
            duration: next.duration,
            weekNumber: moduleData?.week_number,
            moduleTitle: moduleData?.title
          }
        }
      }
    }

    // 총 커리큘럼 수
    const curriculumCountQuery = supabase
      .from('curriculums')
      .select('*', { count: 'exact', head: true })

    if (user) {
      curriculumCountQuery.eq('user_id', user.id)
    } else if (sessionId) {
      curriculumCountQuery.eq('session_id', sessionId)
    }

    const { count: totalCurriculums } = await curriculumCountQuery
    stats.totalCurriculums = totalCurriculums || 0

    // 학습 시간 추정 (콘텐츠당 평균 10분)
    stats.totalLearningMinutes = stats.totalContentsCompleted * 10

    // 최근 활동 조회
    const activitiesQuery = supabase
      .from('user_progress')
      .select(`
        id,
        completed_at,
        content:curriculum_contents(title)
      `)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
      .limit(5)

    if (user) {
      activitiesQuery.eq('user_id', user.id)
    } else if (sessionId) {
      activitiesQuery.eq('session_id', sessionId)
    }

    const { data: activities } = await activitiesQuery

    const recentActivities = activities?.map(a => {
      const contentData = Array.isArray(a.content) ? a.content[0] : a.content
      return {
        id: a.id,
        type: 'content_completed',
        title: contentData?.title || '콘텐츠',
        completedAt: a.completed_at
      }
    }) || []

    return NextResponse.json({
      success: true,
      user: {
        name: userName,
        avatar: userAvatar,
        isAuthenticated: !!user
      },
      stats,
      currentCurriculum: currentCurriculum ? {
        id: currentCurriculum.id,
        title: currentCurriculum.title,
        industry: currentCurriculum.industry,
        stage: currentCurriculum.stage,
        goal: currentCurriculum.goal,
        progress: progress.progressPercent,
        totalContents: progress.totalContents,
        completedContents: progress.completedContents,
        nextContent
      } : null,
      recentActivities
    })

  } catch (error) {
    console.error('Error fetching dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
