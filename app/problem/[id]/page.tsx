'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ProblemHeader, StepCard } from './components'
import {
  Problem,
  UserProgress,
  getProblemById,
  getProblemByCategory,
  createInitialProgress,
  calculateProgress,
  calculateStepProgress
} from '@/app/data/problemsData'

export default function ProblemPage() {
  const router = useRouter()
  const params = useParams()
  const problemId = params.id as string

  const [problem, setProblem] = useState<Problem | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 문제 데이터 로드
    let loadedProblem = getProblemById(problemId)

    // ID로 못 찾으면 카테고리로 시도
    if (!loadedProblem) {
      const categoryId = localStorage.getItem('diagnosisCategory')
      if (categoryId) {
        loadedProblem = getProblemByCategory(categoryId)
      }
    }

    if (!loadedProblem) {
      // 기본값으로 customer 문제 사용
      loadedProblem = getProblemByCategory('customer')
    }

    if (!loadedProblem) {
      router.push('/dashboard')
      return
    }

    setProblem(loadedProblem)

    // 진행 상태 로드 또는 생성
    const savedProgressStr = localStorage.getItem(`progress-${loadedProblem.id}`)
    if (savedProgressStr) {
      try {
        const savedProgress = JSON.parse(savedProgressStr)
        setProgress(savedProgress)
      } catch {
        const initialProgress = createInitialProgress(loadedProblem)
        setProgress(initialProgress)
        localStorage.setItem(`progress-${loadedProblem.id}`, JSON.stringify(initialProgress))
      }
    } else {
      const initialProgress = createInitialProgress(loadedProblem)
      setProgress(initialProgress)
      localStorage.setItem(`progress-${loadedProblem.id}`, JSON.stringify(initialProgress))
    }

    setIsLoading(false)
  }, [problemId, router])

  const handleStepClick = (stepId: string) => {
    if (!progress) return

    const stepProgress = progress.stepProgress.find(sp => sp.stepId === stepId)
    if (!stepProgress || stepProgress.status === 'locked') return

    // 단계 상세 페이지로 이동
    router.push(`/problem/${problemId}/step/${stepId}`)
  }

  if (isLoading || !problem || !progress) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const totalProgress = calculateProgress(progress)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <main className="pt-6 pb-24 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* 문제 헤더 */}
          <ProblemHeader
            title={problem.title}
            progress={totalProgress}
            expectedOutcome={problem.expectedOutcome}
            totalMinutes={problem.totalMinutes}
            icon={problem.icon}
          />

          {/* 단계 목록 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📋</span>
              <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider">
                실행 단계
              </h2>
            </div>

            <div className="space-y-3">
              {problem.steps.map((step) => {
                const stepProgress = progress.stepProgress.find(sp => sp.stepId === step.id)
                const stepPercent = stepProgress ? calculateStepProgress(stepProgress) : 0

                return (
                  <StepCard
                    key={step.id}
                    id={step.id}
                    order={step.order}
                    title={step.title}
                    description={step.description}
                    estimatedMinutes={step.estimatedMinutes}
                    icon={step.icon}
                    status={stepProgress?.status || 'locked'}
                    progress={stepPercent}
                    onClick={() => handleStepClick(step.id)}
                  />
                )
              })}
            </div>
          </section>

          {/* 도움말 섹션 */}
          <section className="
            p-5 rounded-2xl
            bg-gradient-to-br from-white/[0.02] to-transparent
            border border-white/[0.05]
          ">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">팁</h3>
                <p className="text-sm text-white/50">
                  각 단계를 순서대로 완료하면 다음 단계가 열립니다.
                  막히는 부분이 있으면 AI 도우미에게 물어보세요.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
