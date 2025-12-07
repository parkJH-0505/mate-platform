'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Props {
  title: string
  estimatedMinutes: number
  difficulty: number
  onBack: () => void
}

export function ActionHeader({ title, estimatedMinutes, difficulty, onBack }: Props) {
  const getDifficultyLabel = (d: number) => {
    switch (d) {
      case 1: return { label: '쉬움', color: 'text-green-400 bg-green-400/10' }
      case 2: return { label: '보통', color: 'text-blue-400 bg-blue-400/10' }
      case 3: return { label: '도전', color: 'text-yellow-400 bg-yellow-400/10' }
      case 4: return { label: '어려움', color: 'text-orange-400 bg-orange-400/10' }
      case 5: return { label: '고급', color: 'text-red-400 bg-red-400/10' }
      default: return { label: '보통', color: 'text-blue-400 bg-blue-400/10' }
    }
  }

  const difficultyInfo = getDifficultyLabel(difficulty)

  return (
    <header className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          {/* 뒤로가기 */}
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
          >
            <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 제목 영역 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🎯</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyInfo.color}`}>
                {difficultyInfo.label}
              </span>
            </div>
            <h1 className="text-lg font-semibold text-white truncate">
              {title}
            </h1>
          </div>

          {/* 예상 시간 */}
          <div className="flex-shrink-0 text-right">
            <div className="flex items-center gap-1 text-white/50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{estimatedMinutes}분</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
