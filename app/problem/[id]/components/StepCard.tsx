'use client'

import React from 'react'

type StepStatus = 'locked' | 'available' | 'in_progress' | 'completed'

interface StepCardProps {
  id: string
  order: number
  title: string
  description: string
  estimatedMinutes: number
  icon: string
  status: StepStatus
  progress: number  // 0-100
  onClick: () => void
}

export const StepCard: React.FC<StepCardProps> = ({
  order,
  title,
  description,
  estimatedMinutes,
  icon,
  status,
  progress,
  onClick
}) => {
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'
  const isActive = status === 'in_progress' || status === 'available'

  const getStatusBadge = () => {
    switch (status) {
      case 'locked':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/30">
            잠김
          </span>
        )
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">
            완료
          </span>
        )
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
            진행 중
          </span>
        )
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/60">
            시작 가능
          </span>
        )
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`
        w-full p-5 rounded-2xl text-left transition-all duration-300
        ${isLocked
          ? 'bg-white/[0.02] border border-white/[0.03] opacity-50 cursor-not-allowed'
          : isCompleted
            ? 'bg-white/[0.03] border border-green-500/20 hover:border-green-500/30'
            : isActive
              ? 'bg-white/[0.05] border border-primary/30 hover:border-primary/50 hover:bg-white/[0.08]'
              : 'bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12]'
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* 아이콘 / 순서 */}
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl
          ${isLocked
            ? 'bg-white/5'
            : isCompleted
              ? 'bg-green-500/20'
              : 'bg-primary/20'
          }
        `}>
          {isLocked ? (
            <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ) : isCompleted ? (
            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            icon
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 min-w-0">
          {/* 헤더 */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium ${isLocked ? 'text-white/30' : 'text-primary'}`}>
              Step {order}
            </span>
            {getStatusBadge()}
          </div>

          {/* 제목 */}
          <h3 className={`font-semibold mb-1 ${isLocked ? 'text-white/40' : 'text-white'}`}>
            {title}
          </h3>

          {/* 설명 */}
          <p className={`text-sm mb-3 ${isLocked ? 'text-white/20' : 'text-white/50'}`}>
            {description}
          </p>

          {/* 진행률 바 (진행 중인 경우만) */}
          {!isLocked && !isCompleted && progress > 0 && (
            <div className="mb-3">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-white/40 mt-1 inline-block">{progress}% 완료</span>
            </div>
          )}

          {/* 예상 시간 */}
          <div className={`flex items-center gap-1.5 text-xs ${isLocked ? 'text-white/20' : 'text-white/40'}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{estimatedMinutes}분</span>
          </div>
        </div>

        {/* 화살표 (활성화된 경우만) */}
        {!isLocked && (
          <div className={`flex-shrink-0 ${isCompleted ? 'text-green-400/50' : 'text-white/30'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  )
}
