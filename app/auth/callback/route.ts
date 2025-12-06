import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = requestUrl.searchParams.get('redirect') || '/curriculum'
  const sessionId = requestUrl.searchParams.get('sessionId')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()

    // OAuth 코드를 세션으로 교환
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // 사용자 정보를 users 테이블에 저장/업데이트
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.full_name || data.user.user_metadata.name,
          profile_image: data.user.user_metadata.avatar_url || data.user.user_metadata.picture,
          last_login_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
          ignoreDuplicates: false,
        })

      if (upsertError) {
        console.error('Failed to upsert user:', upsertError)
      }

      // 익명 세션 데이터 마이그레이션
      if (sessionId) {
        try {
          const { data: sessionData } = await supabase
            .from('anonymous_sessions')
            .select('*')
            .eq('session_id', sessionId)
            .single()

          if (sessionData && sessionData.onboarding_industry) {
            // 온보딩 데이터 마이그레이션
            await supabase
              .from('users')
              .update({
                onboarding_industry: sessionData.onboarding_industry,
                onboarding_stage: sessionData.onboarding_stage,
                onboarding_concerns: sessionData.onboarding_concerns,
                onboarding_goal: sessionData.onboarding_goal,
                name: sessionData.onboarding_name || data.user.user_metadata.full_name,
                onboarding_completed_at: new Date().toISOString(),
              })
              .eq('id', data.user.id)

            // 익명 세션 삭제
            await supabase
              .from('anonymous_sessions')
              .delete()
              .eq('session_id', sessionId)
          }
        } catch (migrationError) {
          console.error('Failed to migrate session data:', migrationError)
        }
      }

      // 리다이렉트
      return NextResponse.redirect(`${origin}${redirect}`)
    }
  }

  // 에러 시 로그인 페이지로
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
