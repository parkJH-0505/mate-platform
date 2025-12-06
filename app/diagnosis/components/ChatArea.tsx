'use client'

import React, { useRef, useEffect } from 'react'
import { ChatBubble } from './ChatBubble'

export interface ChatMessage {
  id: string
  type: 'ai' | 'user'
  message: string
  timestamp: Date
}

interface ChatAreaProps {
  messages: ChatMessage[]
  isTyping?: boolean
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isTyping = false
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages, isTyping])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
    >
      {messages.map((msg) => (
        <ChatBubble
          key={msg.id}
          type={msg.type}
          message={msg.message}
          timestamp={msg.timestamp}
        />
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <ChatBubble
          type="ai"
          message=""
          isTyping={true}
        />
      )}
    </div>
  )
}
