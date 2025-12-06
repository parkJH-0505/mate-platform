'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  WelcomeSection,
  ContinueCard,
  NewDiagnosisSection,
  StatsSection
} from '../components'

// 타입 정의
interface UserData {
  id: string
  name: string
  isNew: boolean
  stats: {
    solved: number
    actions: number
    hours: number
  }
}

interface Problem {
  id: string
  title: string
  progress: number
  completedSteps: string[]
  nextStep: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 진단 결과에서 넘어왔는지 확인
    const diagnosisCategory = localStorage.getItem('diagnosisCategory')
    const isNewSignup = localStorage.getItem('isNewSignup')

    // 목 데이터 설정 (추후 API로 대체)
    const mockUserData: UserData = {
      id: 'user-1',
      name: '준호',
      isNew: isNewSignup === 'true',
      stats: {
        solved: 2,
        actions: 8,
        hours: 12
      }
    }

    // 진행 중인 문제가 있는 경우 (진단 완료 후)
    if (diagnosisCategory) {
      const categoryNames: Record<string, string> = {
        customer: '첫 고객 찾기',
        pricing: '가격 정하기',
        product: '서비스 구체화하기',
        marketing: 'SNS 마케팅 시작',
        operations: '업무 효율화',
        strategy: '사업 방향 설정'
      }

      const mockProblem: Problem = {
        id: 'problem-1',
        title: categoryNames[diagnosisCategory] || '첫 고객 찾기',
        progress: 0,
        completedSteps: [],
        nextStep: '첫 번째 단계 시작하기'
      }

      setCurrentProblem(mockProblem)

      // 신규 가입 플래그 리셋
      if (isNewSignup) {
        localStorage.removeItem('isNewSignup')
        mockUserData.isNew = true
        mockUserData.stats = { solved: 0, actions: 0, hours: 0 }
      }
    } else {
      // 기존 사용자 - 진행 중인 문제 있음
      const mockProblem: Problem = {
        id: 'problem-1',
        title: '첫 고객 찾기',
        progress: 66,
        completedSteps: ['타겟 고객 좁히기', '첫 10명 찾는 법'],
        nextStep: '메시지 만들기'
      }
      setCurrentProblem(mockProblem)
    }

    setUserData(mockUserData)
    setIsLoading(false)
  }, [])

  const handleContinue = () => {
    if (currentProblem) {
      router.push(`/problem/${currentProblem.id}`)
    }
  }

  const handleNewDiagnosis = (query: string) => {
    router.push(`/diagnosis?q=${encodeURIComponent(query)}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <WelcomeSection
        userName={userData?.name || '사용자'}
        hasInProgress={!!currentProblem}
        isNewUser={userData?.isNew}
      />

      {/* Continue Card (조건부) */}
      {currentProblem && (
        <ContinueCard
          problemId={currentProblem.id}
          title={currentProblem.title}
          progress={currentProblem.progress}
          completedSteps={currentProblem.completedSteps}
          nextStep={currentProblem.nextStep}
          onContinue={handleContinue}
        />
      )}

      {/* New Diagnosis */}
      <NewDiagnosisSection onSubmit={handleNewDiagnosis} />

      {/* Stats */}
      <StatsSection
        solvedProblems={userData?.stats.solved || 0}
        completedActions={userData?.stats.actions || 0}
        savedHours={userData?.stats.hours || 0}
      />
    </div>
  )
}
