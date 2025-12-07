import { createClient } from '@/lib/supabase/server'
import { getOpenAI } from '@/lib/openai'
import {
  CURRICULUM_SYSTEM_PROMPT,
  generateCurriculumPrompt,
  GeneratedCurriculum
} from '@/lib/prompts/curriculum'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // OpenAI API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      return NextResponse.json(
        { error: 'OpenAI API key not configured', code: 'OPENAI_NOT_CONFIGURED' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { industry, stage, concerns, goal, userName, sessionId } = body

    // 필수 필드 검증
    if (!industry || !stage || !goal) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'MISSING_FIELDS' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 현재 사용자 확인
    const { data: { user } } = await supabase.auth.getUser()

    // OpenAI API 호출
    let openai
    try {
      openai = getOpenAI()
    } catch (err) {
      console.error('Failed to initialize OpenAI:', err)
      return NextResponse.json(
        { error: 'Failed to initialize AI service', code: 'OPENAI_INIT_FAILED' },
        { status: 500 }
      )
    }
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: CURRICULUM_SYSTEM_PROMPT },
        {
          role: 'user',
          content: generateCurriculumPrompt({
            industry,
            stage,
            concerns: concerns || [],
            goal,
            userName
          })
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0].message.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    const curriculum: GeneratedCurriculum = JSON.parse(responseText)

    // DB에 커리큘럼 저장
    const { data: curriculumData, error: curriculumError } = await supabase
      .from('curriculums')
      .insert({
        user_id: user?.id || null,
        session_id: user ? null : sessionId,
        industry,
        stage,
        concerns,
        goal,
        user_name: userName,
        title: curriculum.title,
        description: curriculum.description,
        reasoning: curriculum.reasoning,
        duration_weeks: curriculum.modules.length
      })
      .select()
      .single()

    if (curriculumError) {
      console.error('Failed to save curriculum:', curriculumError)
      throw curriculumError
    }

    // 모듈 저장
    for (let i = 0; i < curriculum.modules.length; i++) {
      const module = curriculum.modules[i]

      const { data: moduleData, error: moduleError } = await supabase
        .from('curriculum_modules')
        .insert({
          curriculum_id: curriculumData.id,
          week_number: module.week,
          title: module.title,
          description: module.description,
          order_index: i
        })
        .select()
        .single()

      if (moduleError) {
        console.error('Failed to save module:', moduleError)
        continue
      }

      // 콘텐츠 저장
      for (let j = 0; j < module.contents.length; j++) {
        const content = module.contents[j]

        await supabase
          .from('curriculum_contents')
          .insert({
            module_id: moduleData.id,
            title: content.title,
            creator: content.creator,
            duration: content.duration,
            content_type: content.type,
            order_index: j
          })
      }
    }

    return NextResponse.json({
      success: true,
      curriculum: {
        id: curriculumData.id,
        ...curriculum,
        industry,
        stage,
        goal,
        userName
      }
    })

  } catch (error: any) {
    console.error('Curriculum generation error:', error)

    // OpenAI API 에러
    if (error?.status === 401 || error?.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key', code: 'OPENAI_INVALID_KEY' },
        { status: 500 }
      )
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again later.', code: 'RATE_LIMIT' },
        { status: 429 }
      )
    }

    // Supabase 에러
    if (error?.code === '42P01') {
      return NextResponse.json(
        { error: 'Database table not found. Migration needed.', code: 'DB_TABLE_MISSING' },
        { status: 500 }
      )
    }

    if (error?.code === '42501') {
      return NextResponse.json(
        { error: 'Database permission denied. Check RLS policies.', code: 'DB_PERMISSION_DENIED' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to generate curriculum',
        code: 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}
