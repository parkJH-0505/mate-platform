'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Props {
  content: {
    id: string
    title: string
    content_type: string
    duration_minutes: number | null
    thumbnail_url: string | null
    category: string | null
    level: number
    view_count: number
    like_count: number
    save_count: number
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
  1: { label: '입문', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  2: { label: '초급', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  3: { label: '중급', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  4: { label: '고급', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  5: { label: '전문가', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
}

export function ContentCard({ content, index }: Props) {
  const levelBadge = LEVEL_BADGES[content.level] || LEVEL_BADGES[2]
  const duration = content.duration_minutes || 5

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        href={`/content/${content.id}`}
        className="
          block rounded-xl overflow-hidden
          bg-white/[0.05] border-2 border-white/[0.12]
          hover:border-white/[0.2] hover:bg-white/[0.08]
          transition-all group
          backdrop-blur-sm
          shadow-[0_4px_16px_0_rgba(0,0,0,0.2)]
        "
      >
        {/* 썸네일 */}
        <div className="aspect-video bg-white/[0.05] relative overflow-hidden">
          {content.thumbnail_url ? (
            <img
              src={content.thumbnail_url}
              alt={content.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-30">
                {TYPE_ICONS[content.content_type] || '📚'}
              </span>
            </div>
          )}

          {/* 시간 뱃지 */}
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-xs">
            {duration}분
          </div>

          {/* 콘텐츠 유형 */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 text-white text-xs flex items-center gap-1">
            <span>{TYPE_ICONS[content.content_type]}</span>
          </div>
        </div>

        {/* 콘텐츠 정보 */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${levelBadge.color}`}>
              {levelBadge.label}
            </span>
          </div>

          <h4 className="font-medium text-white/90 line-clamp-2 group-hover:text-white mb-3 min-h-[2.5rem]">
            {content.title}
          </h4>

          {/* 통계 */}
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formatCount(content.view_count)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {formatCount(content.like_count)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {formatCount(content.save_count)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
