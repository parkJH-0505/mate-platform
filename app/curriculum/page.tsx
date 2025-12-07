'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useAuth } from '@/hooks/useAuth'

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

interface ProgressData {
  totalContents: number
  completedContents: number
  progressPercent: number
  completedIds: string[]
}

// 산업별 라벨 매핑
const INDUSTRY_LABELS: Record<string, string> = {
  'tech': 'IT/소프트웨어',
  'IT/소프트웨어': 'IT/소프트웨어',
  'ecommerce': '이커머스/커머스',
  '이커머스/커머스': '이커머스/커머스',
  'fnb': 'F&B/요식업',
  'F&B/요식업': 'F&B/요식업',
  'content': '콘텐츠/미디어',
  '콘텐츠/미디어': '콘텐츠/미디어',
  'education': '교육/에듀테크',
  '교육/에듀테크': '교육/에듀테크',
  'health': '헬스케어/바이오',
  '헬스케어/바이오': '헬스케어/바이오',
  'finance': '핀테크/금융',
  '핀테크/금융': '핀테크/금융',
  'other': '기타',
}

// 단계별 라벨 매핑
const STAGE_LABELS: Record<string, string> = {
  'idea': '아이디어 단계',
  '아이디어 단계': '아이디어 단계',
  '아이디어만 있음': '아이디어 단계',
  'validation': 'PMF 검증 중',
  'PMF 검증 중': 'PMF 검증 중',
  'mvp': 'MVP 개발/출시',
  'MVP 개발/출시': 'MVP 개발/출시',
  'growth': '초기 성장',
  '초기 성장': '초기 성장',
  'scale': '스케일업',
  '스케일업': '스케일업',
}

function CurriculumContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSignupBanner, setShowSignupBanner] = useState(false)

  const { sessionId, setCurriculumId } = useOnboardingStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const curriculumId = searchParams.get('id')

        // 특정 ID가 있으면 해당 커리큘럼, 없으면 최근 커리큘럼
        const endpoint = curriculumId
          ? `/api/curriculum/${curriculumId}`
          : `/api/curriculum/latest?sessionId=${sessionId}`

        const response = await fetch(endpoint)

        if (!response.ok) {
          if (response.status === 404) {
            // 커리큘럼이 없으면 온보딩으로
            router.push('/onboarding')
            return
          }
          throw new Error('커리큘럼을 불러오는데 실패했습니다')
        }

        const data = await response.json()

        if (data.success && data.curriculum) {
          // Store curriculumId
          setCurriculumId(data.curriculum.id)

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

          // Fetch progress
          if (sessionId) {
            const progressResponse = await fetch(
              `/api/progress?curriculumId=${data.curriculum.id}&sessionId=${sessionId}`
            )
            if (progressResponse.ok) {
              const progressData = await progressResponse.json()
              if (progressData.success) {
                setProgress(progressData.progress)
              }
            }
          }

          // Show signup banner for anonymous users after curriculum is loaded
          if (!isAuthenticated && !authLoading && sessionId) {
            setTimeout(() => setShowSignupBanner(true), 2000)
          }
        }
      } catch (err) {
        console.error('Error fetching curriculum:', err)
        setError(err instanceof Error ? err.message : '오류가 발생했습니다')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams, sessionId, router, setCurriculumId, isAuthenticated, authLoading])

  const handleContentClick = (contentId: string) => {
    router.push(`/content/${contentId}`)
  }

  const isContentCompleted = (contentId: string) => {
    return progress?.completedIds.includes(contentId) ?? false
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
          {isAuthenticated ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              대시보드
            </button>
          ) : (
            <button
              onClick={() => router.push('/login?redirect=/curriculum')}
              className="px-4 py-2 rounded-lg bg-accent-purple/10 text-accent-purple text-sm font-medium hover:bg-accent-purple/20 transition-colors"
            >
              로그인
            </button>
          )}
        </div>
      </header>

      {/* Signup Banner for Anonymous Users */}
      {showSignupBanner && !isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 left-0 right-0 z-40 p-4"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-accent-purple/20 to-primary/20 border border-accent-purple/30 p-4">
              <button
                onClick={() => setShowSignupBanner(false)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">학습 진행 상황을 저장하세요</p>
                  <p className="text-xs text-white/50">로그인하면 언제든 이어서 학습할 수 있어요</p>
                </div>
                <button
                  onClick={() => router.push('/login?redirect=/curriculum')}
                  className="px-4 py-2 rounded-lg bg-accent-purple text-white text-sm font-medium hover:bg-accent-purple/90 transition-colors flex-shrink-0"
                >
                  로그인
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="pt-20 pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 개인화 요약 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-purple/20 via-primary/10 to-transparent border border-accent-purple/30 p-6 sm:p-8 mb-6"
          >
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />

            <div className="relative">
              <div className="flex items-center gap-2 text-accent-purple mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">AI 맞춤 로드맵 생성 완료</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {curriculum.userName || '창업자'}님의<br />
                <span className="bg-gradient-to-r from-accent-purple via-primary to-accent-blue bg-clip-text text-transparent">
                  {curriculum.durationWeeks}주 로드맵
                </span>
              </h1>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70">
                  {INDUSTRY_LABELS[curriculum.industry] || curriculum.industry}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70">
                  {STAGE_LABELS[curriculum.stage] || curriculum.stage}
                </span>
              </div>

              {/* 주차별 로드맵 미리보기 */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                {curriculum.modules.map((module, idx) => {
                  const moduleCompleted = module.contents.every(c => isContentCompleted(c.id))
                  const isCurrent = !moduleCompleted && (idx === 0 || curriculum.modules[idx - 1].contents.every(c => isContentCompleted(c.id)))

                  return (
                    <React.Fragment key={module.id}>
                      <div className={`
                        flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium
                        ${moduleCompleted
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : isCurrent
                            ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                            : 'bg-white/5 text-white/40 border border-white/10'
                        }
                      `}>
                        <div className="flex items-center gap-1">
                          {moduleCompleted && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span>Week {module.week}</span>
                        </div>
                        <div className="text-[10px] opacity-70 mt-0.5 truncate max-w-[80px]">
                          {module.title}
                        </div>
                      </div>
                      {idx < curriculum.modules.length - 1 && (
                        <div className={`w-4 h-0.5 flex-shrink-0 ${
                          moduleCompleted ? 'bg-green-500/50' : 'bg-white/10'
                        }`} />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>

              {/* Progress Bar */}
              {progress && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/60">전체 진행률</span>
                    <span className="text-accent-purple font-medium">
                      {progress.completedContents}/{progress.totalContents} 완료 ({progress.progressPercent}%)
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.progressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-accent-purple to-primary rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* 오늘의 한 발 카드 */}
          {(() => {
            const firstIncomplete = curriculum.modules
              .flatMap(m => m.contents)
              .find(c => !isContentCompleted(c.id))

            const currentModule = curriculum.modules.find(m =>
              m.contents.some(c => !isContentCompleted(c.id))
            )

            if (firstIncomplete && currentModule) {
              // 해당 콘텐츠의 예상 시간 파싱 (예: "12분" -> 12)
              const durationMatch = firstIncomplete.duration.match(/(\d+)/)
              const contentDuration = durationMatch ? parseInt(durationMatch[1]) : 10
              const totalTime = contentDuration + 10 // 콘텐츠 시간 + 실행 시간

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="rounded-2xl bg-gradient-to-br from-green-500/10 to-accent-purple/10 border border-green-500/20 p-6 mb-8"
                >
                  <div className="flex items-center gap-2 text-green-400 mb-4">
                    <span className="text-xl">👟</span>
                    <span className="font-semibold">오늘의 한 발</span>
                    <span className="ml-auto text-sm text-white/40">약 {totalTime}분</span>
                  </div>

                  <p className="text-white/70 text-sm mb-4">
                    오늘 {totalTime}분이면, 한 칸 더 나아갈 수 있어요
                  </p>

                  <div className="space-y-3 mb-4">
                    {/* 학습 */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/40 mb-0.5">학습</p>
                        <p className="text-sm text-white font-medium truncate">{firstIncomplete.title}</p>
                        <p className="text-xs text-white/40">{firstIncomplete.duration}</p>
                      </div>
                    </div>

                    {/* 실행 */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/40 mb-0.5">실행</p>
                        <p className="text-sm text-white font-medium">배운 내용 한 줄 정리하기</p>
                        <p className="text-xs text-white/40">약 10분</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleContentClick(firstIncomplete.id)}
                    className="
                      w-full py-4 rounded-xl
                      bg-gradient-to-r from-accent-purple to-primary
                      text-white font-semibold text-lg
                      transition-all duration-300
                      hover:shadow-[0_0_30px_rgba(147,97,253,0.4)]
                      hover:scale-[1.01]
                      active:scale-[0.99]
                    "
                  >
                    오늘의 한 발 시작하기
                  </button>

                  <p className="mt-3 text-center text-xs text-white/30">
                    이 한 걸음으로, {curriculum.goal} 목표에 한 발 더 가까워져요
                  </p>
                </motion.div>
              )
            } else {
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 p-6 mb-8 text-center"
                >
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-xl font-bold text-green-400 mb-2">
                    모든 학습을 완료했습니다!
                  </h3>
                  <p className="text-white/60 text-sm">
                    {curriculum.userName}님, 정말 대단해요. 이제 실전에서 적용해보세요!
                  </p>
                </motion.div>
              )
            }
          })()}

          {/* Curriculum Modules */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">커리큘럼</h2>

            {curriculum.modules.map((module, index) => {
              const moduleCompleted = module.contents.every(c => isContentCompleted(c.id))
              const moduleProgress = module.contents.filter(c => isContentCompleted(c.id)).length

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`
                    rounded-2xl border overflow-hidden
                    ${moduleCompleted
                      ? 'bg-green-500/5 border-green-500/20'
                      : module.status === 'current'
                        ? 'bg-white/[0.03] border-accent-purple/30'
                        : 'bg-white/[0.01] border-white/[0.06]'
                    }
                  `}
                >
                  {/* Module Header */}
                  <div className="p-6 border-b border-white/[0.06]">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-medium
                          ${moduleCompleted
                            ? 'bg-green-500/20 text-green-400'
                            : module.status === 'current'
                              ? 'bg-accent-purple/20 text-accent-purple'
                              : 'bg-white/5 text-white/40'
                          }
                        `}>
                          {module.week}주차
                        </span>
                        {moduleCompleted && (
                          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-white/30">
                        {moduleProgress}/{module.contents.length} 완료
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{module.title}</h3>
                    <p className="text-sm text-white/50">{module.description}</p>
                  </div>

                  {/* Module Contents */}
                  <div className="p-4 space-y-2">
                    {module.contents.map((content) => {
                      const completed = isContentCompleted(content.id)

                      return (
                        <div
                          key={content.id}
                          className={`
                            flex items-center gap-4 p-3 rounded-xl transition-colors cursor-pointer
                            ${completed
                              ? 'bg-green-500/5 hover:bg-green-500/10'
                              : 'bg-white/[0.02] hover:bg-white/[0.04]'
                            }
                          `}
                          onClick={() => handleContentClick(content.id)}
                        >
                          {/* Completion Indicator */}
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center text-xl
                            ${completed ? 'bg-green-500/20' : 'bg-white/5'}
                          `}>
                            {completed ? (
                              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              content.thumbnail
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${completed ? 'text-white/60' : 'text-white'}`}>
                              {content.title}
                            </p>
                            <p className="text-xs text-white/40">{content.creator} · {content.duration}</p>
                          </div>
                          <svg className="w-5 h-5 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
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

      {/* Floating CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent">
        <div className="max-w-4xl mx-auto">
          {(() => {
            const firstIncomplete = curriculum.modules
              .flatMap(m => m.contents)
              .find(c => !isContentCompleted(c.id))

            if (firstIncomplete) {
              return (
                <button
                  onClick={() => handleContentClick(firstIncomplete.id)}
                  className="
                    w-full py-4 rounded-xl
                    bg-gradient-to-r from-accent-purple to-primary
                    text-white font-semibold text-lg
                    transition-all duration-300
                    hover:shadow-[0_0_30px_rgba(147,97,253,0.4)]
                    flex items-center justify-center gap-2
                  "
                >
                  <span className="text-xl">👟</span>
                  {progress && progress.completedContents > 0 ? '오늘의 한 발 계속하기' : '오늘의 한 발 시작하기'}
                </button>
              )
            } else {
              return (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 font-semibold text-lg flex items-center justify-center gap-2"
                >
                  🎉 대시보드에서 성과 확인하기
                </button>
              )
            }
          })()}
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
