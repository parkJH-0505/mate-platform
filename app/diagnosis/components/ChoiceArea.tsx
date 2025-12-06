'use client'

import React from 'react'
import { ChoiceButton } from './ChoiceButton'

export interface Choice {
  id: string
  label: string
  value: string
}

interface ChoiceAreaProps {
  choices: Choice[]
  onSelect: (choice: Choice) => void
  onBack?: () => void
  showBack?: boolean
  disabled?: boolean
}

export const ChoiceArea: React.FC<ChoiceAreaProps> = ({
  choices,
  onSelect,
  onBack,
  showBack = false,
  disabled = false
}) => {
  return (
    <div className="
      fixed bottom-0 left-0 right-0
      bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent
      pt-8 pb-8 px-4
    ">
      <div className="max-w-2xl mx-auto">
        {/* Choices Grid */}
        <div className={`
          grid gap-3
          ${choices.length <= 2 ? 'grid-cols-2' : 'grid-cols-1'}
        `}>
          {choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              label={choice.label}
              onClick={() => onSelect(choice)}
              disabled={disabled}
            />
          ))}
        </div>

        {/* Back Button */}
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="
              mt-4 w-full py-3
              text-sm text-white/40
              hover:text-white/70
              transition-colors duration-200
              flex items-center justify-center gap-2
            "
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전 질문으로
          </button>
        )}
      </div>
    </div>
  )
}
