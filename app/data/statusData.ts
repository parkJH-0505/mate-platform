// ============================================
// 현황 페이지 데이터 타입 및 유틸리티
// ============================================

import {
  Problem,
  UserProgress,
  problems,
  calculateProgress,
  calculateStepProgress
} from './problemsData'

// -------------------- 타입 정의 --------------------

/** 전체 통계 */
export interface OverallStats {
  totalProblemsCompleted: number
  totalStepsCompleted: number
  totalChecklistsCompleted: number
  currentStreak: number          // 연속 학습 일수
  longestStreak: number          // 최장 연속 일수
  estimatedMinutes: number       // 총 학습 시간 (분)
  lastActiveDate: string         // 마지막 활동일
}

/** 문제 진행 상태 */
export interface ProblemProgress {
  problemId: string
  problemTitle: string
  problemIcon: string
  status: 'in_progress' | 'completed' | 'locked'
  totalSteps: number
  completedSteps: number
  progressPercent: number
  startedAt?: string
  completedAt?: string
  estimatedMinutes: number
}

/** 활동 기록 타입 */
export type ActivityType =
  | 'step_complete'
  | 'problem_complete'
  | 'checklist_complete'
  | 'streak_milestone'
  | 'problem_start'

/** 활동 기록 */
export interface ActivityRecord {
  id: string
  type: ActivityType
  title: string
  description?: string
  problemId?: string
  stepId?: string
  timestamp: string
  icon: string
}

/** 성취 배지 */
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  isUnlocked: boolean
  progress?: {
    current: number
    target: number
  }
}

// -------------------- 기본 배지 데이터 --------------------

export const defaultAchievements: Achievement[] = [
  {
    id: 'first_step',
    title: '첫 발걸음',
    description: '첫 번째 체크리스트 완료',
    icon: '🌟',
    isUnlocked: false
  },
  {
    id: 'streak_3',
    title: '3일 연속',
    description: '3일 연속 학습 달성',
    icon: '🔥',
    isUnlocked: false,
    progress: { current: 0, target: 3 }
  },
  {
    id: 'first_problem',
    title: '문제 해결사',
    description: '첫 번째 문제 완료',
    icon: '🎯',
    isUnlocked: false
  },
  {
    id: 'streak_7',
    title: '일주일 마스터',
    description: '7일 연속 학습 달성',
    icon: '💪',
    isUnlocked: false,
    progress: { current: 0, target: 7 }
  },
  {
    id: 'step_complete_5',
    title: '꾸준함의 힘',
    description: '5개 단계 완료',
    icon: '✨',
    isUnlocked: false,
    progress: { current: 0, target: 5 }
  },
  {
    id: 'checklist_10',
    title: '체크마스터',
    description: '10개 체크리스트 완료',
    icon: '✅',
    isUnlocked: false,
    progress: { current: 0, target: 10 }
  }
]

// -------------------- 유틸리티 함수 --------------------

/** ID 생성 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/** 날짜를 YYYY-MM-DD 형식으로 변환 */
function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

/** 오늘 날짜 키 */
function getTodayKey(): string {
  return formatDateKey(new Date())
}

/** 연속 학습 일수 계산 */
export function calculateStreak(activityDates: string[]): { current: number; longest: number } {
  if (activityDates.length === 0) {
    return { current: 0, longest: 0 }
  }

  // 고유한 날짜만 추출하고 정렬
  const uniqueDates = [...new Set(activityDates.map(d => d.split('T')[0]))].sort().reverse()

  const today = getTodayKey()
  const yesterday = formatDateKey(new Date(Date.now() - 24 * 60 * 60 * 1000))

  // 오늘 또는 어제 활동이 없으면 현재 스트릭 0
  let currentStreak = 0
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1
    let checkDate = new Date(uniqueDates[0])

    for (let i = 1; i < uniqueDates.length; i++) {
      checkDate.setDate(checkDate.getDate() - 1)
      const expectedDate = formatDateKey(checkDate)

      if (uniqueDates[i] === expectedDate) {
        currentStreak++
      } else {
        break
      }
    }
  }

  // 최장 스트릭 계산
  let longestStreak = 1
  let tempStreak = 1

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1])
    const currDate = new Date(uniqueDates[i])
    const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / (24 * 60 * 60 * 1000))

    if (diffDays === 1) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 1
    }
  }

  return { current: currentStreak, longest: Math.max(longestStreak, currentStreak) }
}

/** localStorage에서 활동 기록 가져오기 */
export function getActivityRecords(limit?: number): ActivityRecord[] {
  if (typeof window === 'undefined') return []

  try {
    const saved = localStorage.getItem('activity-records')
    if (!saved) return []

    const records = JSON.parse(saved) as ActivityRecord[]
    return limit ? records.slice(0, limit) : records
  } catch {
    return []
  }
}

/** 활동 기록 저장 */
export function saveActivity(activity: Omit<ActivityRecord, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return

  const records = getActivityRecords()
  const newRecord: ActivityRecord = {
    ...activity,
    id: generateId(),
    timestamp: new Date().toISOString()
  }

  records.unshift(newRecord)

  // 최대 100개까지만 저장
  const trimmed = records.slice(0, 100)
  localStorage.setItem('activity-records', JSON.stringify(trimmed))

  // 스트릭 마일스톤 체크
  checkStreakMilestone()
}

/** 스트릭 마일스톤 체크 및 기록 */
function checkStreakMilestone(): void {
  const records = getActivityRecords()
  const dates = records.map(r => r.timestamp)
  const { current } = calculateStreak(dates)

  // 이미 기록된 마일스톤인지 확인
  const milestones = [3, 7, 14, 30]
  for (const milestone of milestones) {
    if (current === milestone) {
      const existingMilestone = records.find(
        r => r.type === 'streak_milestone' && r.title.includes(`${milestone}일`)
      )
      if (!existingMilestone) {
        const milestoneRecord: ActivityRecord = {
          id: generateId(),
          type: 'streak_milestone',
          title: `${milestone}일 연속 학습 달성!`,
          description: '대단해요! 계속 이어가세요!',
          icon: '🔥',
          timestamp: new Date().toISOString()
        }
        const allRecords = getActivityRecords()
        allRecords.unshift(milestoneRecord)
        localStorage.setItem('activity-records', JSON.stringify(allRecords.slice(0, 100)))
      }
    }
  }
}

/** 모든 진행 상태 가져오기 */
export function getAllProgressData(): { problem: Problem; progress: UserProgress }[] {
  if (typeof window === 'undefined') return []

  const result: { problem: Problem; progress: UserProgress }[] = []

  for (const problem of Object.values(problems)) {
    const savedProgress = localStorage.getItem(`progress-${problem.id}`)
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress) as UserProgress
        result.push({ problem, progress })
      } catch {
        // 파싱 실패 무시
      }
    }
  }

  return result
}

/** 전체 통계 계산 */
export function calculateOverallStats(): OverallStats {
  const allData = getAllProgressData()
  const activities = getActivityRecords()
  const dates = activities.map(r => r.timestamp)
  const streakData = calculateStreak(dates)

  let totalProblemsCompleted = 0
  let totalStepsCompleted = 0
  let totalChecklistsCompleted = 0
  let estimatedMinutes = 0

  for (const { problem, progress } of allData) {
    // 완료된 문제 수
    if (progress.completedAt) {
      totalProblemsCompleted++
    }

    // 완료된 단계 및 체크리스트 수
    for (const stepProgress of progress.stepProgress) {
      if (stepProgress.status === 'completed') {
        totalStepsCompleted++
        const step = problem.steps.find(s => s.id === stepProgress.stepId)
        if (step) {
          estimatedMinutes += step.estimatedMinutes
        }
      }

      totalChecklistsCompleted += stepProgress.checklistProgress.filter(c => c.completed).length
    }
  }

  const lastActivity = activities[0]

  return {
    totalProblemsCompleted,
    totalStepsCompleted,
    totalChecklistsCompleted,
    currentStreak: streakData.current,
    longestStreak: streakData.longest,
    estimatedMinutes,
    lastActiveDate: lastActivity?.timestamp || ''
  }
}

/** 문제별 진행 상황 목록 가져오기 */
export function getProblemProgressList(): ProblemProgress[] {
  const allData = getAllProgressData()
  const result: ProblemProgress[] = []

  // 진행 중인 문제들
  for (const { problem, progress } of allData) {
    const completedSteps = progress.stepProgress.filter(sp => sp.status === 'completed').length
    const progressPercent = calculateProgress(progress)

    result.push({
      problemId: problem.id,
      problemTitle: problem.title,
      problemIcon: problem.icon,
      status: progress.completedAt ? 'completed' : 'in_progress',
      totalSteps: problem.steps.length,
      completedSteps,
      progressPercent,
      startedAt: progress.startedAt,
      completedAt: progress.completedAt,
      estimatedMinutes: problem.totalMinutes
    })
  }

  // 아직 시작하지 않은 문제들 (잠금 상태)
  for (const problem of Object.values(problems)) {
    const exists = result.find(r => r.problemId === problem.id)
    if (!exists) {
      result.push({
        problemId: problem.id,
        problemTitle: problem.title,
        problemIcon: problem.icon,
        status: 'locked',
        totalSteps: problem.steps.length,
        completedSteps: 0,
        progressPercent: 0,
        estimatedMinutes: problem.totalMinutes
      })
    }
  }

  // 정렬: 진행 중 > 완료 > 잠금
  const statusOrder = { in_progress: 0, completed: 1, locked: 2 }
  result.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

  return result
}

/** 배지 상태 계산 */
export function calculateAchievements(): Achievement[] {
  const stats = calculateOverallStats()
  const achievements = JSON.parse(JSON.stringify(defaultAchievements)) as Achievement[]

  for (const achievement of achievements) {
    switch (achievement.id) {
      case 'first_step':
        achievement.isUnlocked = stats.totalChecklistsCompleted >= 1
        if (achievement.isUnlocked) {
          achievement.unlockedAt = getFirstChecklistDate()
        }
        break

      case 'streak_3':
        achievement.isUnlocked = stats.longestStreak >= 3
        if (achievement.progress) {
          achievement.progress.current = Math.min(stats.currentStreak, 3)
        }
        break

      case 'streak_7':
        achievement.isUnlocked = stats.longestStreak >= 7
        if (achievement.progress) {
          achievement.progress.current = Math.min(stats.currentStreak, 7)
        }
        break

      case 'first_problem':
        achievement.isUnlocked = stats.totalProblemsCompleted >= 1
        break

      case 'step_complete_5':
        achievement.isUnlocked = stats.totalStepsCompleted >= 5
        if (achievement.progress) {
          achievement.progress.current = Math.min(stats.totalStepsCompleted, 5)
        }
        break

      case 'checklist_10':
        achievement.isUnlocked = stats.totalChecklistsCompleted >= 10
        if (achievement.progress) {
          achievement.progress.current = Math.min(stats.totalChecklistsCompleted, 10)
        }
        break
    }
  }

  return achievements
}

/** 첫 체크리스트 완료 날짜 가져오기 */
function getFirstChecklistDate(): string {
  const activities = getActivityRecords()
  const firstChecklist = [...activities]
    .reverse()
    .find(a => a.type === 'checklist_complete')
  return firstChecklist?.timestamp || ''
}

/** 날짜 포맷팅 (오늘, 어제, n일 전, 날짜) */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const dateOnly = formatDateKey(date)
  const todayOnly = formatDateKey(today)
  const yesterdayOnly = formatDateKey(yesterday)

  if (dateOnly === todayOnly) return '오늘'
  if (dateOnly === yesterdayOnly) return '어제'

  const diffTime = today.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 7) return `${diffDays}일 전`

  // 날짜 표시 (12월 5일 형식)
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

/** 시간 포맷팅 (HH:MM) */
export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/** 활동을 날짜별로 그룹화 */
export function groupActivitiesByDate(activities: ActivityRecord[]): Record<string, ActivityRecord[]> {
  const groups: Record<string, ActivityRecord[]> = {}

  for (const activity of activities) {
    const dateKey = formatRelativeDate(activity.timestamp)
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(activity)
  }

  return groups
}

/** 분을 시간:분 형식으로 변환 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}분`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours}시간`
  return `${hours}시간 ${mins}분`
}
