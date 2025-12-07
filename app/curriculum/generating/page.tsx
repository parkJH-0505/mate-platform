'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useOnboardingStore } from '@/stores/onboardingStore'

const loadingMessages = [
  '온보딩 정보를 분석하고 있어요...',
  'AI가 최적의 학습 경로를 설계 중이에요...',
  '맞춤 콘텐츠를 선별하고 있어요...',
  '커리큘럼을 완성하고 있어요...'
]

export default function GeneratingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentMessage, setCurrentMessage] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const { industry, stage, concerns, goal, name, sessionId } = useOnboardingStore()

  useEffect(() => {
    // 로딩 메시지 순환
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length)
    }, 2500)

    return () => clearInterval(messageInterval)
  }, [])

  useEffect(() => {
    const generateCurriculum = async () => {
      try {
        // URL에서 온보딩 데이터 가져오기 (fallback)
        const urlIndustry = searchParams.get('industry') || industry
        const urlStage = searchParams.get('stage') || stage
        const urlGoal = searchParams.get('goal') || goal
        const urlName = searchParams.get('name') || name
        const urlConcerns = searchParams.get('concerns')?.split(',') || concerns

        if (!urlIndustry || !urlStage || !urlGoal) {
          // 온보딩 정보가 없으면 바로 온보딩으로 리다이렉트
          router.push('/onboarding')
          return
        }

        const response = await fetch('/api/curriculum/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            industry: urlIndustry,
            stage: urlStage,
            concerns: urlConcerns,
            goal: urlGoal,
            userName: urlName,
            sessionId
          })
        })

        const data = await response.json()

        if (!response.ok) {
          // 서버에서 반환된 상세 에러 메시지 표시
          const errorMessage = data.error || '커리큘럼 생성에 실패했습니다'
          const errorCode = data.code || 'UNKNOWN'
          throw new Error(`[${errorCode}] ${errorMessage}`)
        }

        if (data.success) {
          // 커리큘럼 페이지로 이동
          router.push(`/curriculum?id=${data.curriculum.id}`)
        } else {
          throw new Error(data.error || '알 수 없는 오류가 발생했습니다')
        }

      } catch (err) {
        console.error('Curriculum generation error:', err)
        setError(err instanceof Error ? err.message : '오류가 발생했습니다')
      }
    }

    generateCurriculum()
  }, [searchParams, industry, stage, concerns, goal, name, sessionId, router])

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">오류가 발생했습니다</h1>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={() => router.push('/onboarding')}
            className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            다시 시도하기
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* 로딩 애니메이션 */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* 외부 원 */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-accent-purple/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />

          {/* 중간 원 */}
          <motion.div
            className="absolute inset-4 rounded-full border-4 border-primary/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />

          {/* 내부 원 (그라데이션) */}
          <motion.div
            className="absolute inset-8 rounded-full bg-gradient-to-br from-accent-purple to-primary"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* AI 아이콘 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-white mb-4">
          맞춤 커리큘럼을 만들고 있어요
        </h1>

        {/* 로딩 메시지 */}
        <motion.p
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-white/60 mb-8"
        >
          {loadingMessages[currentMessage]}
        </motion.p>

        {/* 프로그레스 바 (indeterminate) */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full w-1/3 bg-gradient-to-r from-accent-purple to-primary"
            animate={{
              x: ['-100%', '400%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>

        {/* 추가 정보 */}
        <p className="mt-6 text-sm text-white/40">
          AI가 분석 중입니다. 잠시만 기다려주세요.
        </p>
      </motion.div>
    </div>
  )
}
