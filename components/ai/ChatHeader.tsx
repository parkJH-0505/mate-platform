'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ChatContext } from '@/app/data/chatData'

interface ChatHeaderProps {
  context?: ChatContext
  onBack?: () => void
  showBack?: boolean
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  context,
  onBack,
  showBack = true
}) => {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <div className="
      flex items-center justify-between
      px-4 py-3
      bg-[#0a0a0a]/95 backdrop-blur-lg
      border-b border-white/[0.05]
    ">
      {/* 왼쪽: 뒤로가기 */}
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-1 text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <span className="font-semibold text-white">MATE AI</span>
        </div>
      </div>

      {/* 오른쪽: 컨텍스트 배지 */}
      {context?.stepTitle && (
        <div className="
          px-3 py-1 rounded-full
          bg-primary/10 border border-primary/20
          text-xs text-primary
        ">
          {context.stepTitle}
        </div>
      )}
    </div>
  )
}
