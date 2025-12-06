// 설정 관련 타입 및 유틸리티 함수

// ============ 타입 정의 ============

export interface UserProfile {
  nickname: string
  avatarEmoji: string
  createdAt: string
}

export interface NotificationSettings {
  dailyReminder: boolean
  stepComplete: boolean
  achievementUnlock: boolean
  weeklyReport: boolean
}

export interface AppSettings {
  profile: UserProfile
  notifications: NotificationSettings
}

// ============ 기본값 ============

export const DEFAULT_PROFILE: UserProfile = {
  nickname: '창업가',
  avatarEmoji: '🚀',
  createdAt: new Date().toISOString()
}

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  dailyReminder: true,
  stepComplete: true,
  achievementUnlock: true,
  weeklyReport: false
}

export const DEFAULT_SETTINGS: AppSettings = {
  profile: DEFAULT_PROFILE,
  notifications: DEFAULT_NOTIFICATIONS
}

// 아바타 이모지 옵션
export const AVATAR_OPTIONS = [
  '🚀', '💡', '🎯', '⭐', '🔥', '💪',
  '🌟', '✨', '🎨', '📈', '💎', '🏆'
]

// ============ 유틸리티 함수 ============

const SETTINGS_KEY = 'mate-settings'

/**
 * 설정 불러오기
 */
export function getSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS
  }

  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as AppSettings
      // 기본값과 병합 (새로운 설정 항목 대응)
      return {
        profile: { ...DEFAULT_PROFILE, ...parsed.profile },
        notifications: { ...DEFAULT_NOTIFICATIONS, ...parsed.notifications }
      }
    }
  } catch {
    console.error('설정 불러오기 실패')
  }

  return DEFAULT_SETTINGS
}

/**
 * 설정 저장하기
 */
export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    console.error('설정 저장 실패')
  }
}

/**
 * 프로필 업데이트
 */
export function updateProfile(profile: Partial<UserProfile>): AppSettings {
  const current = getSettings()
  const updated: AppSettings = {
    ...current,
    profile: { ...current.profile, ...profile }
  }
  saveSettings(updated)
  return updated
}

/**
 * 알림 설정 업데이트
 */
export function updateNotifications(notifications: Partial<NotificationSettings>): AppSettings {
  const current = getSettings()
  const updated: AppSettings = {
    ...current,
    notifications: { ...current.notifications, ...notifications }
  }
  saveSettings(updated)
  return updated
}

/**
 * 학습 기록 초기화 (모든 진행 상황 삭제)
 */
export function resetLearningData(): void {
  if (typeof window === 'undefined') return

  // progress-* 키 삭제
  const keysToDelete: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('progress-')) {
      keysToDelete.push(key)
    }
  }
  keysToDelete.forEach(key => localStorage.removeItem(key))

  // 활동 기록 삭제
  localStorage.removeItem('mate-activities')

  // 진단 결과 삭제
  localStorage.removeItem('diagnosisCategory')
  localStorage.removeItem('diagnosisResult')
}

/**
 * AI 채팅 기록 삭제
 */
export function clearChatHistory(): void {
  if (typeof window === 'undefined') return

  // chat-* 키 삭제
  const keysToDelete: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('chat-')) {
      keysToDelete.push(key)
    }
  }
  keysToDelete.forEach(key => localStorage.removeItem(key))

  // 일반 채팅 기록도 삭제
  localStorage.removeItem('mate-chat-history')
}

/**
 * 모든 데이터 삭제 (계정 탈퇴 시)
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return

  // MATE 관련 모든 데이터 삭제
  const keysToDelete: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (
      key.startsWith('progress-') ||
      key.startsWith('chat-') ||
      key.startsWith('mate-') ||
      key === 'diagnosisCategory' ||
      key === 'diagnosisResult'
    )) {
      keysToDelete.push(key)
    }
  }
  keysToDelete.forEach(key => localStorage.removeItem(key))
}

/**
 * 앱 버전 정보
 */
export const APP_INFO = {
  version: '1.0.0',
  buildDate: '2024-01',
  developer: 'MATE Team'
}
