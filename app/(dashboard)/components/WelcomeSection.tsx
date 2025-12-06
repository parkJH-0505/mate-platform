'use client'

import React from 'react'

interface WelcomeSectionProps {
  userName: string
  hasInProgress?: boolean
  isNewUser?: boolean
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName,
  hasInProgress = false,
  isNewUser = false
}) => {
  // 상태별 메시지 결정
  const getMessage = () => {
    if (isNewUser) {
      return {
        greeting: `${userName}님, 반가워요!`,
        subtitle: '첫 진단 결과가 준비되어 있어요.'
      }
    }
    if (hasInProgress) {
      return {
        greeting: `${userName}님, 이어서 할까요?`,
        subtitle: '진행 중인 해결책이 있어요.'
      }
    }
    return {
      greeting: `${userName}님, 오늘 뭘 해결할까요?`,
      subtitle: '새로운 고민을 입력하거나 추천 문제를 선택하세요.'
    }
  }

  const { greeting, subtitle } = getMessage()

  // 현재 시간에 따른 인사말 아이콘
  const getTimeIcon = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return '🌅'
    if (hour >= 12 && hour < 17) return '☀️'
    if (hour >= 17 && hour < 21) return '🌆'
    return '🌙'
  }

  return (
    <section className="mb-8">
      <div className="flex items-start gap-3">
        <span className="text-3xl">{getTimeIcon()}</span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {greeting}
          </h1>
          <p className="mt-1 text-white/50">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  )
}
