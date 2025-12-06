'use client'

import React, { useEffect } from 'react'
import { ChatContext, stuckQuestions } from '@/app/data/chatData'
import { useChat } from '@/app/hooks/useChat'
import { ChatContainer } from './ChatContainer'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  context?: ChatContext
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  context
}) => {
  const {
    messages,
    isLoading,
    streamingMessageId,
    suggestedQuestions,
    sendMessage,
    setContext
  } = useChat({
    context,
    persistKey: context?.stepId ? `mate-chat-${context.stepId}` : undefined
  })

  // 컨텍스트 변경 시 업데이트
  useEffect(() => {
    if (context) {
      setContext(context)
    }
  }, [context, setContext])

  // ESC로 닫기 + 스크롤 방지
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // 채팅 시작 전 - 추천 질문 화면
  const hasChat = messages.length > 1

  return (
    <div className="fixed inset-0 z-50">
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 (바텀시트 스타일) */}
      <div className="
        absolute bottom-0 left-0 right-0
        h-[85vh] max-h-[700px]
        bg-[#121212] rounded-t-3xl
        flex flex-col overflow-hidden
        animate-slideUp
      ">
        {/* 드래그 핸들 */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span>🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">AI 도우미</h3>
              {context?.stepTitle && (
                <p className="text-xs text-white/50">{context.stepTitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 채팅 영역 */}
        {hasChat ? (
          <div className="flex-1 overflow-hidden">
            <ChatContainer
              messages={messages}
              suggestedQuestions={suggestedQuestions}
              isLoading={isLoading}
              streamingMessageId={streamingMessageId || undefined}
              onSendMessage={sendMessage}
              showHeader={false}
            />
          </div>
        ) : (
          // 시작 화면
          <div className="flex-1 flex flex-col p-4">
            <div className="flex-1 flex flex-col items-center justify-center">
              <h4 className="text-lg font-medium text-white mb-2">
                어떤 점이 막히셨나요?
              </h4>
              <p className="text-sm text-white/50 text-center mb-6">
                아래 질문을 선택하거나 직접 입력해주세요
              </p>

              {/* 추천 질문 */}
              <div className="w-full max-w-sm space-y-2">
                {stuckQuestions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => sendMessage(q.text)}
                    className="
                      w-full p-3 rounded-xl text-left
                      bg-white/[0.05] border border-white/[0.08]
                      hover:bg-white/[0.08] hover:border-primary/30
                      transition-all duration-200
                    "
                  >
                    <span className="text-sm text-white/80">{q.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 입력창 */}
            <div className="mt-4">
              <div className="
                flex items-center gap-2
                p-2 rounded-2xl
                bg-white/[0.05] border border-white/[0.08]
              ">
                <input
                  type="text"
                  placeholder="직접 질문하기..."
                  className="
                    flex-1 bg-transparent text-white text-sm
                    placeholder:text-white/30
                    outline-none px-3 py-2
                  "
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      sendMessage(e.currentTarget.value.trim())
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <button className="
                  w-9 h-9 rounded-xl
                  bg-white/10 text-white/30
                  flex items-center justify-center
                ">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
