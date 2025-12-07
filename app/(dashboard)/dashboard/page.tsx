'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { StreakCard, LevelProgress, WeeklyGoal, BadgeShowcase, RoadmapModal, CurriculumAccordion } from '../components'
import { TodaysPlanCard } from '../components/TodaysPlan'
import { WeeklyRecommendations, RecentActivity } from '../components/SmartFeed'

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
    modules?: Array<{
      weekNumber: number
      title: string
      description: string
      contents: Array<{
        id: string
        title: string
        type: string
        duration: string
      }>
    }>
    completedContentIds?: string[]
  } | null
  recentActivities: Array<{
    id: string
    type: string
    title: string
    completedAt: string
  }>
}

// Roadmap Modal용 커리큘럼 데이터 타입
interface RoadmapCurriculumData {
  userName: string
  industry: string
  stage: string
  goal: string
  durationWeeks: number
  modules: Array<{
    weekNumber: number
    title: string
    description: string
    contents: Array<{
      id: string
      title: string
      type: string
      duration: string
    }>
  }>
  totalContents: number
}

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: authLoading } = useAuth()
  const { sessionId, name: onboardingName, industry, stage, goal } = useOnboardingStore()

  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [gamification, setGamification] = useState<GamificationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Roadmap Modal 상태
  const [showRoadmapModal, setShowRoadmapModal] = useState(false)
  const [roadmapCurriculum, setRoadmapCurriculum] = useState<RoadmapCurriculumData | null>(null)

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

  // URL 파라미터로 Roadmap Modal 트리거
  useEffect(() => {
    const showRoadmap = searchParams.get('showRoadmap')
    const curriculumId = searchParams.get('curriculumId')

    if (showRoadmap === 'true' && curriculumId) {
      // 커리큘럼 데이터 가져오기
      const fetchCurriculumForModal = async () => {
        try {
          const params = sessionId ? `?sessionId=${sessionId}` : ''
          const response = await fetch(`/api/curriculum/${curriculumId}${params}`)
          const data = await response.json()

          if (data.success && data.curriculum) {
            const curriculum = data.curriculum
            setRoadmapCurriculum({
              userName: onboardingName || '창업가',
              industry: curriculum.industry || industry || '',
              stage: curriculum.stage || stage || '',
              goal: curriculum.goal || goal || '',
              durationWeeks: curriculum.durationWeeks || 4,
              modules: curriculum.modules || [],
              totalContents: curriculum.totalContents || 0
            })
            setShowRoadmapModal(true)
          }
        } catch (err) {
          console.error('Error fetching curriculum for modal:', err)
        }
      }

      fetchCurriculumForModal()

      // URL에서 파라미터 제거 (히스토리 교체)
      const url = new URL(window.location.href)
      url.searchParams.delete('showRoadmap')
      url.searchParams.delete('curriculumId')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams, sessionId, onboardingName, industry, stage, goal])

  const handleContinueLearning = () => {
    if (dashboard?.currentCurriculum?.nextContent) {
      router.push(`/content/${dashboard.currentCurriculum.nextContent.id}`)
    } else if (dashboard?.currentCurriculum) {
      // 커리큘럼 상세 페이지로 이동 (ID 포함)
      router.push(`/curriculum?id=${dashboard.currentCurriculum.id}`)
    }
  }

  const handleViewCurriculum = () => {
    if (dashboard?.currentCurriculum) {
      router.push(`/curriculum?id=${dashboard.currentCurriculum.id}`)
    }
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

  // Roadmap Modal 핸들러
  const handleRoadmapClose = () => {
    setShowRoadmapModal(false)
    setRoadmapCurriculum(null)
  }

  const handleStartLearning = () => {
    setShowRoadmapModal(false)
    setRoadmapCurriculum(null)
    // 첫 번째 콘텐츠로 이동
    if (dashboard?.currentCurriculum?.nextContent) {
      router.push(`/content/${dashboard.currentCurriculum.nextContent.id}`)
    }
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
      {/* Welcome Section - 개인화 강화 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-purple/20 via-primary/10 to-transparent border border-accent-purple/20 p-6"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/20 rounded-full blur-[60px]" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            {dashboard?.user?.avatar ? (
              <img
                src={dashboard.user.avatar}
                alt={userName}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent-purple to-primary flex items-center justify-center text-xl text-white font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-white">
                {userName}님, 오늘도 한 걸음!
              </h1>
              <p className="text-sm text-white/50">
                {hasCurriculum && dashboard?.currentCurriculum
                  ? `${dashboard.currentCurriculum.industry} · ${dashboard.currentCurriculum.stage}`
                  : '맞춤 커리큘럼을 만들어보세요'}
              </p>
            </div>
          </div>

          {/* 현재 위치 표시 */}
          {hasCurriculum && dashboard?.currentCurriculum?.nextContent && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white/40">현재 위치:</span>
              <span className="px-2 py-0.5 rounded bg-accent-purple/20 text-accent-purple text-xs font-medium">
                {dashboard.currentCurriculum.nextContent.weekNumber}주차
              </span>
              <span className="text-white/60">
                {dashboard.currentCurriculum.nextContent.moduleTitle}
              </span>
            </div>
          )}

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

      {/* Gamification Section - Welcome 바로 다음 */}
      {gamification && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            나의 성장
            <span className="text-sm font-normal text-white/40">Growth</span>
          </h3>

          {/* Streak, Level, Goal - 3개 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <WeeklyGoal
              target={gamification.goal.target}
              completed={gamification.goal.completed}
              progress={gamification.goal.progress}
              isAchieved={gamification.goal.isAchieved}
              bonusXP={gamification.goal.bonusXP}
              isNew={gamification.goal.isNew}
              onSetGoal={handleSetGoal}
            />
          </div>
        </motion.div>
      )}

      {/* Today's Plan 카드 - 실행 기반 경험 */}
      {hasCurriculum && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <TodaysPlanCard sessionId={sessionId} />
        </motion.div>
      )}

      {/* Current Curriculum Card - 간소화 */}
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

          {/* Actions */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleViewCurriculum}
              className="flex-1 py-3 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition-colors font-medium"
            >
              전체 커리큘럼 보기
            </button>
          </div>

          {/* Curriculum Accordion - 기본 접힌 상태 */}
          {dashboard.currentCurriculum.modules && dashboard.currentCurriculum.modules.length > 0 && (
            <details className="pt-4 border-t border-white/[0.06]">
              <summary className="flex items-center justify-between cursor-pointer hover:text-white/80 transition-colors">
                <h3 className="text-sm font-medium text-white/70">주차별 커리큘럼</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">
                    {dashboard.currentCurriculum.modules.length}주 과정
                  </span>
                  <svg className="w-4 h-4 text-white/40 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="mt-3">
                <CurriculumAccordion
                  modules={dashboard.currentCurriculum.modules}
                  currentWeek={dashboard.currentCurriculum.nextContent?.weekNumber || 1}
                  completedContentIds={dashboard.currentCurriculum.completedContentIds || []}
                />
              </div>
            </details>
          )}
        </motion.div>
      )}

      {/* 스마트 피드 섹션 - 추천 & 활동 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <WeeklyRecommendations sessionId={sessionId} />
        <RecentActivity sessionId={sessionId} />
      </motion.div>

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



      {/* 🏆 성취 & 배지 통합 섹션 */}
      {gamification && hasCurriculum && dashboard?.currentCurriculum && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>🏆</span>
              성취 & 배지
            </h3>
            <span className="text-xs text-white/40">Achievements</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 최근 획득 배지 (큰 카드) */}
            {gamification.recentBadge && (
              <div className="md:col-span-2 p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center text-3xl
                    ${gamification.recentBadge.rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-400/30 to-orange-500/30 animate-pulse' :
                      gamification.recentBadge.rarity === 'epic' ? 'bg-purple-500/30' :
                        gamification.recentBadge.rarity === 'rare' ? 'bg-blue-500/30' :
                          'bg-gray-500/30'
                    }
                  `}>
                    <span>{gamification.recentBadge.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-yellow-400 font-medium mb-1">최근 획득!</p>
                    <p className="text-white font-semibold">{gamification.recentBadge.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${gamification.recentBadge.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                          gamification.recentBadge.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                            gamification.recentBadge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                        }
                      `}>
                        {gamification.recentBadge.rarity === 'legendary' ? 'Legendary' :
                          gamification.recentBadge.rarity === 'epic' ? 'Epic' :
                            gamification.recentBadge.rarity === 'rare' ? 'Rare' : 'Common'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 마일스톤들 */}
            {/* 커리큘럼 생성 마일스톤 */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
              <div className="w-10 h-10 rounded-full bg-accent-purple/30 flex items-center justify-center shrink-0">
                <span className="text-lg">🎯</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">나만의 커리큘럼 생성</p>
                <p className="text-xs text-white/50">맞춤 학습 경로 시작</p>
              </div>
              <svg className="w-5 h-5 text-accent-purple shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>

            {/* 첫 콘텐츠 완료 마일스톤 */}
            {(dashboard.stats?.totalContentsCompleted || 0) >= 1 ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center shrink-0">
                  <span className="text-lg">👟</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">첫 한 발</p>
                  <p className="text-xs text-white/50">첫 번째 콘텐츠 완료!</p>
                </div>
                <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 opacity-50">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-lg">👟</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/70 truncate">첫 한 발</p>
                  <p className="text-xs text-white/40">첫 콘텐츠 완료해보세요</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-white/20 shrink-0" />
              </div>
            )}

            {/* 3개 완료 마일스톤 */}
            {(dashboard.stats?.totalContentsCompleted || 0) >= 3 ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center shrink-0">
                  <span className="text-lg">🔥</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">시동 걸림</p>
                  <p className="text-xs text-white/50">3개 콘텐츠 완료!</p>
                </div>
                <svg className="w-5 h-5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 opacity-50">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-lg">🔥</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/70 truncate">시동 걸림</p>
                  <p className="text-xs text-white/40">{dashboard.stats?.totalContentsCompleted || 0}/3 콘텐츠</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-white/20 shrink-0" />
              </div>
            )}

            {/* 1주차 완료 마일스톤 */}
            {dashboard.currentCurriculum.progress >= 25 ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="w-10 h-10 rounded-full bg-yellow-500/30 flex items-center justify-center shrink-0">
                  <span className="text-lg">⭐</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">1주차 정복</p>
                  <p className="text-xs text-white/50">체계적인 학습!</p>
                </div>
                <svg className="w-5 h-5 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 opacity-50">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-lg">⭐</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/70 truncate">1주차 정복</p>
                  <p className="text-xs text-white/40">1주차를 완료해보세요</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-white/20 shrink-0" />
              </div>
            )}
          </div>

          {/* 격려 메시지 */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-sm text-center text-white/60">
              {(dashboard.stats?.totalContentsCompleted || 0) === 0
                ? "첫 걸음을 떼면, 당신도 진지하게 창업을 준비하는 사람이에요 👟"
                : (dashboard.stats?.totalContentsCompleted || 0) < 3
                  ? "꾸준히 배우는 당신, 이미 상위 10% 예비 창업자예요 🌱"
                  : "당신은 이미 진지하게 창업을 준비하는 사람이에요 🚀"
              }
            </p>
          </div>

          {/* 모든 배지 보기 링크 */}
          <button
            onClick={() => router.push('/badges')}
            className="w-full mt-3 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors text-sm font-medium"
          >
            모든 배지 보기 →
          </button>
        </motion.div>
      )}

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
      >
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5 flex sm:flex-col items-center sm:items-center justify-between sm:justify-center gap-2 sm:gap-0 sm:text-center">
          <p className="text-xs text-white/50 sm:order-2 sm:mt-1">완료한 콘텐츠</p>
          <p className="text-2xl font-bold text-white sm:order-1">
            {dashboard?.stats?.totalContentsCompleted || 0}
          </p>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5 flex sm:flex-col items-center sm:items-center justify-between sm:justify-center gap-2 sm:gap-0 sm:text-center">
          <p className="text-xs text-white/50 sm:order-2 sm:mt-1">생성한 커리큘럼</p>
          <p className="text-2xl font-bold text-white sm:order-1">
            {dashboard?.stats?.totalCurriculums || 0}
          </p>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5 flex sm:flex-col items-center sm:items-center justify-between sm:justify-center gap-2 sm:gap-0 sm:text-center">
          <p className="text-xs text-white/50 sm:order-2 sm:mt-1">총 학습 시간</p>
          <p className="text-2xl font-bold text-white sm:order-1">
            {formatTime(dashboard?.stats?.totalLearningMinutes || 0)}
          </p>
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
            onClick={handleViewCurriculum}
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

      {/* Roadmap Modal - 온보딩 완료 후 표시 */}
      <RoadmapModal
        isOpen={showRoadmapModal}
        onClose={handleRoadmapClose}
        onStartLearning={handleStartLearning}
        curriculum={roadmapCurriculum}
      />
    </div>
  )
}
