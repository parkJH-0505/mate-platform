import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 콘텐츠 좋아요
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await params
    const supabase = await createClient()
    const body = await request.json()
    const { sessionId } = body

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 콘텐츠 존재 확인
    const { data: content } = await supabase
      .from('curriculum_contents')
      .select('id')
      .eq('id', contentId)
      .single()

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    const insertData: any = {
      content_id: contentId
    }

    if (user) {
      insertData.user_id = user.id
    } else {
      insertData.session_id = sessionId
    }

    const { data, error } = await supabase
      .from('user_content_likes')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      // 이미 좋아요한 경우
      if (error.code === '23505') {
        return NextResponse.json({ success: true, alreadyLiked: true })
      }
      console.error('Error liking content:', error)
      return NextResponse.json(
        { error: 'Failed to like content', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, liked: data })
  } catch (error: any) {
    console.error('Error in like API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}

// 콘텐츠 좋아요 취소
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = supabase
      .from('user_content_likes')
      .delete()
      .eq('content_id', contentId)

    if (user) {
      query = query.eq('user_id', user.id)
    } else {
      query = query.eq('session_id', sessionId)
    }

    const { error } = await query

    if (error) {
      console.error('Error unliking content:', error)
      return NextResponse.json(
        { error: 'Failed to unlike content', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in unlike API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}

// 좋아요 상태 확인
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !sessionId) {
      return NextResponse.json({ liked: false })
    }

    let query = supabase
      .from('user_content_likes')
      .select('id')
      .eq('content_id', contentId)

    if (user) {
      query = query.eq('user_id', user.id)
    } else {
      query = query.eq('session_id', sessionId)
    }

    const { data } = await query.maybeSingle()

    return NextResponse.json({ liked: !!data })
  } catch (error: any) {
    console.error('Error checking like status:', error)
    return NextResponse.json({ liked: false })
  }
}
