'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  isEarned: boolean
  earnedAt?: string
  progress?: number
  requirement?: string
}

interface RecentBadge {
  id: string
  name: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface BadgeShowcaseProps {
  badges: Badge[]
  recentBadge?: RecentBadge
}

const rarityColors = {
  common: {
    bg: 'from-gray-500/20 to-gray-600/10',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
    glow: ''
  },
  rare: {
    bg: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/20'
  },
  epic: {
    bg: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20'
  },
  legendary: {
    bg: 'from-yellow-500/20 to-orange-600/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/30'
  }
}

const rarityLabels = {
  common: '일반',
  rare: '레어',
  epic: '에픽',
  legendary: '전설'
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({
  badges,
  recentBadge
}) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [showAll, setShowAll] = useState(false)

  const earnedBadges = badges.filter(b => b.isEarned)
  const lockedBadges = badges.filter(b => !b.isEarned)
  const displayedBadges = showAll ? badges : badges.slice(0, 6)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/20 p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="text-sm font-medium text-white/60">획득한 배지</p>
            <p className="text-lg font-bold text-white">
              {earnedBadges.length}
              <span className="text-sm font-normal text-white/40"> / {badges.length}</span>
            </p>
          </div>
        </div>

        {recentBadge && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30"
          >
            <span className="text-sm">{recentBadge.icon}</span>
            <span className="text-xs font-medium text-yellow-400">NEW!</span>
          </motion.div>
        )}
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {displayedBadges.map((badge) => {
          const colors = rarityColors[badge.rarity]
          return (
            <motion.button
              key={badge.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedBadge(badge)}
              className={`
                relative aspect-square rounded-xl
                bg-gradient-to-br ${colors.bg}
                border ${colors.border}
                flex items-center justify-center
                transition-all
                ${badge.isEarned ? `shadow-lg ${colors.glow}` : 'opacity-40 grayscale'}
              `}
            >
              <span className={`text-2xl ${!badge.isEarned ? 'opacity-50' : ''}`}>
                {badge.icon}
              </span>
              {!badge.isEarned && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                  <span className="text-lg">🔒</span>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Show All Button */}
      {badges.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-xs text-white/40 hover:text-white/60 transition-colors"
        >
          {showAll ? '접기' : `+${badges.length - 6}개 더 보기`}
        </button>
      )}

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                relative w-full max-w-xs
                rounded-2xl p-6
                bg-gradient-to-br ${rarityColors[selectedBadge.rarity].bg}
                border ${rarityColors[selectedBadge.rarity].border}
                bg-[#1a1a1a]
              `}
            >
              {/* Badge Icon */}
              <div className="text-center mb-4">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className={`
                    inline-block text-6xl
                    ${!selectedBadge.isEarned ? 'grayscale opacity-50' : ''}
                  `}
                >
                  {selectedBadge.icon}
                </motion.span>
              </div>

              {/* Badge Info */}
              <div className="text-center space-y-2">
                <span className={`
                  inline-block px-2 py-0.5 rounded text-xs font-medium
                  ${rarityColors[selectedBadge.rarity].text}
                  bg-white/5
                `}>
                  {rarityLabels[selectedBadge.rarity]}
                </span>
                <h3 className="text-lg font-bold text-white">{selectedBadge.name}</h3>
                <p className="text-sm text-white/60">{selectedBadge.description}</p>

                {selectedBadge.isEarned ? (
                  <p className="text-xs text-green-400">
                    ✅ {selectedBadge.earnedAt} 획득
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-white/40">
                      조건: {selectedBadge.requirement}
                    </p>
                    {selectedBadge.progress !== undefined && (
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${rarityColors[selectedBadge.rarity].text.replace('text', 'bg')}`}
                          style={{ width: `${selectedBadge.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="mt-4 w-full py-2 rounded-xl bg-white/10 text-white/60 text-sm hover:bg-white/20 transition-colors"
              >
                닫기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
