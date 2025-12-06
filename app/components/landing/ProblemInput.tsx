'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export const ProblemInput: React.FC = () => {
  const [problem, setProblem] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (problem.trim()) {
      router.push(`/diagnosis?q=${encodeURIComponent(problem.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative flex items-center gap-3
          bg-white/[0.03] backdrop-blur-xl
          border rounded-xl
          transition-all duration-300 ease-out
          ${isFocused
            ? 'border-primary/50 shadow-[0_0_30px_rgba(234,73,46,0.15),0_0_60px_rgba(234,73,46,0.05)]'
            : 'border-white/[0.08] hover:border-white/[0.15]'
          }
        `}
      >
        {/* Search Icon */}
        <div className="absolute left-5 text-white/30">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="지금 막히는 게 뭔가요?"
          className="
            flex-1 bg-transparent
            py-5 pl-14 pr-4
            text-base sm:text-lg text-white
            placeholder:text-white/30
            focus:outline-none
          "
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!problem.trim()}
          className={`
            mr-2 px-6 py-3 rounded-lg
            text-sm font-semibold uppercase tracking-wider
            transition-all duration-300 ease-out
            ${problem.trim()
              ? 'bg-gradient-to-r from-primary to-[#ff6b4a] text-white hover:shadow-[0_0_20px_rgba(234,73,46,0.4)] hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-white/[0.05] text-white/30 cursor-not-allowed'
            }
          `}
        >
          진단 시작
        </button>
      </div>

      {/* Helper Text */}
      <p className="mt-3 text-xs text-white/30 text-center">
        Enter를 누르거나 버튼을 클릭하세요
      </p>
    </form>
  )
}
