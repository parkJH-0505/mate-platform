import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface PlanItem {
  type: 'content' | 'action'
  id: string
  order: number
  status: 'pending' | 'completed'
  title: string
  duration?: string
  actionType?: string
}

// 플랜 아이템 상태 업데이트
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: planId } = await params
    const supabase = await createClient()
    const body = await request.json()
    const { itemId, itemType, status } = body

    const { data: { user } } = await supabase.auth.getUser()
    const sessionId = body.sessionId

    if (!user && !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 현재 플랜 조회
    let query = supabase
      .from('daily_plans')
      .select('*')
      .eq('id', planId)

    if (user) {
      query = query.eq('user_id', user.id)
    } else {
      query = query.eq('session_id', sessionId)
    }

    const { data: plan, error: fetchError } = await query.single()

    if (fetchError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // 아이템 상태 업데이트
    const items = plan.items as PlanItem[]
    const updatedItems = items.map(item => {
      if (item.id === itemId && item.type === itemType) {
        return { ...item, status }
      }
      return item
    })

    // 진행률 계산
    const completedCount = updatedItems.filter(item => item.status === 'completed').length
    const progress = Math.round((completedCount / updatedItems.length) * 100)
    const isAllCompleted = completedCount === updatedItems.length

    // 플랜 업데이트
    const updateData: any = {
      items: updatedItems,
      updated_at: new Date().toISOString()
    }

    if (isAllCompleted) {
      updateData.status = 'completed'
      updateData.completed_at = new Date().toISOString()
    }

    const { data: updatedPlan, error: updateError } = await supabase
      .from('daily_plans')
      .update(updateData)
      .eq('id', planId)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // 콘텐츠 완료 시 성장 로그 기록
    if (status === 'completed' && itemType === 'content') {
      const completedItem = items.find(item => item.id === itemId)
      if (completedItem) {
        await supabase.from('growth_logs').insert({
          user_id: user?.id,
          session_id: user ? null : sessionId,
          log_type: 'content_completed',
          reference_id: itemId,
          reference_type: 'content',
          title: completedItem.title,
          icon: '📚',
          metadata: { duration: completedItem.duration }
        })
      }
    }

    return NextResponse.json({
      success: true,
      plan: {
        ...updatedPlan,
        progress,
        completedCount,
        totalCount: updatedItems.length
      }
    })
  } catch (error: any) {
    console.error('Error updating plan item:', error)
    return NextResponse.json(
      { error: 'Failed to update plan item', details: error?.message },
      { status: 500 }
    )
  }
}
