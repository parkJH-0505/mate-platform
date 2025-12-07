'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ActivityChart } from './ActivityChart'

interface DailyActivity {
  date: string
  count: number
}

interface ActivityStats {
  period: string
  activeDays: number
  totalDays: number
  activeRate: number
  contentsCompleted: number
  actionsCompleted: number
  totalActivities: number
  dailyActivity: DailyActivity[]
}

interface Props {
  sessionId?: string
}

export function RecentActivity({ sessionId }: Props) {
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [insights, setInsights] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchActivity()
  }, [sessionId])

  const fetchActivity = async () => {
    try {
      const params = new URLSearchParams()
      if (sessionId) params.set('sessionId', sessionId)
      params.set('days', '7')

      const response = await fetch(`/api/feed/activity?${params}`)
      const data = await response.json()

      if (data.success) {
        setStats(data.activity)
        setInsights(data.insights || [])
      }
    } catch (err) {
      console.error('Failed to fetch activity:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <ActivitySkeleton />
  }

  if (!stats) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl p-5 border border-white/[0.06]"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">나의 최근 7일</h3>
            <p className="text-xs text-white/50">성장 기록 요약</p>
          </div>
        </div>

        <Link
          href="/status"
          className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          전체 기록 →
        </Link>
      </div>

      {/* 활동 차트 */}
      <ActivityChart data={stats.dailyActivity} />

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="text-center p-3 rounded-xl bg-white/[0.03]">
          <div className="text-xl font-bold text-white">{stats.activeDays}</div>
          <div className="text-xs text-white/50">활동 일수</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/[0.03]">
          <div className="text-xl font-bold text-blue-400">{stats.contentsCompleted}</div>
          <div className="text-xs text-white/50">완료 콘텐츠</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/[0.03]">
          <div className="text-xl font-bold text-purple-400">{stats.actionsCompleted}</div>
          <div className="text-xs text-white/50">완료 미션</div>
        </div>
      </div>

      {/* 인사이트 */}
      {insights.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-sm text-purple-300">
            {getInsightEmoji(insights[0])} {insights[0]}
          </p>
        </div>
      )}
    </motion.div>
  )
}

function getInsightEmoji(insight: string): string {
  if (insight.includes('잘')) return '🔥'
  if (insight.includes('힘내')) return '💪'
  if (insight.includes('다시')) return '🌱'
  if (insight.includes('첫')) return '👋'
  if (insight.includes('미션')) return '✅'
  if (insight.includes('학습')) return '📚'
  if (insight.includes('연속')) return '🎯'
  return '💡'
}

function ActivitySkeleton() {
  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-white/[0.06]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.05] animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-white/[0.05] rounded animate-pulse" />
          <div className="h-3 w-32 bg-white/[0.05] rounded animate-pulse" />
        </div>
      </div>
      <div className="h-16 bg-white/[0.03] rounded-xl animate-pulse mb-4" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
