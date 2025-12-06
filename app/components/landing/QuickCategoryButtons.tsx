'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

const categories = [
  { id: 'customer', label: '고객/영업', icon: '👥' },
  { id: 'pricing', label: '가격/수익', icon: '💰' },
  { id: 'product', label: '제품/서비스', icon: '🛠️' },
  { id: 'marketing', label: '마케팅', icon: '📣' },
  { id: 'operations', label: '운영/관리', icon: '⚙️' },
  { id: 'strategy', label: '방향/전략', icon: '🧭' }
]

export const QuickCategoryButtons: React.FC = () => {
  const router = useRouter()

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/diagnosis?category=${categoryId}`)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-xs text-white/40 uppercase tracking-wider mb-4 text-center">
        또는 빠르게 선택하세요
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="
              group flex flex-col items-center gap-2
              px-3 py-4 rounded-xl
              bg-white/[0.02] border border-white/[0.06]
              backdrop-blur-sm
              transition-all duration-300 ease-out
              hover:bg-white/[0.05] hover:border-primary/30
              hover:shadow-[0_0_20px_rgba(234,73,46,0.1)]
              hover:-translate-y-0.5
              active:scale-[0.98]
            "
          >
            <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </span>
            <span className="text-[10px] sm:text-xs text-white/50 group-hover:text-white/80 font-medium uppercase tracking-wide transition-colors">
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
