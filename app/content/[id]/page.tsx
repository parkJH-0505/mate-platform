'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useAuth } from '@/hooks/useAuth'
import { Paywall } from '@/components/Paywall'

interface ContentData {
  id: string
  title: string
  creator: string
  duration: string
  type: string
  description: string | null
  module: {
    id: string
    title: string
    weekNumber: number
    curriculumId: string
  }
  isCompleted: boolean
  contentIndex: number
  requiresSubscription: boolean
  nextContent: {
    id: string
    title: string
    creator: string
    duration: string
  } | null
}

export default function ContentPage() {
  const router = useRouter()
  const params = useParams()
  const contentId = params.id as string

  const { sessionId, curriculumId } = useOnboardingStore()
  const { user } = useAuth()

  const [content, setContent] = useState<ContentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'notes'>('overview')
  const [isCompleting, setIsCompleting] = useState(false)
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if (contentId && (sessionId || user)) {
      fetchContent()
    }
  }, [contentId, sessionId, user])

  const fetchContent = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/content/${contentId}?sessionId=${sessionId}`)
      const data = await response.json()

      if (data.success) {
        setContent(data.content)
        setIsSubscribed(data.isSubscribed)

        // 구독이 필요한 콘텐츠인 경우 Paywall 표시
        if (data.content.requiresSubscription) {
          setShowPaywall(true)
        }
      } else {
        setError(data.error || 'Failed to fetch content')
      }
    } catch (err) {
      setError('Failed to load content')
      console.error('Error fetching content:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!content || isCompleting) return

    // 구독 필요한 콘텐츠인데 구독이 없으면 Paywall 표시
    if (content.requiresSubscription) {
      setShowPaywall(true)
      return
    }

    try {
      setIsCompleting(true)
      const response = await fetch('/api/progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: content.id,
          curriculumId: content.module.curriculumId,
          sessionId
        })
      })

      const data = await response.json()

      if (data.success) {
        setContent(prev => prev ? { ...prev, isCompleted: true } : null)
        setShowCompletionAnimation(true)

        // Wait for animation then navigate to next content or curriculum
        setTimeout(() => {
          if (content.nextContent) {
            router.push(`/content/${content.nextContent.id}`)
          } else {
            router.push('/curriculum')
          }
        }, 1500)
      }
    } catch (err) {
      console.error('Error completing content:', err)
    } finally {
      setIsCompleting(false)
    }
  }

  const handleNextContent = () => {
    if (content?.nextContent) {
      router.push(`/content/${content.nextContent.id}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">콘텐츠 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">{error || '콘텐츠를 찾을 수 없습니다'}</p>
          <button
            onClick={() => router.push('/curriculum')}
            className="px-4 py-2 rounded-lg bg-accent-purple text-white"
          >
            커리큘럼으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Paywall Modal */}
      <Paywall
        isOpen={showPaywall}
        onClose={() => {
          setShowPaywall(false)
          // 구독이 필요한데 닫으면 커리큘럼으로 돌아가기
          if (content.requiresSubscription) {
            router.push('/curriculum')
          }
        }}
      />

      {/* Completion Animation Overlay */}
      {showCompletionAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-[#0a0a0a]/90 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">학습 완료!</h2>
            <p className="text-white/60">
              {content.nextContent ? '다음 콘텐츠로 이동합니다...' : '커리큘럼으로 돌아갑니다...'}
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/curriculum')}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm text-white/40">{content.module.weekNumber}주차 · {content.module.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Free Badge for first content */}
            {content.contentIndex === 0 && (
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                무료
              </span>
            )}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'text-accent-purple bg-accent-purple/10' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-6xl mx-auto">
          {/* Video Player Area */}
          <div className="aspect-video bg-[#121212] flex items-center justify-center relative">
            {/* Blur overlay for subscription required content */}
            {content.requiresSubscription && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-purple/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">프리미엄 콘텐츠</h3>
                  <p className="text-white/50 mb-4">구독하고 모든 콘텐츠를 이용하세요</p>
                  <button
                    onClick={() => setShowPaywall(true)}
                    className="px-6 py-2 rounded-lg bg-accent-purple text-white font-medium"
                  >
                    구독하기
                  </button>
                </div>
              </div>
            )}

            {/* Mock Video Player */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-primary/5" />
            <div className="relative text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white/40 text-sm">영상 플레이어 (프로토타입)</p>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div className="h-full w-1/3 bg-accent-purple" />
            </div>
          </div>

          {/* Content Info */}
          <div className="px-4 py-8 lg:flex lg:gap-8">
            {/* Main Column */}
            <div className="lg:flex-1">
              {/* Title & Meta */}
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {content.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-white/50">
                <span>{content.creator}</span>
                <span>•</span>
                <span>{content.duration}</span>
                <span>•</span>
                <span className="capitalize">{content.type}</span>
                {content.contentIndex > 0 && !isSubscribed && (
                  <>
                    <span>•</span>
                    <span className="text-accent-purple font-medium">프리미엄</span>
                  </>
                )}
              </div>

              {/* Completion Status */}
              {content.isCompleted && (
                <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 w-fit">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">학습 완료</span>
                </div>
              )}

              {/* Creator Info */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl">
                    👨‍💼
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-0.5">{content.creator}</h3>
                    <p className="text-sm text-accent-purple mb-2">콘텐츠 제작자</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 border-b border-white/10 mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 text-sm font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'text-white border-b-2 border-accent-purple'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  개요
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-3 text-sm font-medium transition-colors ${
                    activeTab === 'notes'
                      ? 'text-white border-b-2 border-accent-purple'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  노트
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' ? (
                <div>
                  <h4 className="font-semibold text-white mb-3">콘텐츠 소개</h4>
                  <p className="text-white/60 leading-relaxed mb-6">
                    {content.description || `${content.title}에 대해 학습합니다. 실제 창업 현장에서 바로 적용할 수 있는 실용적인 내용을 담고 있습니다.`}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] border-dashed">
                    <div className="text-center">
                      <svg className="w-10 h-10 text-white/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <p className="text-white/40 mb-4">아직 작성한 노트가 없습니다</p>
                      <button className="px-4 py-2 rounded-lg bg-white/5 text-sm text-white/60 hover:bg-white/10 transition-colors">
                        노트 작성하기
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Complete Button - Show subscription CTA or complete button */}
              {!content.isCompleted && (
                content.requiresSubscription ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPaywall(true)}
                    className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-accent-purple to-primary text-white font-semibold text-lg"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      구독하고 학습하기
                    </span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleComplete}
                    disabled={isCompleting}
                    className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-accent-purple to-primary text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCompleting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        처리 중...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        학습 완료하기
                      </span>
                    )}
                  </motion.button>
                )
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 mt-10 lg:mt-0">
              {/* Subscription Status */}
              {isSubscribed && (
                <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 mb-6">
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    프리미엄 구독 중
                  </div>
                </div>
              )}

              {/* Next in Curriculum */}
              {content.nextContent && (
                <div
                  onClick={handleNextContent}
                  className="p-4 rounded-2xl bg-accent-purple/5 border border-accent-purple/20 mb-6 cursor-pointer hover:bg-accent-purple/10 transition-colors"
                >
                  <div className="flex items-center gap-2 text-accent-purple text-sm font-medium mb-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                    <span>다음 콘텐츠</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-xl">
                      🎬
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{content.nextContent.title}</p>
                      <p className="text-xs text-white/40">{content.nextContent.creator} · {content.nextContent.duration}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Module Info */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <h4 className="font-semibold text-white mb-3">{content.module.weekNumber}주차</h4>
                <p className="text-sm text-white/60">{content.module.title}</p>
                <button
                  onClick={() => router.push('/curriculum')}
                  className="mt-4 w-full py-2 rounded-lg bg-white/5 text-sm text-white/60 hover:bg-white/10 transition-colors"
                >
                  커리큘럼 보기
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Bottom Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/[0.06] lg:hidden">
        {content.requiresSubscription ? (
          <button
            onClick={() => setShowPaywall(true)}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-primary text-white font-medium"
          >
            구독하고 학습하기
          </button>
        ) : content.isCompleted ? (
          content.nextContent ? (
            <button
              onClick={handleNextContent}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-primary text-white font-medium"
            >
              다음 콘텐츠
            </button>
          ) : (
            <button
              onClick={() => router.push('/curriculum')}
              className="w-full px-6 py-3 rounded-xl bg-white/10 text-white font-medium"
            >
              커리큘럼으로 돌아가기
            </button>
          )
        ) : (
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-primary text-white font-medium disabled:opacity-50"
          >
            {isCompleting ? '처리 중...' : '✓ 학습 완료하기'}
          </button>
        )}
      </div>
    </div>
  )
}
