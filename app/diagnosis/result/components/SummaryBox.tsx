'use client'

import React from 'react'
import type { SolutionStep } from '../data/resultData'

interface SummaryBoxProps {
  steps: SolutionStep[]
  nextStepCTA: string
  onStartClick: () => void
}

export const SummaryBox: React.FC<SummaryBoxProps> = ({
  steps,
  nextStepCTA,
  onStartClick
}) => {
  // 총 예상 시간 계산 (간단한 파싱)
  const totalTime = steps.reduce((acc, step) => {
    const timeStr = step.estimatedTime.toLowerCase()
    if (timeStr.includes('시간')) {
      const hours = parseFloat(timeStr) || 1
      return acc + hours * 60
    }
    if (timeStr.includes('분')) {
      return acc + (parseFloat(timeStr) || 30)
    }
    return acc + 30 // 기본값
  }, 0)

  const formatTotalTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}분`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`
  }

  const totalActionItems = steps.reduce((acc, step) => acc + step.actionItems.length, 0)

  return (
    <div className="
      sticky bottom-6 mx-4 p-6 rounded-2xl
      bg-[#121212]/95 backdrop-blur-xl
      border border-white/[0.1]
      shadow-[0_-10px_40px_rgba(0,0,0,0.5)]
    ">
      {/* Stats */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm">📋</span>
            </div>
            <div>
              <p className="text-xs text-white/40">단계</p>
              <p className="font-semibold text-white">{steps.length}개</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm">✓</span>
            </div>
            <div>
              <p className="text-xs text-white/40">실행 항목</p>
              <p className="font-semibold text-white">{totalActionItems}개</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm">⏱</span>
            </div>
            <div>
              <p className="text-xs text-white/40">예상 시간</p>
              <p className="font-semibold text-white">{formatTotalTime(totalTime)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onStartClick}
        className="
          w-full py-4 rounded-xl font-semibold
          bg-primary hover:bg-primary/90
          text-white
          transition-all duration-300
          hover:shadow-[0_0_30px_rgba(234,73,46,0.3)]
          active:scale-[0.98]
        "
      >
        {nextStepCTA}
      </button>

      {/* Secondary Actions */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          공유하기
        </button>
        <button className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          PDF 저장
        </button>
      </div>
    </div>
  )
}
