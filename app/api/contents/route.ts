import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 콘텐츠 목록 조회 (필터/검색/페이지네이션)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // 필터 파라미터
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const contentType = searchParams.get('type')
    const search = searchParams.get('q')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const sort = searchParams.get('sort') || 'popular'

    // 페이지네이션
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = supabase
      .from('curriculum_contents')
      .select(`
        id, title, content_type, duration_minutes, thumbnail_url,
        category, level, tags, view_count, like_count, save_count,
        preview_text, created_at, duration
      `, { count: 'exact' })
      .eq('is_active', true)

    // 필터 적용
    if (category) {
      query = query.eq('category', category)
    }

    if (level) {
      query = query.eq('level', parseInt(level))
    }

    if (contentType) {
      query = query.eq('content_type', contentType)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,preview_text.ilike.%${search}%`)
    }

    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags)
    }

    // 정렬
    switch (sort) {
      case 'popular':
        query = query.order('view_count', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'az':
        query = query.order('title', { ascending: true })
        break
      case 'likes':
        query = query.order('like_count', { ascending: false })
        break
      case 'saves':
        query = query.order('save_count', { ascending: false })
        break
      default:
        query = query.order('view_count', { ascending: false })
    }

    // 페이지네이션
    query = query.range(offset, offset + limit - 1)

    const { data, count, error } = await query

    if (error) {
      console.error('Error fetching contents:', error)
      return NextResponse.json(
        { error: 'Failed to fetch contents', details: error.message },
        { status: 500 }
      )
    }

    // duration_minutes가 없으면 duration에서 추출
    const processedData = (data || []).map((content: any) => ({
      ...content,
      duration_minutes: content.duration_minutes || extractMinutes(content.duration)
    }))

    return NextResponse.json({
      success: true,
      contents: processedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: offset + limit < (count || 0)
      }
    })
  } catch (error: any) {
    console.error('Error in contents API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}

// duration 문자열에서 분 추출
function extractMinutes(duration: string | null): number | null {
  if (!duration) return null
  const match = duration.match(/(\d+)/)
  return match ? parseInt(match[1]) : null
}
