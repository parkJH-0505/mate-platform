'use client'

import React from 'react'

interface ChatBubbleProps {
  type: 'ai' | 'user'
  message: string
  isTyping?: boolean
  timestamp?: Date
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  type,
  message,
  isTyping = false,
  timestamp
}) => {
  if (type === 'ai') {
    return (
      <div className="flex items-start gap-3 animate-fadeIn">
        {/* AI Avatar */}
        <div className="
          flex-shrink-0 w-9 h-9 rounded-xl
          bg-gradient-to-br from-primary/20 to-primary/5
          border border-primary/20
          flex items-center justify-center
          shadow-[0_0_20px_rgba(234,73,46,0.15)]
        ">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>

        {/* Message */}
        <div className="flex-1 max-w-[85%]">
          <div className="
            inline-block px-4 py-3 rounded-2xl rounded-tl-md
            bg-white/[0.04] border border-white/[0.06]
            backdrop-blur-sm
          ">
            {isTyping ? (
              <div className="flex items-center gap-1.5 py-1 px-2">
                <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <p className="text-sm sm:text-base text-white/80 leading-relaxed whitespace-pre-wrap">
                {message}
              </p>
            )}
          </div>
          {timestamp && (
            <p className="mt-1 ml-1 text-[10px] text-white/30">
              {timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    )
  }

  // User bubble
  return (
    <div className="flex items-start justify-end gap-3 animate-fadeIn">
      {/* Message */}
      <div className="flex-1 max-w-[85%] flex flex-col items-end">
        <div className="
          inline-block px-4 py-3 rounded-2xl rounded-tr-md
          bg-gradient-to-r from-primary to-[#ff6b4a]
          shadow-[0_4px_20px_rgba(234,73,46,0.2)]
        ">
          <p className="text-sm sm:text-base text-white leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>
        {timestamp && (
          <p className="mt-1 mr-1 text-[10px] text-white/30">
            {timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  )
}
