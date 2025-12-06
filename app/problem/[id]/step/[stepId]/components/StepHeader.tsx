'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface StepHeaderProps {
  problemId: string
  stepOrder: number
  totalSteps: number
  title: string
  estimatedMinutes: number
  icon: string
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  problemId,
  stepOrder,
  totalSteps,
  title,
  estimatedMinutes,
  icon
}) => {
  const router = useRouter()

  const handleBack = () => {
    router.push(`/problem/${problemId}`)
  }

  return (
    <div className="space-y-4">
      {/* 상단 네비게이션 */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">단계 목록</span>
        </button>

        {/* 스텝 인디케이터 */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`
                w-2 h-2 rounded-full transition-colors
                ${index + 1 <= stepOrder ? 'bg-primary' : 'bg-white/20'}
              `}
            />
          ))}
        </div>

        <div className="w-16" /> {/* 균형을 위한 빈 공간 */}
      </div>

      {/* 단계 정보 */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-xl flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary">
              Step {stepOrder} / {totalSteps}
            </span>
            <span className="text-xs text-white/30">•</span>
            <span className="text-xs text-white/40">{estimatedMinutes}분</span>
          </div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
      </div>
    </div>
  )
}
