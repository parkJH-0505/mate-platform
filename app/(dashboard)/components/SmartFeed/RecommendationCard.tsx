'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Props {
  recommendation: {
    id: string
    title: string
    content_type: string
    duration_minutes: number | null
    thumbnail_url: string | null
    category: string | null
    level: number
    recommendReason: string
  }
  index: number
}

const TYPE_ICONS: Record<string, string> = {
  video: '🎬',
  article: '📄',
  template: '📋',
  project: '🎯',
  audio: '🎧'
}

const LEVEL_BADGES: Record<number, { label: string; color: string }> = {
  1: { label: '입문', color: 'bg-green-500/20 text-green-400' },
  2: { label: '초급', color: 'bg-blue-500/20 text-blue-400' },
  3: { label: '중급', color: 'bg-yellow-500/20 text-yellow-400' },
  4: { label: '고급', color: 'bg-orange-500/20 text-orange-400' },
  5: { label: '전문가', color: 'bg-red-500/20 text-red-400' }
}

export function RecommendationCard({ recommendation, index }: Props) {
  const levelBadge = LEVEL_BADGES[recommendation.level] || LEVEL_BADGES[2]
  const duration = recommendation.duration_minutes || 5

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={`/content/${recommendation.id}`}
        className="
          block p-3 rounded-xl
          bg-white/[0.03] border border-white/[0.06]
          hover:bg-white/[0.06] hover:border-white/[0.1]
          transition-all group
        "
      >
        <div className="flex gap-3">
          {/* 썸네일 또는 아이콘 */}
          <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-white/[0.05] overflow-hidden">
            {recommendation.thumbnail_url ? (
              <img
                src={recommendation.thumbnail_url}
                alt={recommendation.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl">
                  {TYPE_ICONS[recommendation.content_type] || '📚'}
                </span>
              </div>
            )}
          </div>

          {/* 콘텐츠 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${levelBadge.color}`}>
                {levelBadge.label}
              </span>
              <span className="text-[10px] text-white/40">
                {duration}분
              </span>
            </div>

            <h4 className="text-sm font-medium text-white/90 truncate group-hover:text-white">
              {recommendation.title}
            </h4>

            {/* 추천 이유 */}
            <p className="text-xs text-purple-400/80 mt-1 truncate">
              💡 {recommendation.recommendReason}
            </p>
          </div>

          {/* 화살표 */}
          <div className="flex-shrink-0 self-center">
            <svg
              className="w-5 h-5 text-white/30 group-hover:text-white/50 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
