'use client'

import React from 'react'
import { Achievement } from '@/app/data/statusData'

interface BadgeCardProps {
  achievement: Achievement
}

const BadgeCard: React.FC<BadgeCardProps> = ({ achievement }) => {
  const { isUnlocked, progress } = achievement

  // 진행 중 상태 (프로그레스가 있고 아직 미획득)
  const isInProgress = !isUnlocked && progress && progress.current > 0

  return (
    <div className={`
      relative flex flex-col items-center p-3 rounded-xl
      transition-all duration-200
      ${isUnlocked
        ? 'bg-gradient-to-br from-primary/20 to-yellow-500/10 border border-primary/30'
        : isInProgress
          ? 'bg-white/[0.05] border border-white/[0.1]'
          : 'bg-white/[0.02] border border-white/[0.04] opacity-50'
      }
    `}>
      {/* 배지 아이콘 */}
      <div className={`
        text-3xl mb-2
        ${!isUnlocked && !isInProgress && 'grayscale'}
      `}>
        {isUnlocked ? achievement.icon : isInProgress ? achievement.icon : '🔒'}
      </div>

      {/* 상태 텍스트 */}
      <span className={`
        text-[10px] font-medium
        ${isUnlocked
          ? 'text-primary'
          : isInProgress
            ? 'text-white/60'
            : 'text-white/30'
        }
      `}>
        {isUnlocked ? '획득!' : isInProgress ? '진행중' : '미획득'}
      </span>

      {/* 프로그레스 바 (진행 중일 때) */}
      {isInProgress && progress && (
        <div className="w-full mt-2">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/50 rounded-full transition-all"
              style={{ width: `${(progress.current / progress.target) * 100}%` }}
            />
          </div>
          <p className="text-[9px] text-white/40 text-center mt-1">
            {progress.current}/{progress.target}
          </p>
        </div>
      )}

      {/* 획득 시 글로우 효과 */}
      {isUnlocked && (
        <div className="absolute inset-0 rounded-xl bg-primary/5 animate-pulse" />
      )}
    </div>
  )
}

interface AchievementBadgesProps {
  achievements: Achievement[]
  showAll?: boolean
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({
  achievements,
  showAll = false
}) => {
  // 정렬: 획득 > 진행 중 > 미획득
  const sortedAchievements = [...achievements].sort((a, b) => {
    const getOrder = (ach: Achievement) => {
      if (ach.isUnlocked) return 0
      if (ach.progress && ach.progress.current > 0) return 1
      return 2
    }
    return getOrder(a) - getOrder(b)
  })

  const displayAchievements = showAll
    ? sortedAchievements
    : sortedAchievements.slice(0, 4)

  const unlockedCount = achievements.filter(a => a.isUnlocked).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white/80">나의 성취</h3>
        <span className="text-xs text-white/40">
          {unlockedCount}/{achievements.length} 획득
        </span>
      </div>

      {/* 배지 그리드 */}
      <div className="grid grid-cols-4 gap-2">
        {displayAchievements.map(achievement => (
          <BadgeCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {/* 배지 설명 (첫 번째 미획득 배지) */}
      {!showAll && (
        <div className="text-center">
          <p className="text-xs text-white/40">
            다음 목표: {
              sortedAchievements.find(a => !a.isUnlocked)?.description || '모든 배지 획득!'
            }
          </p>
        </div>
      )}
    </div>
  )
}
