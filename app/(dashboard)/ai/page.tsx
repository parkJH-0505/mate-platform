'use client'

import React, { useState } from 'react'
import { useChat } from '@/app/hooks/useChat'
import { ChatContainer } from '@/components/ai'
import { generalQuestions } from '@/app/data/chatData'

export default function AIPage() {
  const [hasStarted, setHasStarted] = useState(false)

  const {
    messages,
    isLoading,
    streamingMessageId,
    suggestedQuestions,
    sendMessage
  } = useChat({
    persistKey: 'mate-ai-chat'
  })

  // 대화 시작 여부 (환영 메시지 외에 추가 메시지가 있는지)
  const chatStarted = hasStarted || messages.length > 1

  const handleSendMessage = async (content: string) => {
    setHasStarted(true)
    await sendMessage(content)
  }

  // 채팅 전 - 환영 화면
  if (!chatStarted) {
    return (
      <div className="flex flex-col h-[calc(100vh-10rem)]">
        {/* 환영 섹션 */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* 아이콘 */}
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
            <span className="text-4xl">🤖</span>
          </div>

          {/* 타이틀 */}
          <h1 className="text-2xl font-bold text-white mb-2">
            MATE AI 도우미
          </h1>
          <p className="text-white/60 text-center mb-8">
            창업 과정에서 궁금한 점이나<br />
            막히는 부분이 있으면 언제든 물어보세요!
          </p>

          {/* 추천 질문 카드 */}
          <div className="w-full max-w-md space-y-3">
            {generalQuestions.slice(0, 4).map((q) => (
              <button
                key={q.id}
                onClick={() => handleSendMessage(q.text)}
                className="
                  w-full p-4 rounded-xl text-left
                  bg-white/[0.03] border border-white/[0.06]
                  hover:bg-white/[0.06] hover:border-white/[0.12]
                  transition-all duration-200
                  group
                "
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">💬</span>
                  <span className="text-white/80 group-hover:text-white transition-colors">
                    {q.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 하단 입력창 */}
        <div className="px-4 py-3">
          <div className="
            flex items-center gap-2
            p-2 rounded-2xl
            bg-white/[0.05] border border-white/[0.08]
          ">
            <input
              type="text"
              placeholder="무엇이든 물어보세요..."
              className="
                flex-1 bg-transparent text-white text-sm
                placeholder:text-white/30
                outline-none px-3 py-2
              "
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  handleSendMessage(e.currentTarget.value.trim())
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
    )
  }

  // 채팅 진행 중 - 풀 채팅 UI
  return (
    <div className="h-[calc(100vh-10rem)]">
      <ChatContainer
        messages={messages}
        suggestedQuestions={suggestedQuestions}
        isLoading={isLoading}
        streamingMessageId={streamingMessageId || undefined}
        onSendMessage={handleSendMessage}
        showHeader={false}
      />
    </div>
  )
}
