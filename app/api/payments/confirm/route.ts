import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { paymentKey, orderId, amount, planType = 'monthly' } = body

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      )
    }

    // 토스페이먼츠 결제 승인 API 호출
    const confirmResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    })

    const paymentResult = await confirmResponse.json()

    if (!confirmResponse.ok) {
      console.error('Toss payment confirm failed:', paymentResult)
      return NextResponse.json(
        { error: paymentResult.message || '결제 승인에 실패했습니다' },
        { status: 400 }
      )
    }

    // 구독 기간 계산
    const now = new Date()
    const periodEnd = new Date(now)
    if (planType === 'yearly') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    }

    // 구독 정보 저장
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_type: planType,
        status: 'active',
        payment_key: paymentKey,
        customer_key: `customer_${user.id.replace(/-/g, '').slice(0, 20)}`,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        amount,
      })
      .select()
      .single()

    if (subscriptionError) {
      console.error('Error saving subscription:', subscriptionError)
      return NextResponse.json(
        { error: '구독 정보 저장에 실패했습니다' },
        { status: 500 }
      )
    }

    // 결제 이력 저장
    await supabase
      .from('payment_history')
      .insert({
        subscription_id: subscription.id,
        user_id: user.id,
        payment_key: paymentKey,
        order_id: orderId,
        amount,
        status: 'DONE',
        method: paymentResult.method,
        card_company: paymentResult.card?.company,
        card_number: paymentResult.card?.number,
        paid_at: paymentResult.approvedAt,
      })

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        planType: subscription.plan_type,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
      }
    })

  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: '결제 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
