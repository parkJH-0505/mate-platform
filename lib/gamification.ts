// 레벨 정의
export const LEVELS = [
  { level: 1, name: '새싹 창업가', icon: '🌱', requiredXP: 0 },
  { level: 2, name: '성장하는 창업가', icon: '🌿', requiredXP: 100 },
  { level: 3, name: '도전하는 창업가', icon: '🌳', requiredXP: 300 },
  { level: 4, name: '성취하는 창업가', icon: '🎯', requiredXP: 600 },
  { level: 5, name: '전문 창업가', icon: '🚀', requiredXP: 1000 },
  { level: 6, name: '마스터 창업가', icon: '👑', requiredXP: 1500 },
]

// XP 보상 정의
export const XP_REWARDS = {
  CONTENT_COMPLETE: 10,
  DAILY_FIRST_LEARNING: 5,
  STREAK_7_DAYS: 50,
  STREAK_30_DAYS: 200,
  CURRICULUM_COMPLETE: 100,
  WEEKLY_GOAL_ACHIEVED: 30,
  LEVEL_UP: 25,
}

// 뱃지 정의 (객체)
export const BADGES = {
  first_content: { id: 'first_content', name: '첫 발걸음', icon: '👣', description: '첫 번째 콘텐츠 완료' },
  streak_7: { id: 'streak_7', name: '꾸준함의 힘', icon: '🔥', description: '7일 연속 학습' },
  streak_30: { id: 'streak_30', name: '불굴의 의지', icon: '💪', description: '30일 연속 학습' },
  curriculum_complete: { id: 'curriculum_complete', name: '커리큘럼 마스터', icon: '🎓', description: '커리큘럼 100% 완료' },
  contents_100: { id: 'contents_100', name: '열정의 학습자', icon: '⭐', description: '100개 콘텐츠 완료' },
  first_subscription: { id: 'first_subscription', name: '프리미엄 멤버', icon: '💎', description: '첫 구독 시작' },
  early_bird: { id: 'early_bird', name: '얼리버드', icon: '🌅', description: '오전 6시 전 학습' },
  night_owl: { id: 'night_owl', name: '올빼미', icon: '🦉', description: '자정 이후 학습' },
  weekend_warrior: { id: 'weekend_warrior', name: '주말 전사', icon: '⚔️', description: '주말에 3개 이상 완료' },
  goal_achiever: { id: 'goal_achiever', name: '목표 달성자', icon: '🎯', description: '주간 목표 달성' },
}

// 뱃지 정의 (배열 - API용)
export const BADGE_DEFINITIONS: Array<{
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requirement: string
}> = [
  { id: 'first_step', name: '첫 발걸음', description: '첫 번째 콘텐츠를 완료했습니다', icon: '👣', rarity: 'common', requirement: '첫 콘텐츠 완료' },
  { id: 'week_warrior', name: '일주일 전사', description: '7일 연속 학습을 달성했습니다', icon: '🔥', rarity: 'rare', requirement: '7일 연속 학습' },
  { id: 'month_master', name: '한 달의 마스터', description: '30일 연속 학습을 달성했습니다', icon: '💪', rarity: 'epic', requirement: '30일 연속 학습' },
  { id: 'curriculum_complete', name: '커리큘럼 마스터', description: '커리큘럼을 100% 완료했습니다', icon: '🎓', rarity: 'epic', requirement: '커리큘럼 100% 완료' },
  { id: 'century', name: '백전백승', description: '100개의 콘텐츠를 완료했습니다', icon: '⭐', rarity: 'legendary', requirement: '100개 콘텐츠 완료' },
  { id: 'premium', name: '프리미엄 멤버', description: '프리미엄 구독을 시작했습니다', icon: '💎', rarity: 'rare', requirement: '프리미엄 구독' },
  { id: 'early_bird', name: '얼리버드', description: '오전 6시 전에 학습을 시작했습니다', icon: '🌅', rarity: 'common', requirement: '오전 6시 전 학습' },
  { id: 'night_owl', name: '올빼미', description: '자정 이후에 학습을 완료했습니다', icon: '🦉', rarity: 'common', requirement: '자정 이후 학습' },
  { id: 'weekend_warrior', name: '주말 전사', description: '주말에 3개 이상의 콘텐츠를 완료했습니다', icon: '⚔️', rarity: 'rare', requirement: '주말 3개+ 완료' },
  { id: 'goal_achiever', name: '목표 달성자', description: '주간 목표를 달성했습니다', icon: '🎯', rarity: 'common', requirement: '주간 목표 달성' },
]

// 레벨 계산 함수
export function calculateLevel(totalXP: number): { level: number; name: string; icon: string; currentXP: number; nextLevelXP: number; progress: number } {
  let currentLevel = LEVELS[0]
  let nextLevel = LEVELS[1]

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].requiredXP) {
      currentLevel = LEVELS[i]
      nextLevel = LEVELS[i + 1] || LEVELS[i]
      break
    }
  }

  const currentLevelXP = totalXP - currentLevel.requiredXP
  const xpNeededForNext = nextLevel.requiredXP - currentLevel.requiredXP
  const progress = xpNeededForNext > 0 ? Math.round((currentLevelXP / xpNeededForNext) * 100) : 100

  return {
    level: currentLevel.level,
    name: currentLevel.name,
    icon: currentLevel.icon,
    currentXP: currentLevelXP,
    nextLevelXP: xpNeededForNext,
    progress: Math.min(progress, 100)
  }
}

// 스트릭 계산 함수
export function calculateStreak(lastActivityDate: string | null, currentStreak: number): { newStreak: number; isNewDay: boolean; shouldUpdate: boolean } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (!lastActivityDate) {
    return { newStreak: 1, isNewDay: true, shouldUpdate: true }
  }

  const lastDate = new Date(lastActivityDate)
  lastDate.setHours(0, 0, 0, 0)

  const diffTime = today.getTime() - lastDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    // 오늘 이미 활동함
    return { newStreak: currentStreak, isNewDay: false, shouldUpdate: false }
  } else if (diffDays === 1) {
    // 어제 활동 → 스트릭 유지
    return { newStreak: currentStreak + 1, isNewDay: true, shouldUpdate: true }
  } else {
    // 이틀 이상 지남 → 스트릭 리셋
    return { newStreak: 1, isNewDay: true, shouldUpdate: true }
  }
}

// 주차 시작일 계산 (월요일)
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 월요일로 조정
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}

// 이번 주의 요일별 활동 배열 생성
export function getWeeklyActivityArray(activities: { activity_date: string }[]): boolean[] {
  const weekStart = new Date(getWeekStart())
  const result: boolean[] = [false, false, false, false, false, false, false]

  activities.forEach(activity => {
    const activityDate = new Date(activity.activity_date)
    const diffTime = activityDate.getTime() - weekStart.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays >= 0 && diffDays < 7) {
      result[diffDays] = true
    }
  })

  return result
}
