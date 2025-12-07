'use client'

import React from 'react'

const CATEGORIES = [
  { id: null, name: '전체', icon: '📚' },
  { id: 'legal', name: '법률/행정', icon: '⚖️' },
  { id: 'mindset', name: '마인드셋', icon: '🧠' },
  { id: 'idea', name: '아이디어', icon: '💡' },
  { id: 'validation', name: '검증', icon: '🔍' },
  { id: 'mvp', name: 'MVP/개발', icon: '🛠️' },
  { id: 'growth', name: '성장', icon: '📈' },
  { id: 'case_study', name: '사례', icon: '🏆' },
  { id: 'investment', name: '투자/IR', icon: '💰' },
  { id: 'government', name: '정부지원', icon: '🏛️' }
]

interface Props {
  selected: string | null
  onSelect: (category: string | null) => void
}

export function CategoryTabs({ selected, onSelect }: Props) {
  return (
    <div className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-2">
        {CATEGORIES.map((category) => {
          const isSelected = selected === category.id

          return (
            <button
              key={category.id || 'all'}
              onClick={() => onSelect(category.id)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full
                flex items-center gap-2 text-sm font-medium
                transition-all whitespace-nowrap
                ${isSelected
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white/80'
                }
              `}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
