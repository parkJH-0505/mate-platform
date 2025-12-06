'use client'

import React, { useState } from 'react'
import type { SolutionStep } from '../data/resultData'

interface SolutionStepCardProps {
  step: SolutionStep
  isExpanded?: boolean
  onToggle?: () => void
}

const difficultyConfig = {
  easy: {
    label: '쉬움',
    color: 'text-green-400',
    bg: 'bg-green-500/10'
  },
  medium: {
    label: '보통',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10'
  },
  hard: {
    label: '어려움',
    color: 'text-red-400',
    bg: 'bg-red-500/10'
  }
}

export const SolutionStepCard: React.FC<SolutionStepCardProps> = ({
  step,
  isExpanded = false,
  onToggle
}) => {
  const difficultyInfo = difficultyConfig[step.difficulty]
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedItems(newChecked)
  }

  const progress = step.actionItems.length > 0
    ? (checkedItems.size / step.actionItems.length) * 100
    : 0

  return (
    <div className={`
      relative rounded-2xl overflow-hidden transition-all duration-300
      ${isExpanded ? 'bg-white/[0.04]' : 'bg-white/[0.02] hover:bg-white/[0.03]'}
      border border-white/[0.06]
    `}>
      {/* Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left"
      >
        {/* Step Number */}
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center
          ${isExpanded ? 'bg-primary text-white' : 'bg-white/[0.05] text-white/50'}
          font-bold text-lg transition-colors
        `}>
          {step.order}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">
            {step.title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-white/40 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {step.estimatedTime}
            </span>
            <span className={`text-xs ${difficultyInfo.color}`}>
              {difficultyInfo.label}
            </span>
          </div>
        </div>

        {/* Progress / Expand Icon */}
        <div className="flex items-center gap-3">
          {checkedItems.size > 0 && (
            <div className="text-xs text-primary">
              {checkedItems.size}/{step.actionItems.length}
            </div>
          )}
          <svg
            className={`w-5 h-5 text-white/30 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 animate-fadeIn">
          {/* Description */}
          <p className="text-white/60 text-sm mb-5 pl-14">
            {step.description}
          </p>

          {/* Progress Bar */}
          {step.actionItems.length > 0 && (
            <div className="pl-14 mb-4">
              <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Items */}
          <div className="space-y-2 pl-14">
            {step.actionItems.map((item, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleItem(index)
                }}
                className={`
                  w-full flex items-start gap-3 p-3 rounded-xl text-left
                  transition-all duration-200
                  ${checkedItems.has(index)
                    ? 'bg-primary/10 border-primary/20'
                    : 'bg-white/[0.02] hover:bg-white/[0.04] border-transparent'
                  }
                  border
                `}
              >
                <div className={`
                  w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5
                  border transition-all duration-200
                  ${checkedItems.has(index)
                    ? 'bg-primary border-primary'
                    : 'border-white/20'
                  }
                `}>
                  {checkedItems.has(index) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${checkedItems.has(index) ? 'text-white/50 line-through' : 'text-white/80'}`}>
                  {item}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
