'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlanItem } from './PlanItem'
import { PlanProgress } from './PlanProgress'

interface PlanItemData {
  id: string
  type: 'content' | 'action'
  title: string
  duration?: string
  status: 'pending' | 'completed'
  actionType?: string
  order: number
}

interface TodaysPlanData {
  id: string
  items: PlanItemData[]
  estimated_minutes: number
  progress: number
  completedCount: number
  totalCount: number
  status: 'active' | 'completed' | 'skipped'
}

interface Props {
  sessionId?: string
}

export function TodaysPlanCard({ sessionId }: Props) {
  const [plan, setPlan] = useState<TodaysPlanData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTodaysPlan = useCallback(async () => {
    try {
      setError(null)
      const params = new URLSearchParams()
      if (sessionId) params.set('sessionId', sessionId)

      const response = await fetch(`/api/plans/today?${params}`)
      const data = await response.json()

      if (data.success) {
        setPlan(data.plan)
      } else {
        setError(data.error || 'Failed to load plan')
      }
    } catch (err) {
      console.error('Failed to fetch plan:', err)
      setError('플랜을 불러오는데 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    fetchTodaysPlan()
  }, [fetchTodaysPlan])

  const handleItemComplete = async (itemId: string, itemType: string) => {
    if (!plan) return

    try {
      const response = await fetch(`/api/plans/${plan.id}/items`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          itemType,
          status: 'completed',
          sessionId
        })
      })

      const data = await response.json()

      if (data.success) {
        setPlan(data.plan)
      }
    } catch (err) {
      console.error('Failed to update item:', err)
    }
  }

  if (isLoading) {
    return <TodaysPlanSkeleton />
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-center">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={fetchTodaysPlan}
          className="mt-2 text-xs text-red-300 underline"
        >
          다시 시도
        </button>
      </div>
    )
  }

  if (!plan || plan.items.length === 0) {
    return <TodaysPlanEmpty />
  }

  const isCompleted = plan.status === 'completed' || plan.progress === 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden rounded-2xl p-5 border
        ${isCompleted
          ? 'bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/20'
          : 'bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border-white/[0.06]'
        }
      `}
    >
      {/* 완료 배경 효과 */}
      {isCompleted && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.1),transparent_50%)]" />
      )}

      {/* 헤더 */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${isCompleted ? 'bg-green-500/20' : 'bg-accent-purple/20'}
          `}>
            <span className="text-xl">{isCompleted ? '✅' : '📋'}</span>
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              오늘의 플랜
              {isCompleted && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                  완료!
                </span>
              )}
            </h3>
            <p className="text-xs text-white/50">
              약 {plan.estimated_minutes}분
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-2xl font-bold ${isCompleted ? 'text-green-400' : 'text-accent-purple'}`}>
            {plan.progress}%
          </span>
          <p className="text-xs text-white/40">
            {plan.completedCount}/{plan.totalCount} 완료
          </p>
        </div>
      </div>

      {/* 진행률 바 */}
      <PlanProgress progress={plan.progress} isCompleted={isCompleted} />

      {/* 아이템 목록 */}
      <div className="relative mt-4 space-y-2">
        <AnimatePresence>
          {plan.items
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <PlanItem
                key={item.id}
                item={item}
                index={index}
                onComplete={() => handleItemComplete(item.id, item.type)}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* 완료 메시지 */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center"
          >
            <span className="text-green-400 font-medium">
              오늘 플랜 완료! 수고했어요 🎉
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function TodaysPlanSkeleton() {
  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl p-5 border border-white/[0.06] animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05]" />
          <div>
            <div className="h-4 w-24 bg-white/[0.05] rounded mb-1" />
            <div className="h-3 w-16 bg-white/[0.05] rounded" />
          </div>
        </div>
        <div className="text-right">
          <div className="h-6 w-12 bg-white/[0.05] rounded mb-1" />
          <div className="h-3 w-16 bg-white/[0.05] rounded" />
        </div>
      </div>
      <div className="h-2 bg-white/[0.05] rounded-full mb-4" />
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-14 bg-white/[0.03] rounded-xl" />
        ))}
      </div>
    </div>
  )
}

function TodaysPlanEmpty() {
  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl p-6 border border-white/[0.06] text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/[0.05] flex items-center justify-center">
        <span className="text-2xl">📋</span>
      </div>
      <h3 className="font-semibold text-white mb-1">오늘의 플랜</h3>
      <p className="text-sm text-white/50 mb-4">
        아직 커리큘럼이 없어요.<br />
        먼저 학습 로드맵을 만들어보세요!
      </p>
      <a
        href="/diagnosis"
        className="inline-block px-4 py-2 bg-accent-purple/20 text-accent-purple rounded-lg text-sm font-medium hover:bg-accent-purple/30 transition-colors"
      >
        로드맵 만들기
      </a>
    </div>
  )
}
