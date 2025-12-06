'use client'

import React from 'react'

interface ContinueCardProps {
  problemId: string
  title: string
  progress: number
  completedSteps: string[]
  nextStep: string
  onContinue: () => void
}

export const ContinueCard: React.FC<ContinueCardProps> = ({
  title,
  progress,
  completedSteps,
  nextStep,
  onContinue
}) => {
  return (
    <section className="mb-8">
      <div className="
        relative p-6 rounded-2xl overflow-hidden
        bg-gradient-to-br from-primary/10 to-transparent
        border border-primary/20
      ">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="
              px-2.5 py-1 rounded-full text-xs font-medium
              bg-primary/20 text-primary
            ">
              진행 중
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-4">
            {title}
          </h2>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-white/50">진행률</span>
              <span className="text-primary font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps Status */}
          <div className="space-y-2 mb-6">
            {completedSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-white/50 line-through">{step}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <span className="text-sm text-white font-medium">{nextStep}</span>
              <span className="text-xs text-primary">(다음)</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onContinue}
            className="
              w-full py-3.5 rounded-xl font-semibold
              bg-primary hover:bg-primary/90
              text-white
              transition-all duration-300
              hover:shadow-[0_0_30px_rgba(234,73,46,0.3)]
              active:scale-[0.98]
              flex items-center justify-center gap-2
            "
          >
            계속하기
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
