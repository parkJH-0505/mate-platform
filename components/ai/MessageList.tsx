'use client'

import React, { useEffect, useRef } from 'react'
import { ChatMessage } from '@/app/data/chatData'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'

interface MessageListProps {
  messages: ChatMessage[]
  isLoading?: boolean
  streamingMessageId?: string
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading = false,
  streamingMessageId
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // 새 메시지가 추가되면 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-6"
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isStreaming={message.id === streamingMessageId}
        />
      ))}

      {/* 로딩 인디케이터 */}
      {isLoading && !streamingMessageId && (
        <div className="flex gap-3 mb-4">
          <div className="
            w-8 h-8 rounded-lg flex-shrink-0
            bg-primary/20 flex items-center justify-center
          ">
            <span className="text-sm">🤖</span>
          </div>
          <div className="
            px-4 py-3 rounded-2xl rounded-tl-md
            bg-white/[0.05] border border-white/[0.08]
          ">
            <TypingIndicator />
          </div>
        </div>
      )}

      {/* 스크롤 앵커 */}
      <div ref={bottomRef} />
    </div>
  )
}
