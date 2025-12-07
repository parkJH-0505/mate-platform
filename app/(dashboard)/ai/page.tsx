'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useAuth } from '@/hooks/useAuth'
import { ChatWindow, ChatSidebar } from '../components/chat'
import { BottomNavigation } from '../components/BottomNavigation'

interface ChatSession {
  id: string
  title: string
  updated_at: string
  lastMessage?: {
    content: string
    role: string
  } | null
}

export default function AIPage() {
  const { user } = useAuth()
  const { sessionId: userSessionId } = useOnboardingStore()

  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)

  // 세션 목록 로드
  const loadSessions = useCallback(async () => {
    try {
      setIsLoadingSessions(true)
      const params = new URLSearchParams()
      if (userSessionId) params.set('sessionId', userSessionId)

      const response = await fetch(`/api/chat/sessions?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setSessions(data.sessions)

        // 활성 세션이 없으면 가장 최근 세션 선택
        if (!activeSessionId && data.sessions.length > 0) {
          setActiveSessionId(data.sessions[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setIsLoadingSessions(false)
    }
  }, [userSessionId, activeSessionId])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  // 새 세션 생성
  const handleNewSession = async () => {
    try {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: userSessionId }),
      })
      const data = await response.json()

      if (data.success) {
        setSessions((prev) => [data.session, ...prev])
        setActiveSessionId(data.session.id)
        setShowSidebar(false)
      }
    } catch (error) {
      console.error('Error creating session:', error)
    }
  }

  // 세션 삭제
  const handleDeleteSession = async (id: string) => {
    try {
      const params = new URLSearchParams()
      if (userSessionId) params.set('sessionId', userSessionId)

      await fetch(`/api/chat/sessions/${id}?${params.toString()}`, {
        method: 'DELETE',
      })

      setSessions((prev) => prev.filter((s) => s.id !== id))

      if (activeSessionId === id) {
        const remaining = sessions.filter((s) => s.id !== id)
        setActiveSessionId(remaining.length > 0 ? remaining[0].id : null)
      }
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  // 제목 업데이트
  const handleTitleUpdate = (title: string) => {
    if (!activeSessionId) return

    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, title } : s))
    )
  }

  // 첫 대화인 경우 자동으로 세션 생성
  useEffect(() => {
    if (!isLoadingSessions && sessions.length === 0 && !activeSessionId) {
      handleNewSession()
    }
  }, [isLoadingSessions, sessions.length, activeSessionId])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-xl">🤖</span>
                AI 멘토
              </h1>
              <p className="text-xs text-white/40 hidden sm:block">
                창업에 대해 무엇이든 물어보세요
              </p>
            </div>
          </div>

          <button
            onClick={handleNewSession}
            className="
              px-4 py-2 rounded-lg
              bg-accent-purple/20 border border-accent-purple/30
              text-accent-purple text-sm font-medium
              hover:bg-accent-purple/30 transition-colors
              flex items-center gap-2
            "
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">새 대화</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 border-r border-white/[0.06] flex-shrink-0">
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId || undefined}
            onSelectSession={(id) => setActiveSessionId(id)}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
            isLoading={isLoadingSessions}
          />
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {showSidebar && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSidebar(false)}
                className="fixed inset-0 bg-black/60 z-40 md:hidden"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-[min(280px,85vw)] bg-[#0a0a0a] border-r border-white/[0.06] z-50 md:hidden"
              >
                <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">대화 목록</h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ChatSidebar
                  sessions={sessions}
                  activeSessionId={activeSessionId || undefined}
                  onSelectSession={(id) => {
                    setActiveSessionId(id)
                    setShowSidebar(false)
                  }}
                  onNewSession={() => {
                    handleNewSession()
                    setShowSidebar(false)
                  }}
                  onDeleteSession={handleDeleteSession}
                  isLoading={isLoadingSessions}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Chat Window */}
        <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
          {activeSessionId ? (
            <ChatWindow
              sessionId={activeSessionId}
              userSessionId={userSessionId || undefined}
              onTitleUpdate={handleTitleUpdate}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center text-3xl">
                  🤖
                </div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  AI 멘토와 대화하기
                </h2>
                <p className="text-sm text-white/50 mb-4">
                  새 대화를 시작해보세요
                </p>
                <button
                  onClick={handleNewSession}
                  className="
                    px-6 py-3 rounded-xl
                    bg-accent-purple text-white font-medium
                    hover:bg-accent-purple/80 transition-colors
                  "
                >
                  대화 시작하기
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  )
}
