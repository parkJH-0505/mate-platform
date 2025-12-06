'use client'

import React from 'react'
import { ProblemProgress } from '@/app/data/statusData'
import { ProblemProgressCard } from './ProblemProgressCard'

interface ProblemProgressListProps {
  problems: ProblemProgress[]
}

export const ProblemProgressList: React.FC<ProblemProgressListProps> = ({ problems }) => {
  const inProgress = problems.filter(p => p.status === 'in_progress')
  const completed = problems.filter(p => p.status === 'completed')
  const locked = problems.filter(p => p.status === 'locked')

  if (problems.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* 진행 중인 문제 */}
      {inProgress.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white/80">진행 중인 문제</h3>
            <span className="text-xs text-primary">{inProgress.length}개</span>
          </div>
          <div className="space-y-3">
            {inProgress.map(problem => (
              <ProblemProgressCard key={problem.problemId} problem={problem} />
            ))}
          </div>
        </div>
      )}

      {/* 완료한 문제 */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white/80">완료한 문제</h3>
            <span className="text-xs text-green-500">{completed.length}개</span>
          </div>
          <div className="space-y-3">
            {completed.map(problem => (
              <ProblemProgressCard key={problem.problemId} problem={problem} />
            ))}
          </div>
        </div>
      )}

      {/* 잠금된 문제 */}
      {locked.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/50">다음 도전</h3>
          <div className="space-y-3">
            {locked.slice(0, 2).map(problem => (
              <ProblemProgressCard key={problem.problemId} problem={problem} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
