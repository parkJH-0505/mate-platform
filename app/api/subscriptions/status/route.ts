import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({
        success: true,
        isSubscribed: false,
        subscription: null
      })
    }

    // 활성 구독 조회
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (error || !subscription) {
      return NextResponse.json({
        success: true,
        isSubscribed: false,
        subscription: null
      })
    }

    // 구독 기간 만료 확인
    const now = new Date()
    const periodEnd = new Date(subscription.current_period_end)

    if (now > periodEnd) {
      // 구독 만료 처리
      await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('id', subscription.id)

      return NextResponse.json({
        success: true,
        isSubscribed: false,
        subscription: null
      })
    }

    return NextResponse.json({
      success: true,
      isSubscribed: true,
      subscription: {
        id: subscription.id,
        planType: subscription.plan_type,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        canceledAt: subscription.canceled_at
      }
    })

  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json(
      { error: '구독 상태 확인에 실패했습니다' },
      { status: 500 }
    )
  }
}
