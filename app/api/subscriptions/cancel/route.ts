import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    // 활성 구독 조회
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (fetchError || !subscription) {
      return NextResponse.json(
        { error: '활성화된 구독이 없습니다' },
        { status: 400 }
      )
    }

    // 구독 상태를 canceled로 변경
    // 현재 기간이 끝날 때까지는 계속 이용 가능
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString()
      })
      .eq('id', subscription.id)

    if (updateError) {
      console.error('Error canceling subscription:', updateError)
      return NextResponse.json(
        { error: '구독 취소에 실패했습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '구독이 취소되었습니다',
      subscription: {
        id: subscription.id,
        status: 'canceled',
        currentPeriodEnd: subscription.current_period_end,
        canceledAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json(
      { error: '구독 취소 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
