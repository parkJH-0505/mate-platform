'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { QUICK_QUESTIONS } from '@/lib/ai/prompts'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface ChatWindowProps {
  sessionId: string // 채팅 세션 ID
  userSessionId?: string // 비로그인 사용자 식별용
  contentId?: string // 현재 콘텐츠 ID (있다면)
  onTitleUpdate?: (title: string) => void
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  sessionId,
  userSessionId,
  contentId,
  onTitleUpdate,
}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // 메시지 영역 스크롤
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // 메시지 로드
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (userSessionId) params.set('sessionId', userSessionId)

        const response = await fetch(
          `/api/chat/sessions/${sessionId}/messages?${params.toString()}`
        )
        const data = await response.json()

        if (data.success) {
          setMessages(data.messages)
        }
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (sessionId) {
      loadMessages()
    }
  }, [sessionId, userSessionId])

  // 메시지 변경시 스크롤
  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent, scrollToBottom])

  // 메시지 전송
  const handleSendMessage = async (message: string) => {
    if (isStreaming) return

    // 사용자 메시지 즉시 추가
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsStreaming(true)
    setStreamingContent('')

    try {
      abortControllerRef.current = new AbortController()

      const response = await fetch(`/api/chat/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionId: userSessionId,
          contentId,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) throw new Error('Failed to send message')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No reader available')

      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)

            if (data === '[DONE]') {
              // 스트리밍 완료
              const assistantMessage: Message = {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: fullContent,
                created_at: new Date().toISOString(),
              }
              setMessages((prev) => [...prev, assistantMessage])
              setStreamingContent('')
              break
            }

            try {
              const parsed = JSON.parse(data)

              if (parsed.text) {
                fullContent += parsed.text
                setStreamingContent(fullContent)
              }

              if (parsed.title && onTitleUpdate) {
                onTitleUpdate(parsed.title)
              }

              if (parsed.error) {
                console.error('Streaming error:', parsed.error)
              }
            } catch {
              // JSON 파싱 실패 무시
            }
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sending message:', error)
        // 에러 메시지 표시
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: '죄송합니다. 메시지 전송에 실패했습니다. 다시 시도해주세요.',
            created_at: new Date().toISOString(),
          },
        ])
      }
    } finally {
      setIsStreaming(false)
      setStreamingContent('')
      abortControllerRef.current = null
    }
  }

  // 컴포넌트 언마운트시 스트리밍 취소
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  // 빠른 질문 선택
  const quickQuestions = contentId
    ? QUICK_QUESTIONS.content
    : QUICK_QUESTIONS.general

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-white/50">대화 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && !streamingContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center text-3xl">
              🤖
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              안녕하세요! AI 멘토입니다
            </h3>
            <p className="text-sm text-white/50 max-w-sm mx-auto">
              창업에 대해 궁금한 것이 있으시면 무엇이든 물어보세요.
              {contentId && ' 현재 학습 중인 콘텐츠에 대해서도 질문할 수 있어요.'}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={new Date(msg.created_at)}
            />
          ))}
        </AnimatePresence>

        {/* Streaming Message */}
        {streamingContent && (
          <ChatMessage
            role="assistant"
            content={streamingContent}
            isStreaming={true}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-white/[0.06] px-4 py-4 bg-[#0a0a0a]/80 backdrop-blur-sm">
        <ChatInput
          onSend={handleSendMessage}
          disabled={isStreaming}
          placeholder={isStreaming ? 'AI가 응답 중...' : '메시지를 입력하세요...'}
          suggestions={messages.length === 0 ? quickQuestions : []}
        />
      </div>
    </div>
  )
}
