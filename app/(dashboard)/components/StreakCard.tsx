'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface StreakCardProps {
  current: number
  longest: number
  weeklyActivity: boolean[] // [월, 화, 수, 목, 금, 토, 일]
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

export const StreakCard: React.FC<StreakCardProps> = ({
  current,
  longest,
  weeklyActivity
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-lg font-bold text-white">
              {current}일 연속
            </p>
            <p className="text-xs text-white/50">
              최장 기록: {longest}일
            </p>
          </div>
        </div>

        {current >= 7 && (
          <div className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-medium">
            불타는 중! 🔥
          </div>
        )}
      </div>

      {/* Weekly Activity Dots */}
      <div className="flex justify-between items-center mt-4">
        {DAYS.map((day, index) => (
          <div key={day} className="flex flex-col items-center gap-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                weeklyActivity[index]
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-white/30'
              }`}
            >
              {weeklyActivity[index] ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
              )}
            </motion.div>
            <span className="text-[10px] text-white/40">{day}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
