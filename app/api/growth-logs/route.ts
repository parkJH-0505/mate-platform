import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 성장 로그 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const sessionId = searchParams.get('sessionId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const logType = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 기본 쿼리
    let query = supabase
      .from('growth_logs')
      .select('*', { count: 'exact' })

    if (user) {
      query = query.eq('user_id', user.id)
    } else {
      query = query.eq('session_id', sessionId)
    }

    // 필터 적용
    if (logType) {
      query = query.eq('log_type', logType)
    }
    if (startDate) {
      query = query.gte('logged_at', startDate)
    }
    if (endDate) {
      query = query.lte('logged_at', endDate)
    }

    // 정렬 및 페이지네이션
    query = query
      .order('logged_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, count, error } = await query

    if (error) throw error

    // 날짜별 그룹화
    const groupedByDate: Record<string, any[]> = {}
    data?.forEach(log => {
      const date = new Date(log.logged_at).toISOString().split('T')[0]
      if (!groupedByDate[date]) {
        groupedByDate[date] = []
      }
      groupedByDate[date].push(log)
    })

    return NextResponse.json({
      success: true,
      logs: data,
      groupedByDate,
      total: count || 0,
      hasMore: (offset + limit) < (count || 0)
    })
  } catch (error: any) {
    console.error('Error fetching growth logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch growth logs', details: error?.message },
      { status: 500 }
    )
  }
}

// 메모 추가
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { sessionId, content, title } = body

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('growth_logs')
      .insert({
        user_id: user?.id || null,
        session_id: user ? null : sessionId,
        log_type: 'note',
        title: title || '메모',
        description: content.trim(),
        icon: '📝'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      log: data
    })
  } catch (error: any) {
    console.error('Error creating growth log:', error)
    return NextResponse.json(
      { error: 'Failed to create growth log', details: error?.message },
      { status: 500 }
    )
  }
}
