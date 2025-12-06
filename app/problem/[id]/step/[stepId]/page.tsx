'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  StepHeader,
  ContentTabs,
  ContentArea,
  ChecklistSection,
  ContentTabType
} from './components'
import {
  Problem,
  Step,
  UserProgress,
  StepProgress,
  getProblemById,
  getProblemByCategory,
  toggleChecklistItem,
  calculateStepProgress,
  completeStepAndUnlockNext
} from '@/app/data/problemsData'
import { saveActivity } from '@/app/data/statusData'
import { ChatModal } from '@/components/ai'

export default function StepPage() {
  const router = useRouter()
  const params = useParams()
  const problemId = params.id as string
  const stepId = params.stepId as string

  const [problem, setProblem] = useState<Problem | null>(null)
  const [step, setStep] = useState<Step | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [stepProgress, setStepProgress] = useState<StepProgress | null>(null)
  const [activeTab, setActiveTab] = useState<ContentTabType>('why')
  const [isLoading, setIsLoading] = useState(true)
  const [showChatModal, setShowChatModal] = useState(false)

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

    const foundStep = loadedProblem.steps.find(s => s.id === stepId)
    if (!foundStep) {
      router.push(`/problem/${problemId}`)
      return
    }

    setProblem(loadedProblem)
    setStep(foundStep)

    // 진행 상태 로드
    const savedProgressStr = localStorage.getItem(`progress-${loadedProblem.id}`)
    if (savedProgressStr) {
      try {
        const savedProgress = JSON.parse(savedProgressStr) as UserProgress
        setProgress(savedProgress)

        const foundStepProgress = savedProgress.stepProgress.find(sp => sp.stepId === stepId)
        if (foundStepProgress) {
          // 단계 시작 시 상태를 in_progress로 변경
          if (foundStepProgress.status === 'available') {
            const updatedProgress = {
              ...savedProgress,
              currentStepId: stepId,
              stepProgress: savedProgress.stepProgress.map(sp =>
                sp.stepId === stepId
                  ? { ...sp, status: 'in_progress' as const, startedAt: new Date().toISOString() }
                  : sp
              )
            }
            setProgress(updatedProgress)
            setStepProgress({ ...foundStepProgress, status: 'in_progress' })
            localStorage.setItem(`progress-${loadedProblem.id}`, JSON.stringify(updatedProgress))
          } else {
            setStepProgress(foundStepProgress)
          }
        }
      } catch {
        router.push(`/problem/${problemId}`)
        return
      }
    }

    setIsLoading(false)
  }, [problemId, stepId, router])

  const handleToggleChecklist = (itemId: string) => {
    if (!progress || !problem || !step) return

    // 현재 상태 확인 (완료로 바뀌는지)
    const currentChecklistItem = stepProgress?.checklistProgress.find(cp => cp.itemId === itemId)
    const isCompletingNow = currentChecklistItem && !currentChecklistItem.completed

    const updatedProgress = toggleChecklistItem(progress, stepId, itemId)
    setProgress(updatedProgress)

    const updatedStepProgress = updatedProgress.stepProgress.find(sp => sp.stepId === stepId)
    if (updatedStepProgress) {
      setStepProgress(updatedStepProgress)
    }

    localStorage.setItem(`progress-${problem.id}`, JSON.stringify(updatedProgress))

    // 체크리스트 완료 시 활동 기록
    if (isCompletingNow) {
      const checklistItem = step.checklist.find(c => c.id === itemId)
      if (checklistItem) {
        saveActivity({
          type: 'checklist_complete',
          title: checklistItem.text,
          description: `${problem.title} > ${step.title}`,
          problemId: problem.id,
          stepId: step.id,
          icon: '✅'
        })
      }
    }
  }

  const handleCompleteStep = () => {
    if (!progress || !problem || !step) return

    // 모든 체크리스트 완료 확인
    const currentStepProgress = progress.stepProgress.find(sp => sp.stepId === stepId)
    if (!currentStepProgress) return

    const allCompleted = currentStepProgress.checklistProgress.every(cp => cp.completed)
    if (!allCompleted) {
      // 모두 완료되지 않았을 때 알림
      alert('모든 체크리스트를 완료해주세요!')
      return
    }

    // 단계 완료 및 다음 단계 잠금 해제
    const updatedProgress = completeStepAndUnlockNext(progress, stepId)
    setProgress(updatedProgress)
    localStorage.setItem(`progress-${problem.id}`, JSON.stringify(updatedProgress))

    // 단계 완료 활동 기록
    saveActivity({
      type: 'step_complete',
      title: `Step ${step.order} 완료!`,
      description: `${problem.title} > ${step.title}`,
      problemId: problem.id,
      stepId: step.id,
      icon: '🎉'
    })

    // 다음 단계가 있으면 완료 페이지로, 없으면 문제 완료 페이지로
    const currentIndex = problem.steps.findIndex(s => s.id === stepId)
    if (currentIndex < problem.steps.length - 1) {
      router.push(`/problem/${problemId}/step/${stepId}/complete`)
    } else {
      // 문제 완료 활동 기록
      saveActivity({
        type: 'problem_complete',
        title: `문제 완료!`,
        description: problem.title,
        problemId: problem.id,
        icon: '🏆'
      })
      router.push(`/problem/${problemId}/complete`)
    }
  }

  if (isLoading || !problem || !step || !stepProgress) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const completedCount = stepProgress.checklistProgress.filter(cp => cp.completed).length
  const totalCount = step.checklist.length
  const allCompleted = completedCount === totalCount
  const stepPercent = calculateStepProgress(stepProgress)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <main className="pt-6 pb-32 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 단계 헤더 */}
          <StepHeader
            problemId={problemId}
            stepOrder={step.order}
            totalSteps={problem.steps.length}
            title={step.title}
            estimatedMinutes={step.estimatedMinutes}
            icon={step.icon}
          />

          {/* 콘텐츠 탭 */}
          <ContentTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            checklistCount={totalCount}
            completedCount={completedCount}
          />

          {/* 콘텐츠 영역 */}
          <div className="min-h-[300px]">
            {activeTab === 'checklist' ? (
              <ChecklistSection
                items={step.checklist}
                progress={stepProgress.checklistProgress}
                onToggle={handleToggleChecklist}
              />
            ) : (
              <ContentArea
                activeTab={activeTab}
                content={step.content}
              />
            )}
          </div>
        </div>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          {/* 진행률 */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/60">
              {completedCount}/{totalCount} 완료
            </span>
            <span className="text-sm text-white/40">
              {stepPercent}%
            </span>
          </div>

          {/* 진행률 바 */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-500 ${allCompleted ? 'bg-green-500' : 'bg-primary'}`}
              style={{ width: `${stepPercent}%` }}
            />
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3">
            {/* 막혔어요 버튼 */}
            <button
              onClick={() => setShowChatModal(true)}
              className="
                px-4 py-4 rounded-xl
                bg-white/[0.05] border border-white/[0.08]
                text-white/70 hover:text-white hover:bg-white/[0.08]
                transition-all duration-200
                flex items-center gap-2
              "
            >
              <span>🤖</span>
              <span className="text-sm font-medium">막혔어요</span>
            </button>

            {/* 완료 버튼 */}
            <button
              onClick={handleCompleteStep}
              disabled={!allCompleted}
              className={`
                flex-1 py-4 rounded-xl font-semibold text-lg
                transition-all duration-200
                ${allCompleted
                  ? 'bg-primary text-black hover:bg-primary/90'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
                }
              `}
            >
              {allCompleted ? '단계 완료하기' : `${totalCount - completedCount}개 남음`}
            </button>
          </div>
        </div>
      </div>

      {/* AI 채팅 모달 */}
      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        context={{
          problemId: problem.id,
          problemTitle: problem.title,
          stepId: step.id,
          stepTitle: step.title
        }}
      />
    </div>
  )
}
