'use client'

import React from 'react'

interface StatsSectionProps {
  solvedProblems: number
  completedActions: number
  savedHours: number
}

interface StatCardProps {
  icon: string
  value: string | number
  label: string
  suffix?: string
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, suffix }) => (
  <div className="
    p-4 rounded-xl
    bg-white/[0.02] border border-white/[0.04]
    text-center
  ">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-2xl sm:text-3xl font-bold text-white">
      {value}
      {suffix && <span className="text-lg text-white/50">{suffix}</span>}
    </div>
    <div className="text-xs text-white/40 mt-1">{label}</div>
  </div>
)

export const StatsSection: React.FC<StatsSectionProps> = ({
  solvedProblems,
  completedActions,
  savedHours
}) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📊</span>
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">
          지금까지
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon="🎯"
          value={solvedProblems}
          label="해결한 문제"
          suffix="개"
        />
        <StatCard
          icon="✓"
          value={completedActions}
          label="완료한 실행"
          suffix="개"
        />
        <StatCard
          icon="⏱"
          value={savedHours}
          label="절약한 시간"
          suffix="시간"
        />
      </div>
    </section>
  )
}
