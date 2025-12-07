'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ChatSession {
  id: string
  title: string
  updated_at: string
  lastMessage?: {
    content: string
    role: string
  } | null
}

interface ChatSidebarProps {
  sessions: ChatSession[]
  activeSessionId?: string
  onSelectSession: (id: string) => void
  onNewSession: () => void
  onDeleteSession?: (id: string) => void
  isLoading?: boolean
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isLoading = false,
}) => {
  // 날짜별 그룹화
  const groupedSessions = sessions.reduce<Record<string, ChatSession[]>>(
    (acc, session) => {
      const date = new Date(session.updated_at)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let key: string
      if (date.toDateString() === today.toDateString()) {
        key = '오늘'
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = '어제'
      } else if (date > new Date(today.setDate(today.getDate() - 7))) {
        key = '이번 주'
      } else {
        key = '이전'
      }

      if (!acc[key]) acc[key] = []
      acc[key].push(session)
      return acc
    },
    {}
  )

  const groupOrder = ['오늘', '어제', '이번 주', '이전']

  return (
    <div className="flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-4 border-b border-white/[0.06]">
        <button
          onClick={onNewSession}
          className="
            w-full py-3 px-4 rounded-xl
            bg-accent-purple/20 border border-accent-purple/30
            text-accent-purple font-medium text-sm
            hover:bg-accent-purple/30 transition-colors
            flex items-center justify-center gap-2
          "
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 대화
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-white/40">아직 대화가 없습니다</p>
            <p className="text-xs text-white/30 mt-1">새 대화를 시작해보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupOrder.map((group) => {
              const groupSessions = groupedSessions[group]
              if (!groupSessions?.length) return null

              return (
                <div key={group}>
                  <p className="text-xs text-white/30 px-2 mb-2">{group}</p>
                  <div className="space-y-1">
                    {groupSessions.map((session) => (
                      <motion.button
                        key={session.id}
                        whileHover={{ x: 2 }}
                        onClick={() => onSelectSession(session.id)}
                        className={`
                          w-full text-left p-3 rounded-lg
                          transition-colors group relative
                          ${activeSessionId === session.id
                            ? 'bg-accent-purple/20 border border-accent-purple/30'
                            : 'hover:bg-white/[0.05] border border-transparent'
                          }
                        `}
                      >
                        <p className="text-sm font-medium text-white truncate pr-6">
                          {session.title || '새 대화'}
                        </p>
                        {session.lastMessage && (
                          <p className="text-xs text-white/40 truncate mt-0.5">
                            {session.lastMessage.role === 'assistant' ? '🤖 ' : ''}
                            {session.lastMessage.content.slice(0, 30)}...
                          </p>
                        )}

                        {/* Delete Button */}
                        {onDeleteSession && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteSession(session.id)
                            }}
                            className="
                              absolute right-2 top-1/2 -translate-y-1/2
                              w-6 h-6 rounded-md
                              opacity-0 group-hover:opacity-100
                              hover:bg-red-500/20 text-red-400
                              flex items-center justify-center
                              transition-all
                            "
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
