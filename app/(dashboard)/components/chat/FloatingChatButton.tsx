'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatWindow } from './ChatWindow'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useAuth } from '@/hooks/useAuth'

export function FloatingChatButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [chatSessionId, setChatSessionId] = useState<string | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const { sessionId } = useOnboardingStore()
    const { user } = useAuth()

    // ESC 키로 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false)
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen])

    // 채팅 열기
    const handleOpen = async () => {
        if (isOpen) {
            setIsOpen(false)
            return
        }

        setIsOpen(true)

        // 이미 세션이 있으면 그대로 사용
        if (chatSessionId) return

        // 새 세션 생성
        try {
            setIsCreating(true)
            const params = new URLSearchParams()
            if (sessionId) params.set('sessionId', sessionId)

            const response = await fetch(`/api/chat/sessions?${params}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Mate AI와 대화',
                }),
            })

            const data = await response.json()
            if (data.success) {
                setChatSessionId(data.session.id)
            }
        } catch (error) {
            console.error('Failed to create chat session:', error)
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <>
            {/* 플로팅 버튼 */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                onClick={handleOpen}
                className={`
          fixed bottom-20 right-6 z-40
          w-14 h-14 rounded-full
          bg-gradient-to-r from-accent-purple to-primary
          shadow-lg hover:shadow-[0_0_30px_rgba(147,97,253,0.5)]
          flex items-center justify-center
          transition-all duration-200
          ${isOpen ? 'rotate-90' : 'hover:scale-110'}
        `}
                title="Mate AI와 대화하기"
            >
                {isOpen ? (
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                )}

                {/* 알림 뱃지 (선택사항) */}
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-[#0a0a0a]"
                    />
                )}
            </motion.button>

            {/* 미니 채팅 창 */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* 배경 오버레이 (모바일) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        />

                        {/* 채팅 창 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="
                fixed z-50
                bottom-24 right-6
                md:w-[400px] md:h-[600px]
                w-full h-full
                md:max-h-[600px]
                bg-[#0a0a0a]
                border border-white/10
                rounded-2xl md:rounded-3xl
                shadow-2xl
                flex flex-col
                overflow-hidden
              "
                        >
                            {/* 헤더 */}
                            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-gradient-to-r from-accent-purple/10 to-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-purple to-primary flex items-center justify-center">
                                        <span className="text-xl">🤖</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">
                                            Mate AI
                                        </h3>
                                        <p className="text-xs text-white/40">항상 여기 있어요</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
                                >
                                    <svg
                                        className="w-4 h-4 text-white/60"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* 채팅 영역 */}
                            <div className="flex-1 overflow-hidden">
                                {isCreating ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                            <p className="text-sm text-white/50">
                                                AI 멘토 연결 중...
                                            </p>
                                        </div>
                                    </div>
                                ) : chatSessionId ? (
                                    <ChatWindow
                                        sessionId={chatSessionId}
                                        userSessionId={sessionId}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-sm text-white/50">
                                            세션을 생성할 수 없습니다
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
