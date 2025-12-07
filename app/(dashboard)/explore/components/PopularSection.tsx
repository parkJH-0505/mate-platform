'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface PopularContent {
  id: string
  title: string
  content_type: string
  duration_minutes: number | null
  thumbnail_url: string | null
  category: string | null
  level: number
  view_count: number
  like_count: number
}

const TYPE_ICONS: Record<string, string> = {
  video: '🎬',
  article: '📄',
  template: '📋',
  project: '🎯',
  audio: '🎧'
}

export function PopularSection({ onOpenContent }: { onOpenContent?: (contentId: string) => void }) {
  const [popular, setPopular] = useState<PopularContent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPopular()
  }, [])

  const fetchPopular = async () => {
    try {
      const response = await fetch('/api/contents/popular?limit=5')
      const data = await response.json()

      if (data.success) {
        setPopular(data.popular)
      }
    } catch (error) {
      console.error('Failed to fetch popular:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <PopularSkeleton />
  }

  if (popular.length === 0) {
    return null
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>🔥</span>
          인기 콘텐츠
        </h2>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {popular.map((content, index) => (
            <PopularCard
              key={content.id}
              content={content}
              index={index}
              onOpen={onOpenContent}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function PopularCard({
  content,
  index,
  onOpen
}: {
  content: PopularContent
  index: number
  onOpen?: (contentId: string) => void
}) {
  const duration = content.duration_minutes || 5

  const handleClick = () => {
    if (onOpen) {
      onOpen(content.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-64"
    >
      <button
        onClick={handleClick}
        className="
          w-full block rounded-xl overflow-hidden text-left
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
              <span className="text-4xl opacity-30">
                {TYPE_ICONS[content.content_type] || '📚'}
              </span>
            </div>
          )}

          {/* 순위 뱃지 */}
          <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-purple-500 text-white text-sm font-bold flex items-center justify-center">
            {index + 1}
          </div>

          {/* 시간 뱃지 */}
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-xs">
            {duration}분
          </div>
        </div>

        {/* 콘텐츠 정보 */}
        <div className="p-3">
          <h4 className="text-sm font-medium text-white/90 line-clamp-2 group-hover:text-white">
            {content.title}
          </h4>

          <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {content.view_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {content.like_count.toLocaleString()}
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

function PopularSkeleton() {
  return (
    <section className="mb-8">
      <div className="h-6 w-32 bg-white/[0.05] rounded animate-pulse mb-4" />
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-shrink-0 w-64 rounded-xl overflow-hidden bg-white/[0.05] border-2 border-white/[0.12]">
            <div className="aspect-video bg-white/[0.05] animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-full bg-white/[0.05] rounded animate-pulse" />
              <div className="h-3 w-20 bg-white/[0.05] rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
