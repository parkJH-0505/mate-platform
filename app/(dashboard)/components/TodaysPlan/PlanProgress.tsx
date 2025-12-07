'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Props {
  progress: number
  isCompleted?: boolean
}

export function PlanProgress({ progress, isCompleted = false }: Props) {
  return (
    <div className="relative h-2 bg-white/[0.05] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`
          absolute inset-y-0 left-0 rounded-full
          ${isCompleted
            ? 'bg-gradient-to-r from-green-500 to-green-400'
            : 'bg-gradient-to-r from-accent-purple to-purple-400'
          }
        `}
      />

      {/* 빛나는 효과 */}
      {progress > 0 && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut'
          }}
          className={`
            absolute inset-y-0 w-1/4
            bg-gradient-to-r from-transparent via-white/30 to-transparent
          `}
          style={{ left: 0, width: `${progress}%` }}
        />
      )}
    </div>
  )
}
