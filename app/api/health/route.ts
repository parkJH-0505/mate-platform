import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const checks: Record<string, { status: 'ok' | 'error' | 'missing'; message?: string }> = {}

  // 1. Supabase URL 확인
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    checks.supabaseUrl = { status: 'ok' }
  } else {
    checks.supabaseUrl = { status: 'missing', message: 'NEXT_PUBLIC_SUPABASE_URL not set' }
  }

  // 2. Supabase Anon Key 확인
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    checks.supabaseAnonKey = { status: 'ok' }
  } else {
    checks.supabaseAnonKey = { status: 'missing', message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY not set' }
  }

  // 3. OpenAI API Key 확인
  if (process.env.OPENAI_API_KEY) {
    checks.openaiApiKey = { status: 'ok' }
  } else {
    checks.openaiApiKey = { status: 'missing', message: 'OPENAI_API_KEY not set - 커리큘럼 생성 불가' }
  }

  // 4. Supabase 연결 테스트
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('curriculums').select('id').limit(1)

    if (error) {
      // RLS 에러는 괜찮음 (테이블은 존재함)
      if (error.code === 'PGRST301' || error.message.includes('permission denied')) {
        checks.supabaseConnection = { status: 'ok', message: 'Connected (RLS active)' }
      } else if (error.code === '42P01') {
        checks.supabaseConnection = { status: 'error', message: 'curriculums 테이블 없음 - 마이그레이션 필요' }
      } else {
        checks.supabaseConnection = { status: 'error', message: error.message }
      }
    } else {
      checks.supabaseConnection = { status: 'ok' }
    }
  } catch (err) {
    checks.supabaseConnection = {
      status: 'error',
      message: err instanceof Error ? err.message : 'Connection failed'
    }
  }

  // 5. Stripe 설정 확인 (선택사항)
  if (process.env.STRIPE_SECRET_KEY) {
    checks.stripeSecretKey = { status: 'ok' }
  } else {
    checks.stripeSecretKey = { status: 'missing', message: 'STRIPE_SECRET_KEY not set (결제 기능 비활성화)' }
  }

  // 전체 상태 계산
  const hasErrors = Object.values(checks).some(
    c => c.status === 'error' || (c.status === 'missing' && !c.message?.includes('선택'))
  )
  const hasCriticalMissing = !process.env.OPENAI_API_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL

  return NextResponse.json({
    status: hasCriticalMissing ? 'unhealthy' : hasErrors ? 'degraded' : 'healthy',
    timestamp: new Date().toISOString(),
    checks,
    requiredActions: hasCriticalMissing ? [
      !process.env.OPENAI_API_KEY && 'Vercel에 OPENAI_API_KEY 환경 변수 설정 필요',
      !process.env.NEXT_PUBLIC_SUPABASE_URL && 'Vercel에 NEXT_PUBLIC_SUPABASE_URL 환경 변수 설정 필요',
    ].filter(Boolean) : []
  })
}
