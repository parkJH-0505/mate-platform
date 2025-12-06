'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboardingStore'

interface CurriculumContent {
  id: string
  title: string
  creator: string
  duration: string
  type: string
  thumbnail: string
}

interface CurriculumModule {
  id: string
  week: number
  title: string
  description: string
  contents: CurriculumContent[]
  status?: 'current' | 'locked'
}

interface Curriculum {
  id: string
  title: string
  description: string
  reasoning: string[]
  industry: string
  stage: string
  goal: string
  userName: string
  durationWeeks: number
  modules: CurriculumModule[]
}

function CurriculumContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPaywall, setShowPaywall] = useState(false)
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { sessionId } = useOnboardingStore()

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const curriculumId = searchParams.get('id')

        // 특정 ID가 있으면 해당 커리큘럼, 없으면 최근 커리큘럼
        const endpoint = curriculumId
          ? `/api/curriculum/${curriculumId}`
          : `/api/curriculum/latest?sessionId=${sessionId}`

        const response = await fetch(endpoint)

        if (!response.ok) {
          if (response.status === 404) {
            // 커리큘럼이 없으면 생성 페이지로
            router.push('/curriculum/generating')
            return
          }
          throw new Error('커리큘럼을 불러오는데 실패했습니다')
        }

        const data = await response.json()

        if (data.success && data.curriculum) {
          // 첫 번째 모듈은 current, 나머지는 locked
          const modulesWithStatus = data.curriculum.modules.map(
            (module: CurriculumModule, index: number) => ({
              ...module,
              status: index === 0 ? 'current' : 'locked'
            })
          )

          setCurriculum({
            ...data.curriculum,
            modules: modulesWithStatus
          })
        }
      } catch (err) {
        console.error('Error fetching curriculum:', err)
        setError(err instanceof Error ? err.message : '오류가 발생했습니다')
      } finally {
        setLoading(false)
      }
    }

    fetchCurriculum()
  }, [searchParams, sessionId, router])

  const handleStartLearning = () => {
    setShowPaywall(true)
  }

  const handleSubscribe = () => {
    router.push('/subscribe')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">커리큘럼을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !curriculum) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white mb-4">
            {error || '커리큘럼을 찾을 수 없습니다'}
          </h1>
          <button
            onClick={() => router.push('/onboarding')}
            className="px-6 py-3 rounded-xl bg-accent-purple text-white"
          >
            커리큘럼 만들기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-2xl font-bold bg-gradient-to-r from-accent-purple to-primary bg-clip-text text-transparent"
          >
            MATE
          </button>
          <button
            onClick={() => router.push('/login')}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            로그인
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Wow Moment Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-purple/20 via-primary/10 to-transparent border border-accent-purple/30 p-8 sm:p-12 mb-10"
          >
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />

            <div className="relative">
              <div className="flex items-center gap-2 text-accent-purple mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">AI 커리큘럼 생성 완료</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {curriculum.userName || '창업자'}님을 위한<br />
                <span className="bg-gradient-to-r from-accent-purple via-primary to-accent-blue bg-clip-text text-transparent">
                  맞춤 커리큘럼
                </span>이 준비되었습니다
              </h1>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
                  {curriculum.industry}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
                  {curriculum.stage}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-sm text-accent-purple">
                  목표: {curriculum.goal}
                </span>
              </div>

              <p className="text-white/50 mb-8">
                {curriculum.durationWeeks}주 과정 · {curriculum.modules.reduce((acc, m) => acc + m.contents.length, 0)}개 콘텐츠 · AI 추천
              </p>

              <button
                onClick={handleStartLearning}
                className="
                  px-8 py-4 rounded-xl
                  bg-gradient-to-r from-accent-purple to-primary
                  text-white font-semibold text-lg
                  transition-all duration-300
                  hover:shadow-[0_0_30px_rgba(147,97,253,0.4)]
                  hover:scale-[1.02]
                  active:scale-[0.98]
                "
              >
                학습 시작하기
              </button>
            </div>
          </motion.div>

          {/* Curriculum Modules */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">커리큘럼 미리보기</h2>

            {curriculum.modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`
                  rounded-2xl border overflow-hidden
                  ${module.status === 'current'
                    ? 'bg-white/[0.03] border-accent-purple/30'
                    : 'bg-white/[0.01] border-white/[0.06] opacity-60'
                  }
                `}
              >
                {/* Module Header */}
                <div className="p-6 border-b border-white/[0.06]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${module.status === 'current'
                          ? 'bg-accent-purple/20 text-accent-purple'
                          : 'bg-white/5 text-white/40'
                        }
                      `}>
                        {module.week}주차
                      </span>
                      {module.status === 'locked' && (
                        <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-white/30">
                      {module.contents.length}개 콘텐츠
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{module.title}</h3>
                  <p className="text-sm text-white/50">{module.description}</p>
                </div>

                {/* Module Contents */}
                <div className="p-4 space-y-2">
                  {module.contents.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                      onClick={() => module.status === 'current' && setShowPaywall(true)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl">
                        {content.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{content.title}</p>
                        <p className="text-xs text-white/40">{content.creator} · {content.duration}</p>
                      </div>
                      {module.status === 'locked' ? (
                        <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Why This Curriculum */}
          <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <svg className="w-5 h-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              왜 이 커리큘럼인가요?
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              {curriculum.reasoning && curriculum.reasoning.length > 0 ? (
                curriculum.reasoning.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-accent-purple">•</span>
                    <span>{reason}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-purple">•</span>
                    <span><strong className="text-white/80">{curriculum.industry}</strong> 산업에서 <strong className="text-white/80">{curriculum.stage}</strong> 단계에 있는 분들에게 최적화된 순서입니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-purple">•</span>
                    <span>3개월 내 <strong className="text-white/80">{curriculum.goal}</strong> 목표 달성을 위해 설계되었습니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-purple">•</span>
                    <span>비슷한 상황의 창업자들이 가장 효과를 본 콘텐츠 순서로 정렬했습니다.</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </main>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md p-8 rounded-3xl bg-[#121212] border border-white/10"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-primary/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                콘텐츠 잠금 해제
              </h2>
              <p className="text-white/50 mb-8">
                구독을 시작하면 모든 콘텐츠를<br />무제한으로 학습할 수 있습니다.
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="text-4xl font-bold text-white mb-1">
                  월 17,000원
                </div>
                <p className="text-sm text-white/40">
                  커피 3잔 가격으로 무제한 학습
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 text-left mb-8">
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <svg className="w-5 h-5 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>500+ 큐레이션된 콘텐츠 무제한</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <svg className="w-5 h-5 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>AI 맞춤 커리큘럼 지속 업데이트</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <svg className="w-5 h-5 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>언제든 해지 가능</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleSubscribe}
                className="
                  w-full py-4 rounded-xl
                  bg-gradient-to-r from-accent-purple to-primary
                  text-white font-semibold text-lg
                  transition-all duration-300
                  hover:shadow-[0_0_30px_rgba(147,97,253,0.4)]
                "
              >
                구독 시작하기
              </button>

              <p className="mt-4 text-xs text-white/30">
                7일 무료 체험 후 자동 결제
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleStartLearning}
            className="
              w-full py-4 rounded-xl
              bg-gradient-to-r from-accent-purple to-primary
              text-white font-semibold text-lg
              transition-all duration-300
              hover:shadow-[0_0_30px_rgba(147,97,253,0.4)]
            "
          >
            지금 학습 시작하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CurriculumPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CurriculumContent />
    </Suspense>
  )
}
