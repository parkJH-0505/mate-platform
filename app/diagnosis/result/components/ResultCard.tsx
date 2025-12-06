'use client'

import React from 'react'

interface ResultCardProps {
  title: string
  summary: string
  keyInsight: string
  urgency: 'low' | 'medium' | 'high'
  categoryName: string
}

const urgencyConfig = {
  low: {
    label: '여유있게',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  medium: {
    label: '조금 급해요',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20'
  },
  high: {
    label: '지금 바로!',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20'
  }
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  summary,
  keyInsight,
  urgency,
  categoryName
}) => {
  const urgencyInfo = urgencyConfig[urgency]

  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl blur-xl" />

      <div className="
        relative p-8 rounded-3xl
        bg-gradient-to-br from-white/[0.05] to-transparent
        border border-white/[0.08]
        backdrop-blur-sm
      ">
        {/* Category Badge */}
        <div className="flex items-center gap-3 mb-6">
          <span className="
            px-3 py-1 rounded-full text-xs font-medium
            bg-primary/10 text-primary border border-primary/20
          ">
            {categoryName}
          </span>
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${urgencyInfo.bg} ${urgencyInfo.color} ${urgencyInfo.border} border
          `}>
            {urgencyInfo.label}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {title}
        </h1>

        {/* Summary */}
        <p className="text-lg text-white/70 leading-relaxed mb-8">
          {summary}
        </p>

        {/* Key Insight */}
        <div className="
          p-5 rounded-2xl
          bg-gradient-to-r from-primary/5 to-transparent
          border-l-4 border-primary
        ">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-xs uppercase tracking-wider text-primary mb-1 font-medium">
                핵심 인사이트
              </p>
              <p className="text-white/90 font-medium">
                {keyInsight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
