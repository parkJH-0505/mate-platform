'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
  suggestions?: { label: string; prompt: string }[]
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = '메시지를 입력하세요...',
  suggestions = [],
}) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 텍스트 영역 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSuggestionClick = (prompt: string) => {
    if (!disabled) {
      onSend(prompt)
    }
  }

  return (
    <div className="space-y-3">
      {/* Quick Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSuggestionClick(suggestion.prompt)}
              disabled={disabled}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium
                bg-white/[0.05] border border-white/[0.1]
                text-white/70 hover:text-white hover:bg-white/[0.1]
                transition-colors
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {suggestion.label}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className={`
                w-full px-4 py-3 pr-12
                rounded-xl
                bg-white/[0.05] border border-white/[0.1]
                text-white text-sm
                placeholder:text-white/40
                focus:outline-none focus:border-accent-purple/50
                resize-none
                transition-colors
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={disabled || !message.trim()}
              className={`
                absolute right-2 bottom-2
                w-10 h-10 rounded-lg
                flex items-center justify-center
                transition-all
                ${message.trim() && !disabled
                  ? 'bg-accent-purple text-white hover:bg-accent-purple/80'
                  : 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                }
              `}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Helper text */}
        <p className="text-[10px] text-white/30 mt-1 px-1">
          Shift + Enter로 줄바꿈
        </p>
      </form>
    </div>
  )
}
