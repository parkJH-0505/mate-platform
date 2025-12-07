import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 콘텐츠 저장
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await params
    const supabase = await createClient()
    const body = await request.json()
    const { sessionId, folder, notes } = body

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
      content_id: contentId,
      folder: folder || 'default',
      notes
    }

    if (user) {
      insertData.user_id = user.id
    } else {
      insertData.session_id = sessionId
    }

    const { data, error } = await supabase
      .from('user_saved_contents')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      // 이미 저장된 경우
      if (error.code === '23505') {
        return NextResponse.json({ success: true, alreadySaved: true })
      }
      console.error('Error saving content:', error)
      return NextResponse.json(
        { error: 'Failed to save content', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, saved: data })
  } catch (error: any) {
    console.error('Error in save API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}

// 콘텐츠 저장 취소
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
      .from('user_saved_contents')
      .delete()
      .eq('content_id', contentId)

    if (user) {
      query = query.eq('user_id', user.id)
    } else {
      query = query.eq('session_id', sessionId)
    }

    const { error } = await query

    if (error) {
      console.error('Error unsaving content:', error)
      return NextResponse.json(
        { error: 'Failed to unsave content', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in unsave API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}

// 저장 상태 확인
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
      return NextResponse.json({ saved: false })
    }

    let query = supabase
      .from('user_saved_contents')
      .select('id')
      .eq('content_id', contentId)

    if (user) {
      query = query.eq('user_id', user.id)
    } else {
      query = query.eq('session_id', sessionId)
    }

    const { data } = await query.maybeSingle()

    return NextResponse.json({ saved: !!data })
  } catch (error: any) {
    console.error('Error checking save status:', error)
    return NextResponse.json({ saved: false })
  }
}
