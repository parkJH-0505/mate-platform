'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useAuth } from '@/hooks/useAuth'

// 온보딩 데이터를 localStorage에 백업 (새로고침 대비)
const ONBOARDING_BACKUP_KEY = 'mate_onboarding_backup'

// 온보딩 스텝 정의
const STEPS = [
  {
    id: 'industry',
    title: '어떤 산업에서 창업하시나요?',
    subtitle: '당신의 산업에 맞는 콘텐츠를 추천해드립니다',
    options: [
      { id: 'tech', label: 'IT/소프트웨어', icon: '💻' },
      { id: 'ecommerce', label: '이커머스/커머스', icon: '🛒' },
      { id: 'fnb', label: 'F&B/요식업', icon: '🍽️' },
      { id: 'content', label: '콘텐츠/미디어', icon: '📱' },
      { id: 'education', label: '교육/에듀테크', icon: '📚' },
      { id: 'health', label: '헬스케어/바이오', icon: '🏥' },
      { id: 'finance', label: '핀테크/금융', icon: '💰' },
      { id: 'other', label: '기타', icon: '🌐' },
    ]
  },
  {
    id: 'stage',
    title: '현재 어떤 단계에 있나요?',
    subtitle: '단계에 맞는 커리큘럼을 생성합니다',
    options: [
      { id: 'idea', label: '아이디어만 있음', description: '아직 구체화되지 않은 상태', icon: '💡' },
      { id: 'validation', label: 'PMF 검증 중', description: '고객 인터뷰, MVP 테스트 중', icon: '🔍' },
      { id: 'mvp', label: 'MVP 개발/출시', description: '첫 제품을 만들고 있거나 출시함', icon: '🚀' },
      { id: 'growth', label: '초기 성장', description: '첫 고객 확보, 매출 발생', icon: '📈' },
      { id: 'scale', label: '스케일업', description: '투자 유치, 팀 확장 중', icon: '🌟' },
    ]
  },
  {
    id: 'concerns',
    title: '지금 가장 고민되는 것은?',
    subtitle: '복수 선택 가능합니다 (최대 3개)',
    multiSelect: true,
    maxSelect: 3,
    options: [
      { id: 'idea-validation', label: '아이디어 검증', icon: '🎯' },
      { id: 'customer-discovery', label: '고객 발굴', icon: '👥' },
      { id: 'product-development', label: '제품 개발', icon: '⚙️' },
      { id: 'marketing', label: '마케팅/홍보', icon: '📣' },
      { id: 'sales', label: '영업/세일즈', icon: '🤝' },
      { id: 'funding', label: '투자 유치', icon: '💵' },
      { id: 'team-building', label: '팀 빌딩', icon: '👨‍👩‍👧‍👦' },
      { id: 'legal', label: '법률/행정', icon: '📋' },
    ]
  },
  {
    id: 'goal',
    title: '3개월 후 목표는?',
    subtitle: 'MATE가 이 목표를 향해 안내합니다',
    options: [
      { id: 'validate', label: '아이디어 검증 완료', description: '시장 반응 확인', icon: '✅' },
      { id: 'launch', label: 'MVP 출시', description: '첫 제품 론칭', icon: '🚀' },
      { id: 'first-customer', label: '첫 유료 고객 확보', description: '매출 1원 만들기', icon: '🎉' },
      { id: 'revenue-growth', label: '매출 성장', description: '기존 대비 2배 성장', icon: '📊' },
      { id: 'funding', label: '투자 유치', description: 'Pre-Seed/Seed 라운드', icon: '💰' },
    ]
  },
  {
    id: 'name',
    title: '마지막으로, 이름을 알려주세요',
    subtitle: '개인화된 경험을 위해 필요합니다',
    type: 'input'
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  // Zustand 스토어
  const {
    industry,
    stage,
    concerns,
    goal,
    name,
    currentStep,
    sessionId,
    setIndustry,
    setStage,
    toggleConcern,
    setGoal,
    setName,
    setCurrentStep,
    setSessionId,
    setCompleted,
    getOnboardingData,
  } = useOnboardingStore()

  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // 온보딩 데이터가 변경될 때마다 localStorage에 백업
  useEffect(() => {
    const data = getOnboardingData()
    if (data.industry || data.stage || data.concerns?.length || data.goal || data.name) {
      localStorage.setItem(ONBOARDING_BACKUP_KEY, JSON.stringify({
        ...data,
        sessionId: isAuthenticated ? undefined : sessionId,
        timestamp: Date.now()
      }))
    }
  }, [industry, stage, concerns, goal, name, sessionId, isAuthenticated, getOnboardingData])

  // 컴포넌트 마운트 시 세션 초기화
  useEffect(() => {
    const initSession = async () => {
      setIsInitializing(true)
      setSessionError(null)

      // 로그인 상태면 세션 필요 없음
      if (isAuthenticated) {
        setIsInitializing(false)
        return
      }

      // 이미 세션이 있으면 스킵
      if (sessionId) {
        setIsInitializing(false)
        return
      }

      try {
        const res = await fetch('/api/sessions', { method: 'POST' })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || '세션 생성에 실패했습니다')
        }
        const data = await res.json()
        setSessionId(data.sessionId)
      } catch (error) {
        console.error('Failed to create session:', error)
        setSessionError(error instanceof Error ? error.message : '세션을 생성할 수 없습니다. 네트워크 연결을 확인해주세요.')
      } finally {
        setIsInitializing(false)
      }
    }

    initSession()
  }, [isAuthenticated, sessionId, setSessionId])

  // 로그인 사용자의 기존 이름 가져오기
  useEffect(() => {
    if (isAuthenticated && user?.user_metadata?.full_name && !name) {
      setName(user.user_metadata.full_name)
    }
  }, [isAuthenticated, user, name, setName])

  const step = STEPS[currentStep]
  const progress = ((currentStep + 1) / STEPS.length) * 100

  const handleSelect = (optionId: string) => {
    if (step.multiSelect) {
      toggleConcern(optionId, step.maxSelect || 3)
    } else {
      switch (step.id) {
        case 'industry':
          setIndustry(optionId)
          break
        case 'stage':
          setStage(optionId)
          break
        case 'goal':
          setGoal(optionId)
          break
      }
      // 자동으로 다음 단계로
      setTimeout(() => {
        if (currentStep < STEPS.length - 1) {
          setCurrentStep(currentStep + 1)
        }
      }, 300)
    }
  }

  const handleInputChange = (value: string) => {
    setName(value)
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleGenerateCurriculum()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGenerateCurriculum = async () => {
    setIsGenerating(true)
    setIsSaving(true)
    setSaveError(null)

    try {
      // 온보딩 데이터 저장
      const onboardingData = getOnboardingData()
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...onboardingData,
          sessionId: isAuthenticated ? undefined : sessionId,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || '온보딩 데이터 저장에 실패했습니다')
      }

      setCompleted(true)
      setIsSaving(false)

      // localStorage 백업 삭제 (성공적으로 저장됨)
      localStorage.removeItem(ONBOARDING_BACKUP_KEY)

      // 커리큘럼 생성 페이지로 이동
      setTimeout(() => {
        router.push('/curriculum/generating')
      }, 1500)
    } catch (error) {
      console.error('Onboarding save error:', error)
      setIsSaving(false)
      setIsGenerating(false)
      setSaveError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다')
    }
  }

  const handleRetry = () => {
    setSaveError(null)
    handleGenerateCurriculum()
  }

  const isNextDisabled = () => {
    if (step.type === 'input') return !name.trim()
    if (step.multiSelect) return concerns.length === 0
    switch (step.id) {
      case 'industry': return !industry
      case 'stage': return !stage
      case 'goal': return !goal
      default: return false
    }
  }

  const getSelectedValue = () => {
    switch (step.id) {
      case 'industry': return industry
      case 'stage': return stage
      case 'goal': return goal
      default: return ''
    }
  }

  // 초기화 중 로딩 화면
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50">준비 중...</p>
        </div>
      </div>
    )
  }

  // 세션 생성 에러 화면
  if (sessionError) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* Error Icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-orange-500/20" />
            <div className="absolute inset-2 rounded-full bg-[#0a0a0a] flex items-center justify-center">
              <svg className="w-12 h-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            세션을 시작할 수 없습니다
          </h2>

          <p className="text-white/60 mb-6">
            {sessionError}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-accent-purple to-primary text-white hover:shadow-[0_0_30px_rgba(147,97,253,0.4)] transition-all"
            >
              다시 시도
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-white/5 text-white/60 hover:bg-white/10 transition-all"
            >
              로그인하기
            </button>
          </div>

          <p className="mt-6 text-xs text-white/30">
            로그인하시면 세션 없이도 진행할 수 있습니다
          </p>
        </div>
      </div>
    )
  }

  // 에러 발생 시 에러 화면 표시
  if (saveError) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* Error Icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-red-500/20" />
            <div className="absolute inset-2 rounded-full bg-[#0a0a0a] flex items-center justify-center">
              <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            오류가 발생했습니다
          </h2>

          <p className="text-white/60 mb-6">
            {saveError}
          </p>

          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-accent-purple to-primary text-white hover:shadow-[0_0_30px_rgba(147,97,253,0.4)] transition-all"
            >
              다시 시도
            </button>
            <button
              onClick={() => {
                setSaveError(null)
                setCurrentStep(0)
              }}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-white/5 text-white/60 hover:bg-white/10 transition-all"
            >
              처음부터 다시하기
            </button>
          </div>

          <p className="mt-6 text-xs text-white/30">
            문제가 계속되면 support@mate.com으로 문의해주세요
          </p>
        </div>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          {/* Animated Logo */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-purple to-primary animate-spin opacity-20" />
            <div className="absolute inset-2 rounded-full bg-[#0a0a0a] flex items-center justify-center">
              <svg className="w-12 h-12 text-accent-purple animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            {name}님을 위한 커리큘럼을<br />생성하고 있습니다
          </h2>

          <div className="flex items-center justify-center gap-2 text-white/50">
            <div className="w-2 h-2 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          {isSaving && (
            <p className="mt-4 text-sm text-white/40">데이터 저장 중...</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className={`p-2 rounded-lg transition-all ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="text-sm text-white/40">
              {currentStep + 1} / {STEPS.length}
            </span>

            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-lg hover:bg-white/5 transition-all"
            >
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-purple to-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-32">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question */}
              <div className="text-center mb-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  {step.title}
                </h1>
                <p className="text-white/50">
                  {step.subtitle}
                </p>
              </div>

              {/* Options or Input */}
              {step.type === 'input' ? (
                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="이름을 입력해주세요"
                    className="
                      w-full px-6 py-4 rounded-xl
                      bg-white/5 border border-white/10
                      text-white text-lg text-center
                      placeholder:text-white/30
                      focus:outline-none focus:border-accent-purple/50
                      transition-all
                    "
                    autoFocus
                  />
                </div>
              ) : (
                <div className={`grid gap-3 ${
                  step.options && step.options.length > 5
                    ? 'grid-cols-2 sm:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2'
                }`}>
                  {step.options?.map((option) => {
                    const isSelected = step.multiSelect
                      ? concerns.includes(option.id)
                      : getSelectedValue() === option.id

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        className={`
                          p-4 rounded-xl text-left
                          border transition-all duration-200
                          ${isSelected
                            ? 'bg-accent-purple/10 border-accent-purple/50 shadow-[0_0_20px_rgba(147,97,253,0.15)]'
                            : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div className="flex-1">
                            <p className={`font-medium ${isSelected ? 'text-white' : 'text-white/80'}`}>
                              {option.label}
                            </p>
                            {option.description && (
                              <p className="text-xs text-white/40 mt-0.5">
                                {option.description}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <svg className="w-5 h-5 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {step.multiSelect && (
            <p className="text-center text-sm text-white/40 mb-3">
              {concerns.length}/{step.maxSelect || 3} 선택됨
            </p>
          )}
          <button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className={`
              w-full py-4 rounded-xl
              font-semibold text-lg
              transition-all duration-300
              ${isNextDisabled()
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-gradient-to-r from-accent-purple to-primary text-white hover:shadow-[0_0_30px_rgba(147,97,253,0.4)]'
              }
            `}
          >
            {currentStep === STEPS.length - 1 ? '커리큘럼 생성하기' : '다음'}
          </button>
        </div>
      </footer>
    </div>
  )
}
