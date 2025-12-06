'use client'

import React from 'react'
import { ChatMessage, ChatContext } from '@/app/data/chatData'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { SuggestedQuestions } from './SuggestedQuestions'
import { ChatInput } from './ChatInput'

interface ChatContainerProps {
  messages: ChatMessage[]
  suggestedQuestions: string[]
  isLoading: boolean
  streamingMessageId?: string
  context?: ChatContext
  onSendMessage: (message: string) => void
  onBack?: () => void
  showHeader?: boolean
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  suggestedQuestions,
  isLoading,
  streamingMessageId,
  context,
  onSendMessage,
  onBack,
  showHeader = true
}) => {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* 헤더 */}
      {showHeader && (
        <ChatHeader context={context} onBack={onBack} />
      )}

      {/* 메시지 목록 */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        streamingMessageId={streamingMessageId}
      />

      {/* 추천 질문 */}
      <SuggestedQuestions
        questions={suggestedQuestions}
        onSelect={onSendMessage}
        disabled={isLoading}
      />

      {/* 입력창 */}
      <ChatInput
        onSend={onSendMessage}
        disabled={isLoading}
      />
    </div>
  )
}
