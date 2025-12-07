'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface WeeklyGoalProps {
  target: number
  completed: number
  progress: number
  isAchieved: boolean
  bonusXP: number
  onSetGoal?: (target: number) => void
  isNew?: boolean
}

export const WeeklyGoal: React.FC<WeeklyGoalProps> = ({
  target,
  completed,
  progress,
  isAchieved,
  bonusXP,
  onSetGoal,
  isNew = false
}) => {
  const [showGoalSetter, setShowGoalSetter] = useState(isNew)
  const [selectedGoal, setSelectedGoal] = useState(target)

  const goalOptions = [3, 5, 7, 10]

  const handleSetGoal = () => {
    if (onSetGoal) {
      onSetGoal(selectedGoal)
    }
    setShowGoalSetter(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="text-sm font-medium text-white/60">이번 주 목표</p>
            <p className="text-sm font-semibold text-white">
              {target}개 콘텐츠 완료하기
            </p>
          </div>
        </div>

        {isAchieved ? (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
            <span className="text-sm">✅</span>
            <span className="text-xs font-medium text-green-400">달성!</span>
          </div>
        ) : (
          <button
            onClick={() => setShowGoalSetter(true)}
            className="text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            목표 변경
          </button>
        )}
      </div>

      {/* Goal Setter Modal */}
      {showGoalSetter && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10"
        >
          <p className="text-sm text-white/60 mb-3">이번 주 목표 설정</p>
          <div className="flex gap-2 mb-3">
            {goalOptions.map((goal) => (
              <button
                key={goal}
                onClick={() => setSelectedGoal(goal)}
                className={`
                  flex-1 py-2 rounded-lg text-sm font-medium transition-all
                  ${selectedGoal === goal
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                  }
                `}
              >
                {goal}개
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowGoalSetter(false)}
              className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 text-sm"
            >
              취소
            </button>
            <button
              onClick={handleSetGoal}
              className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium"
            >
              설정
            </button>
          </div>
        </motion.div>
      )}

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/70">
            <span className="text-lg font-bold text-white">{completed}</span>
            <span className="text-white/40"> / {target}</span>
          </span>
          <span className="text-xs text-green-400/80">
            +{bonusXP} XP 보너스
          </span>
        </div>

        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`
              h-full rounded-full
              ${isAchieved
                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                : 'bg-gradient-to-r from-green-500/80 to-emerald-500/80'
              }
            `}
          />
        </div>

        {!isAchieved && (
          <p className="text-center text-xs text-white/40">
            목표까지 {target - completed}개 남았어요
          </p>
        )}

        {isAchieved && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-green-400"
          >
            🎉 이번 주 목표 달성! +{bonusXP} XP
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
