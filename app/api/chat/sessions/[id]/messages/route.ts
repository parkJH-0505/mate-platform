import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { streamChatResponse, generateShortResponse, ChatMessage } from '@/lib/ai/openai-chat'
import { buildSystemPrompt } from '@/lib/ai/prompts'
import { buildUserContext } from '@/lib/ai/context'

interface RouteParams {
  params: Promise<{ id: string }>
}

// 메시지 히스토리 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const sessionIdParam = searchParams.get('sessionId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionIdParam) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 세션 소유권 확인
    const sessionQuery = supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', id)

    if (user) {
      sessionQuery.eq('user_id', user.id)
    } else {
      sessionQuery.eq('session_id', sessionIdParam)
    }

    const { data: session } = await sessionQuery.single()

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // 메시지 조회
    const { data: messages, error, count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact' })
      .eq('chat_session_id', id)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      success: true,
      messages: messages || [],
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// 메시지 전송 및 AI 응답 (스트리밍)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: chatSessionId } = await params
    const supabase = await createClient()
    const body = await request.json()
    const { message, sessionId: sessionIdParam, contentId } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || null

    if (!userId && !sessionIdParam) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 세션 소유권 확인
    const sessionQuery = supabase
      .from('chat_sessions')
      .select('id, context')
      .eq('id', chatSessionId)

    if (userId) {
      sessionQuery.eq('user_id', userId)
    } else {
      sessionQuery.eq('session_id', sessionIdParam)
    }

    const { data: session } = await sessionQuery.single()

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // 1. 사용자 메시지 저장
    const { error: userMsgError } = await supabase
      .from('chat_messages')
      .insert({
        chat_session_id: chatSessionId,
        role: 'user',
        content: message,
      })

    if (userMsgError) throw userMsgError

    // 2. 이전 메시지 히스토리 가져오기 (최근 10개)
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('chat_session_id', chatSessionId)
      .order('created_at', { ascending: false })
      .limit(10)

    const chatHistory: ChatMessage[] = (history || [])
      .reverse()
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }))

    // 3. 사용자 컨텍스트 빌드
    const effectiveContentId = contentId || (session.context as Record<string, unknown>)?.contentId
    const userContext = await buildUserContext(userId, sessionIdParam, effectiveContentId as string)
    const systemPrompt = buildSystemPrompt(userContext)

    // 4. 스트리밍 응답 생성
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = ''

        try {
          for await (const chunk of streamChatResponse(systemPrompt, chatHistory)) {
            fullResponse += chunk
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
          }

          // 5. AI 응답 저장
          await supabase
            .from('chat_messages')
            .insert({
              chat_session_id: chatSessionId,
              role: 'assistant',
              content: fullResponse,
            })

          // 6. 첫 대화인 경우 제목 생성
          if (chatHistory.length <= 1) {
            try {
              const titlePrompt = `다음 대화의 첫 메시지를 보고 10자 이내의 간단한 제목을 만들어주세요. 제목만 출력하세요.\n\n메시지: ${message}`
              const title = await generateShortResponse(titlePrompt)

              await supabase
                .from('chat_sessions')
                .update({ title: title.slice(0, 20) })
                .eq('id', chatSessionId)

              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ title })}\n\n`))
            } catch {
              // 제목 생성 실패는 무시
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch (error) {
          console.error('Streaming error:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
