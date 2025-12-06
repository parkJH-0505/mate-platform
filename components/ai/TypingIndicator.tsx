'use client'

import React from 'react'

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1">
      <div className="
        w-2 h-2 rounded-full bg-white/40
        animate-bounce
      " style={{ animationDelay: '0ms' }} />
      <div className="
        w-2 h-2 rounded-full bg-white/40
        animate-bounce
      " style={{ animationDelay: '150ms' }} />
      <div className="
        w-2 h-2 rounded-full bg-white/40
        animate-bounce
      " style={{ animationDelay: '300ms' }} />
    </div>
  )
}
