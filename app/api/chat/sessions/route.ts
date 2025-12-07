import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 채팅 세션 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 세션 목록 조회
    const query = supabase
      .from('chat_sessions')
      .select(`
        id,
        title,
        context,
        created_at,
        updated_at,
        is_active
      `)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(20)

    if (user) {
      query.eq('user_id', user.id)
    } else {
      query.eq('session_id', sessionId)
    }

    const { data: sessions, error } = await query

    if (error) throw error

    // 각 세션의 마지막 메시지 가져오기
    const sessionsWithLastMessage = await Promise.all(
      (sessions || []).map(async (session) => {
        const { data: lastMessage } = await supabase
          .from('chat_messages')
          .select('content, role, created_at')
          .eq('chat_session_id', session.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        return {
          ...session,
          lastMessage: lastMessage || null,
        }
      })
    )

    return NextResponse.json({
      success: true,
      sessions: sessionsWithLastMessage,
    })
  } catch (error) {
    console.error('Error fetching chat sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat sessions' },
      { status: 500 }
    )
  }
}

// 새 채팅 세션 생성
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { sessionId, contentId, curriculumId, title } = body

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 컨텍스트 구성
    const context: Record<string, unknown> = {}
    if (contentId) context.contentId = contentId
    if (curriculumId) context.curriculumId = curriculumId

    // 세션 생성
    const insertData: Record<string, unknown> = {
      title: title || '새 대화',
      context,
    }

    if (user) {
      insertData.user_id = user.id
    } else {
      insertData.session_id = sessionId
    }

    const { data: session, error } = await supabase
      .from('chat_sessions')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      session,
    })
  } catch (error) {
    console.error('Error creating chat session:', error)
    return NextResponse.json(
      { error: 'Failed to create chat session' },
      { status: 500 }
    )
  }
}
