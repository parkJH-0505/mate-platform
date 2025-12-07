'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LevelProgressProps {
  level: number
  name: string
  icon: string
  currentXP: number
  nextLevelXP: number
  progress: number
  totalXP: number
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  level,
  name,
  icon,
  currentXP,
  nextLevelXP,
  progress,
  totalXP
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-accent-purple/10 to-primary/5 border border-accent-purple/20 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="text-sm font-medium text-white/60">Lv.{level}</p>
            <p className="text-sm font-semibold text-white">{name}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-white/50">총 XP</p>
          <p className="text-lg font-bold text-accent-purple">{totalXP}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-white/50">
          <span>{currentXP} XP</span>
          <span>{nextLevelXP} XP</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-accent-purple to-primary rounded-full"
          />
        </div>
        <p className="text-center text-xs text-white/40">
          다음 레벨까지 {nextLevelXP - currentXP} XP
        </p>
      </div>
    </motion.div>
  )
}
