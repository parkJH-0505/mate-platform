'use client'

import React from 'react'

interface ChoiceButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  selected?: boolean
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  label,
  onClick,
  disabled = false,
  selected = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-5 py-4 rounded-xl
        text-sm sm:text-base font-medium text-left
        transition-all duration-300 ease-out
        ${selected
          ? 'bg-primary/20 border-primary/50 text-white shadow-[0_0_20px_rgba(234,73,46,0.2)]'
          : 'bg-white/[0.03] border-white/[0.08] text-white/70 hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-white'
        }
        border backdrop-blur-sm
        hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
      `}
    >
      {label}
    </button>
  )
}
