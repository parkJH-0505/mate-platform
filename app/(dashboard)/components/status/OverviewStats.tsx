'use client'

import React from 'react'
import { OverallStats, formatMinutes } from '@/app/data/statusData'

interface StatCardProps {
  icon: string
  value: string | number
  label: string
  highlight?: boolean
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, highlight }) => (
  <div className={`
    p-4 rounded-xl text-center
    ${highlight
      ? 'bg-primary/10 border border-primary/20'
      : 'bg-white/[0.03] border border-white/[0.06]'
    }
  `}>
    <div className="text-2xl mb-1">{icon}</div>
    <div className={`text-2xl font-bold ${highlight ? 'text-primary' : 'text-white'}`}>
      {value}
    </div>
    <div className="text-xs text-white/50 mt-1">{label}</div>
  </div>
)

interface StreakProgressProps {
  currentStreak: number
  targetStreak?: number
}

const StreakProgress: React.FC<StreakProgressProps> = ({
  currentStreak,
  targetStreak = 7
}) => {
  const progress = Math.min((currentStreak / targetStreak) * 100, 100)
  const remaining = targetStreak - currentStreak

  if (currentStreak === 0) {
    return (
      <div className="
        p-4 rounded-xl
        bg-white/[0.03] border border-white/[0.06]
      ">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🔥</span>
          <span className="text-sm text-white/60">오늘 첫 학습을 시작해보세요!</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-0 bg-orange-500 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="
      p-4 rounded-xl
      bg-gradient-to-r from-orange-500/10 to-red-500/10
      border border-orange-500/20
    ">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <span className="text-sm font-medium text-white">
            {currentStreak}일 연속 학습 중!
          </span>
        </div>
        {remaining > 0 && (
          <span className="text-xs text-white/50">
            {targetStreak}일까지 {remaining}일!
          </span>
        )}
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {currentStreak >= targetStreak && (
        <p className="text-xs text-orange-400 mt-2">
          축하해요! {targetStreak}일 연속 달성!
        </p>
      )}
    </div>
  )
}

interface OverviewStatsProps {
  stats: OverallStats | null
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">나의 진행 현황</h2>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] animate-pulse">
              <div className="h-8 bg-white/10 rounded mb-2" />
              <div className="h-4 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const timeDisplay = stats.estimatedMinutes > 0
    ? formatMinutes(stats.estimatedMinutes)
    : '0분'

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">나의 진행 현황</h2>

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon="🎯"
          value={stats.totalProblemsCompleted}
          label="문제 해결"
        />
        <StatCard
          icon="✅"
          value={stats.totalStepsCompleted}
          label="단계 완료"
        />
        <StatCard
          icon="⏱️"
          value={timeDisplay}
          label="학습 시간"
        />
      </div>

      {/* 스트릭 프로그레스 */}
      <StreakProgress currentStreak={stats.currentStreak} />
    </div>
  )
}
