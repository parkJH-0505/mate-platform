import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface UserContext {
  level: number
  currentModuleId: string | null
  industry: string | null
  completedContentIds: string[]
  recentCategories: string[]
}

interface ContentRecommendation {
  id: string
  title: string
  content_type: string
  duration_minutes: number | null
  thumbnail_url: string | null
  category: string | null
  level: number
  view_count: number
  like_count: number
  is_featured: boolean
  featured_reason: string | null
  recommendReason: string
}

// 이번 주 추천 콘텐츠 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const limit = parseInt(searchParams.get('limit') || '5')

    const { data: { user } } = await supabase.auth.getUser()

    // 1. 사용자 컨텍스트 수집
    const userContext = await getUserContext(supabase, user?.id || null, sessionId)

    // 2. 추천 콘텐츠 조회
    const recommendations = await getRecommendations(supabase, userContext, limit)

    // 3. 추천 이유 생성
    const enrichedRecommendations: ContentRecommendation[] = recommendations.map((content: any) => ({
      ...content,
      recommendReason: generateRecommendReason(content, userContext)
    }))

    return NextResponse.json({
      success: true,
      recommendations: enrichedRecommendations,
      context: {
        currentLevel: userContext.level,
        currentModuleId: userContext.currentModuleId,
        industry: userContext.industry
      }
    })
  } catch (error: any) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations', details: error?.message },
      { status: 500 }
    )
  }
}

// 사용자 컨텍스트 수집
async function getUserContext(
  supabase: any,
  userId: string | null,
  sessionId: string | null
): Promise<UserContext> {
  const context: UserContext = {
    level: 2,
    currentModuleId: null,
    industry: null,
    completedContentIds: [],
    recentCategories: []
  }

  if (!userId && !sessionId) {
    return context
  }

  // 진행 상태 조회
  let progressQuery = supabase
    .from('user_progress')
    .select(`
      content_id,
      curriculum_contents (
        category
      )
    `)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(20)

  if (userId) {
    progressQuery = progressQuery.eq('user_id', userId)
  } else if (sessionId) {
    progressQuery = progressQuery.eq('session_id', sessionId)
  }

  const { data: progress } = await progressQuery

  if (progress && progress.length > 0) {
    context.completedContentIds = progress.map((p: any) => p.content_id)
    context.recentCategories = progress
      .map((p: any) => p.curriculum_contents?.category)
      .filter(Boolean)

    // 완료 콘텐츠 수에 따른 레벨 추정
    const completedCount = progress.length
    if (completedCount <= 3) context.level = 1
    else if (completedCount <= 8) context.level = 2
    else if (completedCount <= 15) context.level = 3
    else if (completedCount <= 25) context.level = 4
    else context.level = 5
  }

  // 현재 커리큘럼 정보 조회
  let curriculumQuery = supabase
    .from('curriculums')
    .select('industry')
    .order('created_at', { ascending: false })
    .limit(1)

  if (userId) {
    curriculumQuery = curriculumQuery.eq('user_id', userId)
  } else if (sessionId) {
    curriculumQuery = curriculumQuery.eq('session_id', sessionId)
  }

  const { data: curriculum } = await curriculumQuery

  if (curriculum && curriculum.length > 0) {
    context.industry = curriculum[0].industry
  }

  return context
}

// 추천 콘텐츠 조회
async function getRecommendations(
  supabase: any,
  context: UserContext,
  limit: number
) {
  let query = supabase
    .from('curriculum_contents')
    .select(`
      id, title, content_type, duration_minutes, thumbnail_url,
      category, level, view_count, like_count,
      is_featured, featured_reason
    `)
    .eq('is_active', true)

  // 이미 완료한 콘텐츠 제외
  if (context.completedContentIds.length > 0) {
    query = query.not('id', 'in', `(${context.completedContentIds.join(',')})`)
  }

  // 레벨 필터 (±1 범위)
  const minLevel = Math.max(1, context.level - 1)
  const maxLevel = Math.min(5, context.level + 1)
  query = query.gte('level', minLevel).lte('level', maxLevel)

  // 정렬: 추천 > 인기 > 최신
  query = query
    .order('is_featured', { ascending: false })
    .order('view_count', { ascending: false })
    .limit(limit)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching recommendations:', error)
    return []
  }

  return data || []
}

// 추천 이유 생성
function generateRecommendReason(content: any, context: UserContext): string {
  if (content.is_featured && content.featured_reason) {
    return content.featured_reason
  }

  if (content.level === context.level) {
    return '현재 레벨에 딱 맞는 콘텐츠'
  }

  if (content.view_count > 100) {
    return `${content.view_count.toLocaleString()}명이 시청한 인기 콘텐츠`
  }

  if (context.recentCategories.includes(content.category)) {
    return '최근 관심사와 연결된 콘텐츠'
  }

  if (content.level < context.level) {
    return '기초를 다시 잡기 좋은 콘텐츠'
  }

  if (content.level > context.level) {
    return '한 단계 도약을 위한 콘텐츠'
  }

  return '당신의 성장을 위한 추천'
}
