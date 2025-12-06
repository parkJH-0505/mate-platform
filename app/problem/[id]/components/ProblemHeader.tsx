'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface ProblemHeaderProps {
  title: string
  progress: number
  expectedOutcome: string
  totalMinutes: number
  icon: string
}

export const ProblemHeader: React.FC<ProblemHeaderProps> = ({
  title,
  progress,
  expectedOutcome,
  totalMinutes,
  icon
}) => {
  const router = useRouter()

  const handleBack = () => {
    router.push('/dashboard')
  }

  return (
    <div className="space-y-6">
      {/* 상단 네비게이션 */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">대시보드</span>
        </button>

        <span className="text-2xl font-bold text-primary">MATE</span>

        <div className="w-20" /> {/* 균형을 위한 빈 공간 */}
      </div>

      {/* 문제 정보 카드 */}
      <div className="
        p-6 rounded-2xl
        bg-gradient-to-br from-primary/10 to-transparent
        border border-primary/20
      ">
        {/* 아이콘과 제목 */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-2xl flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white mb-1">{title}</h1>
            <p className="text-sm text-white/60">{expectedOutcome}</p>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">전체 진행률</span>
            <span className="text-sm font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 예상 시간 */}
        <div className="flex items-center gap-2 text-sm text-white/50">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>예상 소요 시간: {Math.floor(totalMinutes / 60)}시간 {totalMinutes % 60 > 0 ? `${totalMinutes % 60}분` : ''}</span>
        </div>
      </div>
    </div>
  )
}
