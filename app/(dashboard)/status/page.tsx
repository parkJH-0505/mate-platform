'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  OverallStats,
  ProblemProgress,
  ActivityRecord,
  Achievement,
  calculateOverallStats,
  getProblemProgressList,
  getActivityRecords,
  calculateAchievements
} from '@/app/data/statusData'
import {
  OverviewStats,
  ProblemProgressList,
  ActivityTimeline,
  AchievementBadges
} from '../components/status'

export default function StatusPage() {
  const router = useRouter()
  const [stats, setStats] = useState<OverallStats | null>(null)
  const [problems, setProblems] = useState<ProblemProgress[]>([])
  const [activities, setActivities] = useState<ActivityRecord[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStatusData()
  }, [])

  const loadStatusData = () => {
    try {
      const statsData = calculateOverallStats()
      const problemsData = getProblemProgressList()
      const activitiesData = getActivityRecords(50)
      const achievementsData = calculateAchievements()

      setStats(statsData)
      setProblems(problemsData)
      setActivities(activitiesData)
      setAchievements(achievementsData)
    } catch (error) {
      console.error('Failed to load status data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartProblem = () => {
    router.push('/diagnosis')
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-white/10 rounded w-32" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white/5 rounded-xl" />
          ))}
        </div>
        <div className="h-20 bg-white/5 rounded-xl" />
        <div className="h-40 bg-white/5 rounded-xl" />
      </div>
    )
  }

  // 빈 상태 (활동 없음)
  const hasNoData = !stats ||
    (stats.totalProblemsCompleted === 0 &&
     stats.totalStepsCompleted === 0 &&
     stats.totalChecklistsCompleted === 0 &&
     activities.length === 0)

  if (hasNoData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.05] flex items-center justify-center mx-auto">
            <span className="text-4xl">📊</span>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              아직 시작한 활동이 없어요
            </h2>
            <p className="text-sm text-white/50">
              진단을 통해 첫 번째 문제를<br />
              시작해보세요!
            </p>
          </div>

          <button
            onClick={handleStartProblem}
            className="
              px-8 py-3 rounded-xl
              bg-primary text-black font-semibold
              hover:bg-primary/90 transition-colors
            "
          >
            문제 시작하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-xl font-bold text-white">나의 현황</h1>
        <p className="text-sm text-white/50 mt-1">학습 진행 상황을 확인하세요</p>
      </div>

      {/* 전체 통계 */}
      <OverviewStats stats={stats} />

      {/* 구분선 */}
      <div className="h-px bg-white/[0.06]" />

      {/* 문제 진행 목록 */}
      <ProblemProgressList problems={problems} />

      {/* 구분선 */}
      <div className="h-px bg-white/[0.06]" />

      {/* 활동 타임라인 */}
      <ActivityTimeline activities={activities} />

      {/* 구분선 */}
      <div className="h-px bg-white/[0.06]" />

      {/* 성취 배지 */}
      <AchievementBadges achievements={achievements} />
    </div>
  )
}
