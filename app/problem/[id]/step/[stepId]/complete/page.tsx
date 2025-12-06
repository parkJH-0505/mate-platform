'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Problem,
  Step,
  UserProgress,
  getProblemById,
  getProblemByCategory,
  calculateProgress
} from '@/app/data/problemsData'

export default function StepCompletePage() {
  const router = useRouter()
  const params = useParams()
  const problemId = params.id as string
  const stepId = params.stepId as string

  const [problem, setProblem] = useState<Problem | null>(null)
  const [currentStep, setCurrentStep] = useState<Step | null>(null)
  const [nextStep, setNextStep] = useState<Step | null>(null)
  const [totalProgress, setTotalProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 문제 데이터 로드
    let loadedProblem = getProblemById(problemId)
    if (!loadedProblem) {
      const categoryId = localStorage.getItem('diagnosisCategory')
      if (categoryId) {
        loadedProblem = getProblemByCategory(categoryId)
      }
    }
    if (!loadedProblem) {
      loadedProblem = getProblemByCategory('customer')
    }

    if (!loadedProblem) {
      router.push('/dashboard')
      return
    }

    setProblem(loadedProblem)

    // 현재 단계와 다음 단계 찾기
    const stepIndex = loadedProblem.steps.findIndex(s => s.id === stepId)
    if (stepIndex >= 0) {
      setCurrentStep(loadedProblem.steps[stepIndex])
      if (stepIndex + 1 < loadedProblem.steps.length) {
        setNextStep(loadedProblem.steps[stepIndex + 1])
      }
    }

    // 진행 상태 로드
    const savedProgressStr = localStorage.getItem(`progress-${loadedProblem.id}`)
    if (savedProgressStr) {
      try {
        const savedProgress = JSON.parse(savedProgressStr) as UserProgress
        const progress = calculateProgress(savedProgress)
        setTotalProgress(progress)
      } catch {
        // 에러 무시
      }
    }

    setIsLoading(false)
  }, [problemId, stepId, router])

  const handleNextStep = () => {
    if (nextStep) {
      router.push(`/problem/${problemId}/step/${nextStep.id}`)
    }
  }

  const handleBackToProblem = () => {
    router.push(`/problem/${problemId}`)
  }

  if (isLoading || !problem || !currentStep) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-8">
          {/* 축하 아이콘 */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-green-500/20 flex items-center justify-center">
              <span className="text-5xl">🎉</span>
            </div>
            {/* 배경 원 애니메이션 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-green-500/10 animate-ping" />
            </div>
          </div>

          {/* 완료 메시지 */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Step {currentStep.order} 완료!
            </h1>
            <p className="text-white/60">
              {currentStep.title}을(를) 완료했어요
            </p>
          </div>

          {/* 진행률 */}
          <div className="
            p-6 rounded-2xl
            bg-white/[0.03] border border-white/[0.06]
          ">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/60">전체 진행률</span>
              <span className="text-sm font-medium text-primary">{totalProgress}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <p className="text-xs text-white/40 mt-3">
              {problem.steps.length - currentStep.order}개 단계가 남았어요
            </p>
          </div>

          {/* 다음 단계 미리보기 */}
          {nextStep && (
            <div className="
              p-5 rounded-2xl text-left
              bg-gradient-to-br from-primary/10 to-transparent
              border border-primary/20
            ">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-primary">다음 단계</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-lg flex-shrink-0">
                  {nextStep.icon}
                </div>
                <div>
                  <h3 className="font-medium text-white">{nextStep.title}</h3>
                  <p className="text-xs text-white/50">{nextStep.estimatedMinutes}분 소요</p>
                </div>
              </div>
            </div>
          )}

          {/* 버튼들 */}
          <div className="space-y-3">
            {nextStep ? (
              <button
                onClick={handleNextStep}
                className="
                  w-full py-4 rounded-xl
                  bg-primary text-black font-semibold
                  hover:bg-primary/90 transition-colors
                "
              >
                다음 단계 시작하기
              </button>
            ) : (
              <button
                onClick={handleBackToProblem}
                className="
                  w-full py-4 rounded-xl
                  bg-primary text-black font-semibold
                  hover:bg-primary/90 transition-colors
                "
              >
                목록으로 돌아가기
              </button>
            )}

            <button
              onClick={handleBackToProblem}
              className="
                w-full py-3 rounded-xl
                bg-white/5 text-white/70 font-medium
                hover:bg-white/10 transition-colors
              "
            >
              나중에 하기
            </button>
          </div>

          {/* 응원 메시지 */}
          <p className="text-sm text-white/40">
            잘하고 있어요! 한 걸음씩 나아가면 돼요 💪
          </p>
        </div>
      </main>
    </div>
  )
}
