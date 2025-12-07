'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

// 목표별 라벨 매핑
const GOAL_LABELS: Record<string, string> = {
  'validate': '아이디어 검증 완료',
  '아이디어 검증 완료': '아이디어 검증 완료',
  'launch': 'MVP 출시',
  'MVP 출시': 'MVP 출시',
  'first-customer': '첫 유료 고객 확보',
  '첫 유료 고객 확보': '첫 유료 고객 확보',
  'revenue-growth': '매출 성장',
  '매출 성장': '매출 성장',
  'funding': '투자 유치',
  '투자 유치': '투자 유치',
}

// 목표별 달성 시 얻는 것
const GOAL_OUTCOMES: Record<string, string[]> = {
  'validate': ['명확한 사업 방향성', '검증된 고객 니즈', '자신감 있는 다음 단계'],
  '아이디어 검증 완료': ['명확한 사업 방향성', '검증된 고객 니즈', '자신감 있는 다음 단계'],
  'launch': ['실제 동작하는 제품', '첫 사용자 피드백', '투자자에게 보여줄 결과물'],
  'MVP 출시': ['실제 동작하는 제품', '첫 사용자 피드백', '투자자에게 보여줄 결과물'],
  'first-customer': ['검증된 비즈니스 모델', '실제 매출 발생', '성장의 발판'],
  '첫 유료 고객 확보': ['검증된 비즈니스 모델', '실제 매출 발생', '성장의 발판'],
  'revenue-growth': ['안정적인 수익 구조', '스케일업 준비 완료', '투자 유치 조건 충족'],
  '매출 성장': ['안정적인 수익 구조', '스케일업 준비 완료', '투자 유치 조건 충족'],
  'funding': ['사업 확장 자금', '검증된 비즈니스 모델', '더 큰 도전의 기회'],
  '투자 유치': ['사업 확장 자금', '검증된 비즈니스 모델', '더 큰 도전의 기회'],
}

interface CurriculumModule {
  weekNumber: number
  title: string
  description: string
  contents: Array<{ id: string; title: string; type: string; duration: string }>
}

interface RoadmapModalProps {
  isOpen: boolean
  onClose: () => void
  onStartLearning: () => void
  curriculum: {
    userName: string
    industry: string
    stage: string
    goal: string
    durationWeeks: number
    modules: CurriculumModule[]
    totalContents: number
  } | null
}

// 스텝별 컴포넌트
type Step = 'intro' | 'analysis' | 'roadmap' | 'outcome' | 'ready'

export const RoadmapModal: React.FC<RoadmapModalProps> = ({
  isOpen,
  onClose,
  onStartLearning,
  curriculum,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('intro')
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // 자동 진행
  useEffect(() => {
    if (!isOpen || !isAutoPlaying) return

    const timings: Record<Step, number> = {
      intro: 2500,
      analysis: 3500,
      roadmap: 4000,
      outcome: 3500,
      ready: 0, // 마지막은 자동 진행 안함
    }

    const timeout = setTimeout(() => {
      if (currentStep === 'intro') setCurrentStep('analysis')
      else if (currentStep === 'analysis') setCurrentStep('roadmap')
      else if (currentStep === 'roadmap') setCurrentStep('outcome')
      else if (currentStep === 'outcome') setCurrentStep('ready')
    }, timings[currentStep])

    return () => clearTimeout(timeout)
  }, [isOpen, currentStep, isAutoPlaying])

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('intro')
      setIsAutoPlaying(true)
    }
  }, [isOpen])

  if (!curriculum) return null

  const industryLabel = INDUSTRY_LABELS[curriculum.industry] || curriculum.industry
  const stageLabel = STAGE_LABELS[curriculum.stage] || curriculum.stage
  const goalLabel = GOAL_LABELS[curriculum.goal] || curriculum.goal
  const outcomes = GOAL_OUTCOMES[curriculum.goal] || GOAL_OUTCOMES['validate']

  const handleSkip = () => {
    setIsAutoPlaying(false)
    setCurrentStep('ready')
  }

  const stepVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#0a0a0a]"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent-purple/20 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px]"
            />
          </div>

          {/* Skip Button */}
          {currentStep !== 'ready' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={handleSkip}
              className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/5 text-white/40 text-sm hover:bg-white/10 hover:text-white/60 transition-colors z-10"
            >
              건너뛰기
            </motion.button>
          )}

          {/* Close Button - only on ready step */}
          {currentStep === 'ready' && (
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
            >
              <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-6 overflow-y-auto">
            <div className="w-full max-w-2xl mx-auto py-12">
              <AnimatePresence mode="wait">
                {/* Step 1: Intro - 환영 */}
                {currentStep === 'intro' && (
                  <motion.div
                    key="intro"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-accent-purple to-primary flex items-center justify-center"
                    >
                      <span className="text-5xl">🎉</span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-3xl sm:text-4xl font-bold text-white mb-4"
                    >
                      {curriculum.userName}님,<br />
                      <span className="bg-gradient-to-r from-accent-purple to-primary bg-clip-text text-transparent">
                        맞춤 로드맵이 완성되었어요!
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-lg text-white/60"
                    >
                      AI가 당신만을 위한 학습 경로를 설계했어요
                    </motion.p>

                    {/* Loading indicator */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="mt-12 flex items-center justify-center gap-2"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-accent-purple"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 rounded-full bg-accent-purple"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 rounded-full bg-accent-purple"
                      />
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 2: Analysis - 분석 결과 */}
                {currentStep === 'analysis' && (
                  <motion.div
                    key="analysis"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-accent-purple font-medium mb-4"
                    >
                      AI 분석 결과
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl sm:text-3xl font-bold text-white mb-8"
                    >
                      {curriculum.userName}님의 현재 상황을<br />
                      이렇게 파악했어요
                    </motion.h2>

                    <div className="space-y-4 max-w-md mx-auto">
                      {/* 산업 */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10"
                      >
                        <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center text-2xl">
                          🏢
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-white/40 mb-1">산업 분야</p>
                          <p className="text-lg font-semibold text-white">{industryLabel}</p>
                        </div>
                      </motion.div>

                      {/* 단계 */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl">
                          📍
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-white/40 mb-1">현재 단계</p>
                          <p className="text-lg font-semibold text-white">{stageLabel}</p>
                        </div>
                      </motion.div>

                      {/* 목표 */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-accent-purple/10 to-primary/10 border border-accent-purple/20"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-accent-purple to-primary flex items-center justify-center text-2xl">
                          🎯
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-white/40 mb-1">3개월 목표</p>
                          <p className="text-lg font-semibold text-white">{goalLabel}</p>
                        </div>
                      </motion.div>
                    </div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="mt-8 text-white/40 text-sm"
                    >
                      이 정보를 바탕으로 최적의 학습 경로를 설계했어요
                    </motion.p>
                  </motion.div>
                )}

                {/* Step 3: Roadmap - 로드맵 공개 */}
                {currentStep === 'roadmap' && (
                  <motion.div
                    key="roadmap"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-accent-purple font-medium mb-4"
                    >
                      {curriculum.userName}님만을 위한
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl sm:text-3xl font-bold text-white mb-2"
                    >
                      <span className="bg-gradient-to-r from-accent-purple to-primary bg-clip-text text-transparent">
                        {curriculum.durationWeeks}주 맞춤 로드맵
                      </span>
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-white/50 mb-10"
                    >
                      총 {curriculum.totalContents}개 콘텐츠 · 하루 15분이면 충분해요
                    </motion.p>

                    {/* 주차별 카드 */}
                    <div className="space-y-4 max-w-lg mx-auto">
                      {curriculum.modules.map((module, idx) => (
                        <motion.div
                          key={module.weekNumber || idx}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + idx * 0.2 }}
                          className={`
                            flex items-center gap-4 p-4 rounded-2xl text-left
                            ${idx === 0
                              ? 'bg-gradient-to-r from-accent-purple/20 to-primary/10 border border-accent-purple/30'
                              : 'bg-white/5 border border-white/10'
                            }
                          `}
                        >
                          <div className={`
                            w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg
                            ${idx === 0
                              ? 'bg-gradient-to-r from-accent-purple to-primary text-white'
                              : 'bg-white/10 text-white/60'
                            }
                          `}>
                            W{module.weekNumber || idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold ${idx === 0 ? 'text-white' : 'text-white/80'}`}>
                              {module.title}
                            </p>
                            <p className="text-sm text-white/40 truncate">
                              {module.description || `${module.contents?.length || 0}개 콘텐츠`}
                            </p>
                          </div>
                          {idx === 0 && (
                            <span className="px-3 py-1 rounded-full bg-accent-purple/30 text-accent-purple text-xs font-medium">
                              시작
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Outcome - 이걸 하면 얻는 것 */}
                {currentStep === 'outcome' && (
                  <motion.div
                    key="outcome"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-green-400 font-medium mb-4"
                    >
                      {curriculum.durationWeeks}주 후, {curriculum.userName}님은
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl sm:text-3xl font-bold text-white mb-10"
                    >
                      이런 것들을 얻게 돼요
                    </motion.h2>

                    <div className="space-y-4 max-w-md mx-auto">
                      {outcomes.map((outcome, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + idx * 0.2 }}
                          className="flex items-center gap-4 p-5 rounded-2xl bg-green-500/10 border border-green-500/20"
                        >
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-lg font-medium text-white text-left">{outcome}</p>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="mt-10 p-4 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <p className="text-white/60 text-sm">
                        비슷한 상황의 창업자들이 이 로드맵으로<br />
                        <span className="text-accent-purple font-semibold">평균 2.3배 빠르게</span> 목표에 도달했어요
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 5: Ready - 시작 준비 */}
                {currentStep === 'ready' && (
                  <motion.div
                    key="ready"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-r from-accent-purple to-primary flex items-center justify-center"
                    >
                      <span className="text-4xl">👟</span>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl sm:text-3xl font-bold text-white mb-4"
                    >
                      준비 완료!<br />
                      <span className="bg-gradient-to-r from-accent-purple to-primary bg-clip-text text-transparent">
                        첫 걸음을 시작해볼까요?
                      </span>
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/50 mb-4"
                    >
                      하루 15분, 작은 한 걸음이 큰 변화를 만들어요
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-white/30 text-sm mb-10"
                    >
                      이 한 걸음으로, <span className="text-accent-purple">{goalLabel}</span> 목표에 가까워져요
                    </motion.p>

                    {/* Summary Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="max-w-md mx-auto p-6 rounded-2xl bg-white/5 border border-white/10 mb-8"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white/60 text-sm">나의 로드맵</span>
                        <span className="text-accent-purple font-semibold">{curriculum.durationWeeks}주 코스</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white/60 text-sm">총 콘텐츠</span>
                        <span className="text-white font-semibold">{curriculum.totalContents}개</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">예상 시간</span>
                        <span className="text-white font-semibold">하루 15분</span>
                      </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      onClick={onStartLearning}
                      className="
                        w-full max-w-md mx-auto py-5 rounded-2xl
                        bg-gradient-to-r from-accent-purple to-primary
                        text-white font-bold text-xl
                        hover:shadow-[0_0_40px_rgba(147,97,253,0.5)]
                        transition-all duration-300
                        flex items-center justify-center gap-3
                      "
                    >
                      <span className="text-2xl">👟</span>
                      오늘의 한 발 시작하기
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      onClick={onClose}
                      className="mt-4 text-white/40 text-sm hover:text-white/60 transition-colors"
                    >
                      나중에 할게요
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Indicator */}
            {currentStep !== 'ready' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
              >
                {(['intro', 'analysis', 'roadmap', 'outcome', 'ready'] as Step[]).map((step, idx) => (
                  <div
                    key={step}
                    className={`
                      h-1.5 rounded-full transition-all duration-300
                      ${step === currentStep
                        ? 'w-8 bg-accent-purple'
                        : idx < ['intro', 'analysis', 'roadmap', 'outcome', 'ready'].indexOf(currentStep)
                          ? 'w-4 bg-accent-purple/50'
                          : 'w-4 bg-white/20'
                      }
                    `}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
