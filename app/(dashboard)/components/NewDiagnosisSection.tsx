'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface NewDiagnosisSectionProps {
  onSubmit?: (query: string) => void
}

export const NewDiagnosisSection: React.FC<NewDiagnosisSectionProps> = ({
  onSubmit
}) => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    if (onSubmit) {
      onSubmit(query)
    } else {
      router.push(`/diagnosis?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <section className="mb-8">
      <div className="
        p-6 rounded-2xl
        bg-gradient-to-br from-white/[0.03] to-transparent
        border border-white/[0.06]
      ">
        <h3 className="text-lg font-semibold text-white mb-4">
          새로운 고민이 있으신가요?
        </h3>

        <form onSubmit={handleSubmit}>
          <div className={`
            relative rounded-xl overflow-hidden
            transition-all duration-300
            ${isFocused ? 'ring-2 ring-primary/50' : ''}
          `}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="예: 첫 고객을 어디서 찾아야 할지 모르겠어요"
              className="
                w-full px-4 py-4 pr-28
                bg-white/[0.03] border border-white/[0.08]
                text-white placeholder-white/30
                rounded-xl
                focus:outline-none
                text-sm
              "
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className={`
                absolute right-2 top-1/2 -translate-y-1/2
                px-4 py-2 rounded-lg
                text-sm font-medium
                transition-all duration-200
                flex items-center gap-1.5
                ${query.trim()
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                }
              `}
            >
              진단하기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>

        {/* Quick Category Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: '고객/영업', id: 'customer' },
            { label: '가격/수익', id: 'pricing' },
            { label: '제품/서비스', id: 'product' }
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => router.push(`/diagnosis?category=${category.id}`)}
              className="
                px-3 py-1.5 rounded-lg
                text-xs font-medium
                bg-white/[0.03] hover:bg-white/[0.08]
                border border-white/[0.06]
                text-white/50 hover:text-white/80
                transition-colors
              "
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
