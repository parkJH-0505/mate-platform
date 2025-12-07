'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StreakCard, LevelProgress, WeeklyGoal, BadgeShowcase } from '../components'

interface GamificationData {
  streak: {
    current: number
    longest: number
    weeklyActivity: boolean[]
  }
  level: {
    level: number
    name: string
    icon: string
    totalXP: number
    currentXP: number
    nextLevelXP: number
    progress: number
  }
  goal: {
    target: number
    completed: number
    progress: number
    isAchieved: boolean
    bonusXP: number
    isNew?: boolean
  }
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    isEarned: boolean
    earnedAt?: string
    progress?: number
    requirement?: string
  }>
  recentBadge?: {
    id: string
    name: string
    icon: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  }
}

interface DashboardData {
  user: {
    name: string
    avatar: string | null
    isAuthenticated: boolean
  }
  stats: {
    totalContentsCompleted: number
    totalCurriculums: number
    currentStreak: number
    totalLearningMinutes: number
  }
  currentCurriculum: {
    id: string
    title: string
    industry: string
    stage: string
    goal: string
    progress: number
    totalContents: number
    completedContents: number
    nextContent: {
      id: string
      title: string
      type: string
      duration: string
      weekNumber: number
      moduleTitle: string
    } | null
  } | null
  recentActivities: Array<{
    id: string
    type: string
    title: string
    completedAt: string
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { sessionId, name: onboardingName } = useOnboardingStore()

  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [gamification, setGamification] = useState<GamificationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    const fetchDashboard = async () => {
      try {
        setIsLoading(true)
        const params = sessionId ? `?sessionId=${sessionId}` : ''
        const response = await fetch(`/api/dashboard${params}`)
        const data = await response.json()

        if (data.success) {
          setDashboard(data)
        } else {
          setError(data.error)
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err)
        setError('대시보드를 불러오는데 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    const fetchGamification = async () => {
      try {
        const params = sessionId ? `?sessionId=${sessionId}` : ''

        // Fetch all gamification data in parallel
        const [streakRes, levelRes, goalRes, badgeRes] = await Promise.all([
          fetch(`/api/streak${params}`),
          fetch(`/api/levels${params}`),
          fetch(`/api/goals${params}`),
          fetch(`/api/badges${params}`)
        ])

        const [streakData, levelData, goalData, badgeData] = await Promise.all([
          streakRes.json(),
          levelRes.json(),
          goalRes.json(),
          badgeRes.json()
        ])

        if (streakData.success && levelData.success && goalData.success && badgeData.success) {
          setGamification({
            streak: streakData.streak,
            level: levelData.level,
            goal: { ...goalData.goal, isNew: goalData.isNew },
            badges: badgeData.badges,
            recentBadge: badgeData.recentBadge
          })
        }
      } catch (err) {
        console.error('Error fetching gamification data:', err)
        // Gamification data failure is non-critical, don't show error
      }
    }

    fetchDashboard()
    fetchGamification()
  }, [authLoading, sessionId])

  const handleContinueLearning = () => {
    if (dashboard?.currentCurriculum?.nextContent) {
      router.push(`/content/${dashboard.currentCurriculum.nextContent.id}`)
    } else if (dashboard?.currentCurriculum) {
      router.push('/curriculum')
    }
  }

  const handleViewCurriculum = () => {
    router.push('/curriculum')
  }

  const handleNewCurriculum = () => {
    router.push('/onboarding')
  }

  const handleSetGoal = async (target: number) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetContents: target, sessionId })
      })
      const data = await response.json()
      if (data.success && gamification) {
        setGamification({
          ...gamification,
          goal: { ...data.goal, isNew: false }
        })
      }
    } catch (err) {
      console.error('Error setting goal:', err)
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}분`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`
  }

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">대시보드 로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-white/60 mb-4">{error}</p>
          <button
            onClick={() => router.push('/onboarding')}
            className="px-6 py-3 rounded-xl bg-accent-purple text-white"
          >
            커리큘럼 만들기
          </button>
        </div>
      </div>
    )
  }

  const userName = dashboard?.user?.name || onboardingName || '학습자'
  const hasCurriculum = !!dashboard?.currentCurriculum

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-purple/20 via-primary/10 to-transparent border border-accent-purple/20 p-6"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/20 rounded-full blur-[60px]" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            {dashboard?.user?.avatar ? (
              <img
                src={dashboard.user.avatar}
                alt={userName}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-accent-purple/20 flex items-center justify-center text-xl">
                👋
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-white">
                안녕하세요, {userName}님!
              </h1>
              <p className="text-sm text-white/50">
                {hasCurriculum
                  ? '오늘도 학습을 이어가볼까요?'
                  : '맞춤 커리큘럼을 만들어보세요'}
              </p>
            </div>
          </div>

          {/* Login prompt for anonymous users */}
          {!dashboard?.user?.isAuthenticated && sessionId && (
            <button
              onClick={() => router.push('/login?redirect=/dashboard')}
              className="mt-4 flex items-center gap-2 text-sm text-accent-purple hover:text-accent-purple/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              로그인하고 진행 상황 저장하기
            </button>
          )}
        </div>
      </motion.div>

      {/* Current Curriculum Card */}
      {hasCurriculum && dashboard?.currentCurriculum && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-accent-purple font-medium mb-1">
                현재 학습 중
              </p>
              <h2 className="text-lg font-semibold text-white">
                {dashboard.currentCurriculum.title || `${dashboard.currentCurriculum.industry} 창업 커리큘럼`}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-sm font-medium">
              {dashboard.currentCurriculum.progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-white/50 mb-2">
              <span>{dashboard.currentCurriculum.completedContents}/{dashboard.currentCurriculum.totalContents} 콘텐츠 완료</span>
              <span>{dashboard.currentCurriculum.goal}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dashboard.currentCurriculum.progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-accent-purple to-primary rounded-full"
              />
            </div>
          </div>

          {/* Next Content */}
          {dashboard.currentCurriculum.nextContent && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4">
              <p className="text-xs text-white/40 mb-2">다음 학습</p>
              <p className="text-sm font-medium text-white mb-1">
                {dashboard.currentCurriculum.nextContent.title}
              </p>
              <p className="text-xs text-white/50">
                {dashboard.currentCurriculum.nextContent.weekNumber}주차 · {dashboard.currentCurriculum.nextContent.moduleTitle}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleContinueLearning}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-primary text-white font-semibold hover:shadow-[0_0_30px_rgba(147,97,253,0.3)] transition-all"
            >
              {dashboard.currentCurriculum.nextContent ? '학습 계속하기' : '커리큘럼 보기'}
            </button>
            <button
              onClick={handleViewCurriculum}
              className="px-4 py-3 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      {/* No Curriculum - New User */}
      {!hasCurriculum && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-accent-purple/10 to-primary/5 border border-accent-purple/20 p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-purple/20 flex items-center justify-center text-3xl">
            🚀
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            맞춤 커리큘럼 만들기
          </h2>
          <p className="text-white/50 mb-6">
            몇 가지 질문에 답하면 AI가 맞춤 학습 경로를 설계해드려요
          </p>
          <button
            onClick={handleNewCurriculum}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-accent-purple to-primary text-white font-semibold hover:shadow-[0_0_30px_rgba(147,97,253,0.4)] transition-all"
          >
            시작하기
          </button>
        </motion.div>
      )}

      {/* Gamification Section */}
      {gamification && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            나의 성장
            <span className="text-sm font-normal text-white/40">Growth</span>
          </h3>

          {/* Streak & Level Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StreakCard
              current={gamification.streak.current}
              longest={gamification.streak.longest}
              weeklyActivity={gamification.streak.weeklyActivity}
            />
            <LevelProgress
              level={gamification.level.level}
              name={gamification.level.name}
              icon={gamification.level.icon}
              currentXP={gamification.level.currentXP}
              nextLevelXP={gamification.level.nextLevelXP}
              progress={gamification.level.progress}
              totalXP={gamification.level.totalXP}
            />
          </div>

          {/* Goal & Badges Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WeeklyGoal
              target={gamification.goal.target}
              completed={gamification.goal.completed}
              progress={gamification.goal.progress}
              isAchieved={gamification.goal.isAchieved}
              bonusXP={gamification.goal.bonusXP}
              isNew={gamification.goal.isNew}
              onSetGoal={handleSetGoal}
            />
            <BadgeShowcase
              badges={gamification.badges}
              recentBadge={gamification.recentBadge}
            />
          </div>
        </motion.div>
      )}

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center">
          <p className="text-2xl font-bold text-white mb-1">
            {dashboard?.stats?.totalContentsCompleted || 0}
          </p>
          <p className="text-xs text-white/50">완료한 콘텐츠</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center">
          <p className="text-2xl font-bold text-white mb-1">
            {dashboard?.stats?.totalCurriculums || 0}
          </p>
          <p className="text-xs text-white/50">생성한 커리큘럼</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center">
          <p className="text-2xl font-bold text-white mb-1">
            {formatTime(dashboard?.stats?.totalLearningMinutes || 0)}
          </p>
          <p className="text-xs text-white/50">총 학습 시간</p>
        </div>
      </motion.div>

      {/* Recent Activities */}
      {dashboard?.recentActivities && dashboard.recentActivities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">최근 활동</h3>
          <div className="space-y-3">
            {dashboard.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{activity.title}</p>
                  <p className="text-xs text-white/40">
                    {new Date(activity.completedAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">빠른 메뉴</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleNewCurriculum}
            className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-sm text-white">새 커리큘럼</span>
          </button>
          <button
            onClick={() => router.push('/curriculum')}
            className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-sm text-white">내 커리큘럼</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
