'use client'

import React from 'react'
import { ContentCard } from './ContentCard'

interface Content {
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

interface Props {
  contents: Content[]
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
}

export function ContentGrid({ contents, isLoading, hasMore, onLoadMore }: Props) {
  if (isLoading && contents.length === 0) {
    return <GridSkeleton />
  }

  if (!isLoading && contents.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl mb-4 block">🔍</span>
        <p className="text-white/60 mb-2">검색 결과가 없습니다</p>
        <p className="text-white/40 text-sm">다른 키워드나 필터로 검색해보세요</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents.map((content, index) => (
          <ContentCard key={content.id} content={content} index={index} />
        ))}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="
              px-6 py-3 rounded-xl
              bg-white/[0.05] text-white/70
              hover:bg-white/[0.1] hover:text-white
              transition-colors disabled:opacity-50
            "
          >
            {isLoading ? '로딩 중...' : '더 보기'}
          </button>
        </div>
      )}
    </div>
  )
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
          <div className="aspect-video bg-white/[0.05] animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-16 bg-white/[0.05] rounded animate-pulse" />
            <div className="h-5 w-full bg-white/[0.05] rounded animate-pulse" />
            <div className="h-4 w-24 bg-white/[0.05] rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
