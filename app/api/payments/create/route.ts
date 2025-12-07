import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

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
    const { planType = 'monthly' } = body

    // 이미 구독 중인지 확인
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (existingSubscription) {
      return NextResponse.json(
        { error: '이미 구독 중입니다' },
        { status: 400 }
      )
    }

    // 주문 정보 생성
    const orderId = `order_${uuidv4().replace(/-/g, '').slice(0, 20)}`
    const customerKey = `customer_${user.id.replace(/-/g, '').slice(0, 20)}`

    const amount = planType === 'yearly' ? 170000 : 17000
    const orderName = planType === 'yearly'
      ? 'MATE 프리미엄 연간 구독'
      : 'MATE 프리미엄 월간 구독'

    return NextResponse.json({
      success: true,
      orderId,
      amount,
      orderName,
      customerKey,
      planType,
      customerEmail: user.email,
      customerName: user.user_metadata?.name || user.email?.split('@')[0] || '고객'
    })

  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: '결제 생성에 실패했습니다' },
      { status: 500 }
    )
  }
}
