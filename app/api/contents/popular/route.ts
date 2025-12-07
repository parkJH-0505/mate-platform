import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 인기 콘텐츠 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const period = searchParams.get('period') || 'week'
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')

    let query = supabase
      .from('curriculum_contents')
      .select(`
        id, title, content_type, duration_minutes, thumbnail_url,
        category, level, view_count, like_count, save_count,
        preview_text, duration
      `)
      .eq('is_active', true)

    // 카테고리 필터
    if (category) {
      query = query.eq('category', category)
    }

    // 인기순 정렬
    query = query
      .order('view_count', { ascending: false })
      .limit(limit)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching popular contents:', error)
      return NextResponse.json(
        { error: 'Failed to fetch popular contents', details: error.message },
        { status: 500 }
      )
    }

    // duration_minutes 처리
    const processedData = (data || []).map((content: any) => ({
      ...content,
      duration_minutes: content.duration_minutes || extractMinutes(content.duration)
    }))

    return NextResponse.json({
      success: true,
      popular: processedData,
      period
    })
  } catch (error: any) {
    console.error('Error in popular contents API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}

function extractMinutes(duration: string | null): number | null {
  if (!duration) return null
  const match = duration.match(/(\d+)/)
  return match ? parseInt(match[1]) : null
}
