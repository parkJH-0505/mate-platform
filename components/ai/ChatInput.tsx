'use client'

import React, { useState, useRef, useEffect } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = '메시지를 입력하세요...'
}) => {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [value])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (trimmed && !disabled) {
      onSend(trimmed)
      setValue('')
      // 높이 리셋
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter로 전송 (Shift+Enter는 줄바꿈)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="
      px-4 py-3
      bg-[#0a0a0a]/95 backdrop-blur-lg
      border-t border-white/[0.05]
    ">
      <div className="
        flex items-end gap-2
        p-2 rounded-2xl
        bg-white/[0.05] border border-white/[0.08]
        focus-within:border-primary/30 transition-colors
      ">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="
            flex-1 bg-transparent text-white text-sm
            placeholder:text-white/30
            resize-none outline-none
            px-2 py-1.5
            max-h-[120px]
            disabled:opacity-50
          "
        />

        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={`
            w-9 h-9 rounded-xl flex-shrink-0
            flex items-center justify-center
            transition-all duration-200
            ${value.trim() && !disabled
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      <p className="text-center text-[10px] text-white/20 mt-2">
        AI가 항상 정확하지 않을 수 있어요. 중요한 결정은 직접 확인하세요.
      </p>
    </div>
  )
}
