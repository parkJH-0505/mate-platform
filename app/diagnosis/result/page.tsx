'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ResultCard, SolutionStepCard, SummaryBox } from './components'
import { getDiagnosisResult, type DiagnosisResult } from './data/resultData'
import { diagnosisFlows } from '../data/diagnosisFlow'
import { AuthModal } from '@/components/auth'

export default function DiagnosisResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [categoryName, setCategoryName] = useState<string>('')
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [showSignupModal, setShowSignupModal] = useState(false)

  useEffect(() => {
    // localStorage에서 진단 데이터 가져오기
    const answersStr = localStorage.getItem('diagnosisAnswers')
    const categoryId = localStorage.getItem('diagnosisCategory')

    if (!answersStr || !categoryId) {
      // 데이터가 없으면 홈으로 이동
      router.push('/')
      return
    }

    try {
      const answers = JSON.parse(answersStr)
      const diagnosisResult = getDiagnosisResult(categoryId, answers)
      setResult(diagnosisResult)

      // 카테고리 이름 가져오기
      const flow = diagnosisFlows[categoryId]
      if (flow) {
        setCategoryName(flow.categoryName)
      }

      // 첫 번째 스텝 자동 확장
      if (diagnosisResult.steps.length > 0) {
        setExpandedStep(diagnosisResult.steps[0].id)
      }
    } catch (error) {
      console.error('Failed to parse diagnosis data:', error)
      router.push('/')
    }
  }, [router])

  const handleToggleStep = (stepId: string) => {
    setExpandedStep(prev => prev === stepId ? null : stepId)
  }

  const handleStartClick = () => {
    // 가입 모달 표시 또는 대시보드로 이동
    setShowSignupModal(true)
  }

  const handleSignup = () => {
    // 신규 가입 플래그 설정 (대시보드에서 인식)
    localStorage.setItem('isNewSignup', 'true')
    setShowSignupModal(false)
    router.push('/dashboard')
  }

  const handleGoHome = () => {
    // localStorage 정리
    localStorage.removeItem('diagnosisAnswers')
    localStorage.removeItem('diagnosisCategory')
    router.push('/')
  }

  const handleNewDiagnosis = () => {
    localStorage.removeItem('diagnosisAnswers')
    localStorage.removeItem('diagnosisCategory')
    router.push('/diagnosis')
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-lg border-b border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">홈으로</span>
          </button>

          <span className="text-lg font-bold text-primary">MATE</span>

          <button
            onClick={handleNewDiagnosis}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            다시 진단하기
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-48 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Result Card */}
          <ResultCard
            title={result.title}
            summary={result.summary}
            keyInsight={result.keyInsight}
            urgency={result.urgency}
            categoryName={categoryName}
          />

          {/* Steps Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-lg">🎯</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                실행 가이드
              </h2>
            </div>

            <div className="space-y-3">
              {result.steps.map((step) => (
                <SolutionStepCard
                  key={step.id}
                  step={step}
                  isExpanded={expandedStep === step.id}
                  onToggle={() => handleToggleStep(step.id)}
                />
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="\n            p-6 rounded-2xl\n            bg-gradient-to-br from-white/[0.06] to-transparent\n            border-2 border-white/[0.15]\n            backdrop-blur-sm\n            shadow-[0_4px_16px_0_rgba(0,0,0,0.2)]\n          \">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">
                  더 자세한 도움이 필요하신가요?
                </h3>
                <p className="text-sm text-white/60 mb-4">
                  MATE AI 도우미가 각 단계를 더 자세히 안내해드릴 수 있어요.
                  막히는 부분이 있으면 언제든 물어보세요.
                </p>
                <button className="
                  px-4 py-2 rounded-lg text-sm font-medium
                  bg-white/[0.05] hover:bg-white/[0.1]
                  border border-white/[0.1]
                  text-white/80 hover:text-white
                  transition-all duration-200
                ">
                  AI 도우미에게 질문하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Summary Box (Sticky Bottom) */}
      <SummaryBox
        steps={result.steps}
        nextStepCTA={result.nextStepCTA}
        onStartClick={handleStartClick}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        mode="signup"
        onGoogleClick={handleSignup}
        onKakaoClick={handleSignup}
      />
    </div>
  )
}
