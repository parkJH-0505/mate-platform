'use client'

import React from 'react'

interface SuggestedQuestionsProps {
  questions: string[]
  onSelect: (question: string) => void
  disabled?: boolean
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  questions,
  onSelect,
  disabled = false
}) => {
  if (questions.length === 0) return null

  return (
    <div className="px-4 py-3 border-t border-white/[0.05]">
      <p className="text-xs text-white/40 mb-2">추천 질문</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            disabled={disabled}
            className={`
              px-3 py-1.5 rounded-full text-sm
              bg-white/[0.05] border border-white/[0.08]
              text-white/70
              transition-all duration-200
              ${disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-white/[0.1] hover:border-primary/30 hover:text-white'
              }
            `}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}
