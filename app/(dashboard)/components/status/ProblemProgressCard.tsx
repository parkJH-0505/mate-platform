'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ProblemProgress, formatMinutes } from '@/app/data/statusData'

interface ProblemProgressCardProps {
  problem: ProblemProgress
}

export const ProblemProgressCard: React.FC<ProblemProgressCardProps> = ({ problem }) => {
  const router = useRouter()

  const handleContinue = () => {
    router.push(`/problem/${problem.problemId}`)
  }

  // 진행 중
  if (problem.status === 'in_progress') {
    return (
      <div className="
        p-4 rounded-xl
        bg-gradient-to-br from-primary/10 to-transparent
        border border-primary/20
      ">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl">
              {problem.problemIcon}
            </div>
            <div>
              <h3 className="font-medium text-white">{problem.problemTitle}</h3>
              <p className="text-xs text-white/50">
                Step {problem.completedSteps}/{problem.totalSteps} 진행 중
              </p>
            </div>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-white/50 mb-1">
            <span>진행률</span>
            <span>{problem.progressPercent}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${problem.progressPercent}%` }}
            />
          </div>
        </div>

        {/* 이어하기 버튼 */}
        <button
          onClick={handleContinue}
          className="
            w-full py-2.5 rounded-lg
            bg-primary text-black font-medium text-sm
            hover:bg-primary/90 transition-colors
            flex items-center justify-center gap-2
          "
        >
          이어하기
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )
  }

  // 완료됨
  if (problem.status === 'completed') {
    const completedDate = problem.completedAt
      ? new Date(problem.completedAt).toLocaleDateString('ko-KR', {
          month: 'short',
          day: 'numeric'
        })
      : ''

    return (
      <div className="
        p-4 rounded-xl
        bg-white/[0.03] border border-white/[0.06]
      ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-xl">
              ✅
            </div>
            <div>
              <h3 className="font-medium text-white/80">{problem.problemTitle}</h3>
              <p className="text-xs text-white/40">
                {problem.totalSteps}단계 모두 완료
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-green-500">{completedDate} 완료</p>
          </div>
        </div>
      </div>
    )
  }

  // 잠금 상태
  return (
    <div className="
      p-4 rounded-xl
      bg-white/[0.02] border border-white/[0.04]
      opacity-60
    ">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
          🔒
        </div>
        <div>
          <h3 className="font-medium text-white/50">{problem.problemTitle}</h3>
          <p className="text-xs text-white/30">
            이전 문제 완료 후 해금됩니다
          </p>
        </div>
      </div>
    </div>
  )
}
