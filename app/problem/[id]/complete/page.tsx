'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Problem,
  UserProgress,
  getProblemById,
  getProblemByCategory
} from '@/app/data/problemsData'

export default function ProblemCompletePage() {
  const router = useRouter()
  const params = useParams()
  const problemId = params.id as string

  const [problem, setProblem] = useState<Problem | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
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

    // 진행 상태 로드 및 완료 표시
    const savedProgressStr = localStorage.getItem(`progress-${loadedProblem.id}`)
    if (savedProgressStr) {
      try {
        const savedProgress = JSON.parse(savedProgressStr) as UserProgress
        // 완료 시간 기록
        const completedProgress = {
          ...savedProgress,
          completedAt: new Date().toISOString()
        }
        setProgress(completedProgress)
        localStorage.setItem(`progress-${loadedProblem.id}`, JSON.stringify(completedProgress))
      } catch {
        // 에러 무시
      }
    }

    setIsLoading(false)
  }, [problemId, router])

  const handleGoToDashboard = () => {
    // 진단 카테고리 정리 (완료됨)
    localStorage.removeItem('diagnosisCategory')
    localStorage.removeItem('diagnosisAnswers')
    router.push('/dashboard')
  }

  const handleNewDiagnosis = () => {
    localStorage.removeItem('diagnosisCategory')
    localStorage.removeItem('diagnosisAnswers')
    router.push('/diagnosis')
  }

  if (isLoading || !problem) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  // 완료 시간 계산 (시작 시간이 있는 경우)
  const getCompletionTime = () => {
    if (!progress?.startedAt || !progress?.completedAt) return null
    const start = new Date(progress.startedAt)
    const end = new Date(progress.completedAt)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 0) {
      return `${diffHours}시간 ${diffMins}분`
    }
    return `${diffMins}분`
  }

  const completionTime = getCompletionTime()

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-8">
          {/* 트로피 아이콘 */}
          <div className="relative">
            <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center">
              <span className="text-6xl">🏆</span>
            </div>
            {/* 배경 효과 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-yellow-500/10 animate-pulse" />
            </div>
            {/* 별들 */}
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">⭐</div>
            <div className="absolute -bottom-2 -left-2 text-xl animate-bounce delay-100">✨</div>
          </div>

          {/* 축하 메시지 */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">
              축하해요!
            </h1>
            <p className="text-lg text-primary font-medium mb-2">
              {problem.title}
            </p>
            <p className="text-white/60">
              문제를 완료했어요! 대단해요!
            </p>
          </div>

          {/* 성과 카드 */}
          <div className="
            p-6 rounded-2xl
            bg-gradient-to-br from-yellow-500/10 to-orange-500/5
            border border-yellow-500/20
          ">
            <h3 className="text-sm text-white/60 mb-4">달성한 성과</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {problem.steps.length}
                </div>
                <div className="text-xs text-white/50">완료한 단계</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {problem.steps.reduce((sum, s) => sum + s.checklist.length, 0)}
                </div>
                <div className="text-xs text-white/50">완료한 액션</div>
              </div>
            </div>
            {completionTime && (
              <div className="mt-4 pt-4 border-t border-white/10 text-center">
                <span className="text-sm text-white/50">소요 시간: </span>
                <span className="text-sm text-white font-medium">{completionTime}</span>
              </div>
            )}
          </div>

          {/* 기대 결과 */}
          <div className="
            p-5 rounded-2xl text-left
            bg-white/[0.03] border border-white/[0.06]
          ">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary">🎯</span>
              <span className="text-sm font-medium text-white/70">달성 목표</span>
            </div>
            <p className="text-white/80">{problem.expectedOutcome}</p>
          </div>

          {/* 다음 추천 */}
          <div className="
            p-5 rounded-2xl text-left
            bg-gradient-to-br from-primary/10 to-transparent
            border border-primary/20
          ">
            <div className="flex items-center gap-2 mb-2">
              <span>💡</span>
              <span className="text-sm font-medium text-primary">다음 추천</span>
            </div>
            <p className="text-sm text-white/60">
              첫 고객을 찾았다면, 다음은 가격 정하기나 서비스 구체화를 해보세요!
            </p>
          </div>

          {/* 버튼들 */}
          <div className="space-y-3">
            <button
              onClick={handleNewDiagnosis}
              className="
                w-full py-4 rounded-xl
                bg-primary text-black font-semibold
                hover:bg-primary/90 transition-colors
              "
            >
              새로운 문제 진단받기
            </button>

            <button
              onClick={handleGoToDashboard}
              className="
                w-full py-3 rounded-xl
                bg-white/5 text-white/70 font-medium
                hover:bg-white/10 transition-colors
              "
            >
              대시보드로 가기
            </button>
          </div>

          {/* 공유 버튼 */}
          <div className="pt-4">
            <button className="
              inline-flex items-center gap-2 px-4 py-2 rounded-xl
              bg-white/5 hover:bg-white/10
              text-sm text-white/50 hover:text-white
              transition-colors
            ">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              성과 공유하기
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
