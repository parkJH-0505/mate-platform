'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  ChatMessage,
  ChatContext,
  ChatSession,
  generateMessageId,
  createNewSession,
  getSuggestedQuestions
} from '@/app/data/chatData'
import {
  generateStreamingResponse,
  getSuggestedFollowUps
} from '@/app/services/aiService'

interface UseChatOptions {
  sessionId?: string
  context?: ChatContext
  persistKey?: string // localStorage 키
}

interface UseChatReturn {
  // 상태
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  streamingMessageId: string | null

  // 액션
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  setContext: (context: ChatContext) => void

  // 추천 질문
  suggestedQuestions: string[]
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { context: initialContext, persistKey } = options

  const [session, setSession] = useState<ChatSession | null>(null)
  const [context, setContext] = useState<ChatContext | undefined>(initialContext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])

  // 초기화: localStorage에서 복원 또는 새 세션 생성
  useEffect(() => {
    if (persistKey) {
      const saved = localStorage.getItem(persistKey)
      if (saved) {
        try {
          const savedSession = JSON.parse(saved) as ChatSession
          setSession(savedSession)
          // 마지막 응답 기반 추천 질문
          const lastAssistant = savedSession.messages
            .filter(m => m.role === 'assistant')
            .pop()
          if (lastAssistant) {
            setSuggestedQuestions(getSuggestedFollowUps(lastAssistant.content))
          } else {
            setSuggestedQuestions(
              getSuggestedQuestions(context).map(q => q.text)
            )
          }
          return
        } catch {
          // 파싱 실패시 새 세션
        }
      }
    }

    // 새 세션 생성
    const newSession = createNewSession(context)
    setSession(newSession)
    setSuggestedQuestions(
      getSuggestedQuestions(context).map(q => q.text)
    )
  }, [persistKey, context])

  // 세션 변경 시 저장
  useEffect(() => {
    if (session && persistKey) {
      localStorage.setItem(persistKey, JSON.stringify(session))
    }
  }, [session, persistKey])

  // 메시지 전송
  const sendMessage = useCallback(async (content: string) => {
    if (!session || isLoading) return

    setError(null)
    setIsLoading(true)

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      context
    }

    const updatedMessages = [...session.messages, userMessage]
    setSession(prev => prev ? {
      ...prev,
      messages: updatedMessages,
      updatedAt: new Date().toISOString()
    } : prev)

    try {
      // AI 응답 메시지 초기화 (스트리밍용)
      const assistantMessageId = generateMessageId()
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        context
      }

      setSession(prev => prev ? {
        ...prev,
        messages: [...updatedMessages, assistantMessage],
        updatedAt: new Date().toISOString()
      } : prev)

      setStreamingMessageId(assistantMessageId)

      // 스트리밍 응답 처리
      let fullContent = ''
      const generator = generateStreamingResponse(updatedMessages, context)

      for await (const chunk of generator) {
        fullContent += chunk
        setSession(prev => {
          if (!prev) return prev
          return {
            ...prev,
            messages: prev.messages.map(m =>
              m.id === assistantMessageId
                ? { ...m, content: fullContent }
                : m
            ),
            updatedAt: new Date().toISOString()
          }
        })
      }

      // 스트리밍 완료
      setStreamingMessageId(null)

      // 후속 추천 질문 업데이트
      setSuggestedQuestions(getSuggestedFollowUps(fullContent))

    } catch (err) {
      setError(err instanceof Error ? err.message : '응답을 받는 중 오류가 발생했습니다.')
      setStreamingMessageId(null)
    } finally {
      setIsLoading(false)
    }
  }, [session, isLoading, context])

  // 대화 초기화
  const clearMessages = useCallback(() => {
    const newSession = createNewSession(context)
    setSession(newSession)
    setSuggestedQuestions(
      getSuggestedQuestions(context).map(q => q.text)
    )
    setError(null)

    if (persistKey) {
      localStorage.removeItem(persistKey)
    }
  }, [context, persistKey])

  // 컨텍스트 변경
  const updateContext = useCallback((newContext: ChatContext) => {
    setContext(newContext)
  }, [])

  return {
    messages: session?.messages || [],
    isLoading,
    error,
    streamingMessageId,
    sendMessage,
    clearMessages,
    setContext: updateContext,
    suggestedQuestions
  }
}
