'use client'

import React from 'react'
import { ChatMessage } from '@/app/data/chatData'

interface MessageBubbleProps {
  message: ChatMessage
  isStreaming?: boolean
}

/** 간단한 마크다운 파서 */
function parseMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []

  lines.forEach((line, lineIndex) => {
    // 빈 줄
    if (line.trim() === '') {
      elements.push(<br key={`br-${lineIndex}`} />)
      return
    }

    // 코드 블록 시작/끝 (간단 처리)
    if (line.startsWith('```')) {
      return
    }

    // 헤딩
    if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={lineIndex} className="font-semibold text-white mt-3 mb-1">
          {line.replace(/\*\*/g, '')}
        </p>
      )
      return
    }

    // 리스트 아이템
    if (line.startsWith('- ') || line.startsWith('• ')) {
      const content = line.substring(2)
      elements.push(
        <div key={lineIndex} className="flex items-start gap-2 ml-2">
          <span className="text-primary mt-1">•</span>
          <span>{parseInlineMarkdown(content)}</span>
        </div>
      )
      return
    }

    // 숫자 리스트
    const numberedMatch = line.match(/^(\d+)\.\s(.+)/)
    if (numberedMatch) {
      elements.push(
        <div key={lineIndex} className="flex items-start gap-2 ml-2 mt-1">
          <span className="text-primary font-medium">{numberedMatch[1]}.</span>
          <span>{parseInlineMarkdown(numberedMatch[2])}</span>
        </div>
      )
      return
    }

    // 일반 텍스트
    elements.push(
      <p key={lineIndex} className="mt-1">
        {parseInlineMarkdown(line)}
      </p>
    )
  })

  return <>{elements}</>
}

/** 인라인 마크다운 (볼드, 이모지 등) */
function parseInlineMarkdown(text: string): React.ReactNode {
  // **볼드** 처리
  const parts = text.split(/(\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false
}) => {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  // 시간 포맷팅
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%]">
          <div className="
            px-4 py-3 rounded-2xl rounded-br-md
            bg-primary text-white
          ">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <div className="text-right mt-1">
            <span className="text-[10px] text-white/30">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (isAssistant) {
    return (
      <div className="flex gap-3 mb-4">
        {/* 아바타 */}
        <div className="
          w-8 h-8 rounded-lg flex-shrink-0
          bg-primary/20 flex items-center justify-center
        ">
          <span className="text-sm">🤖</span>
        </div>

        {/* 메시지 */}
        <div className="flex-1 max-w-[85%]">
          <div className="
            px-4 py-3 rounded-2xl rounded-tl-md
            bg-white/[0.05] border border-white/[0.08]
          ">
            <div className="text-sm text-white/90 leading-relaxed">
              {parseMarkdown(message.content)}
              {isStreaming && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse" />
              )}
            </div>
          </div>
          <div className="mt-1">
            <span className="text-[10px] text-white/30">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // 시스템 메시지
  return (
    <div className="flex justify-center mb-4">
      <div className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05]">
        <p className="text-xs text-white/40">{message.content}</p>
      </div>
    </div>
  )
}
