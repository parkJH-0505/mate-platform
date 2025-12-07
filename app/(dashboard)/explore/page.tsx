'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ExploreHeader } from './components/ExploreHeader'
import { CategoryTabs } from './components/CategoryTabs'
import { ContentGrid } from './components/ContentGrid'
import { PopularSection } from './components/PopularSection'
import { ContentDetailModal } from '../components/ContentDetailModal'

interface Filters {
  category: string | null
  level: number | null
  contentType: string | null
  search: string
  sort: string
}

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

interface Pagination {
  page: number
  totalPages: number
  hasMore: boolean
  total: number
}

export default function ExplorePage() {
  const [filters, setFilters] = useState<Filters>({
    category: null,
    level: null,
    contentType: null,
    search: '',
    sort: 'popular'
  })
  const [contents, setContents] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    hasMore: false,
    total: 0
  })

  // 모달 state
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchContents = useCallback(async (page = 1) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '12')
      params.set('sort', filters.sort)

      if (filters.category) params.set('category', filters.category)
      if (filters.level) params.set('level', filters.level.toString())
      if (filters.contentType) params.set('type', filters.contentType)
      if (filters.search) params.set('q', filters.search)

      const response = await fetch(`/api/contents?${params}`)
      const data = await response.json()

      if (data.success) {
        if (page === 1) {
          setContents(data.contents)
        } else {
          setContents(prev => [...prev, ...data.contents])
        }
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch contents:', error)
    } finally {
      setIsLoading(false)
    }
  }, [filters.category, filters.level, filters.contentType, filters.search, filters.sort])

  // 필터 변경 시 재조회 (검색 제외)
  useEffect(() => {
    fetchContents(1)
  }, [filters.category, filters.level, filters.contentType, filters.sort])

  // 검색어 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContents(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [filters.search])

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleLoadMore = () => {
    if (pagination.hasMore && !isLoading) {
      fetchContents(pagination.page + 1)
    }
  }

  const handleOpenContent = (contentId: string) => {
    setSelectedContentId(contentId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedContentId(null)
  }

  const hasActiveFilters = filters.category || filters.level || filters.contentType || filters.search

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* 헤더 */}
      <ExploreHeader
        search={filters.search}
        onSearchChange={(value) => handleFilterChange('search', value)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 필터가 없을 때만 인기 콘텐츠 표시 */}
        {!hasActiveFilters && (
          <PopularSection onOpenContent={handleOpenContent} />
        )}

        {/* 카테고리 탭 */}
        <CategoryTabs
          selected={filters.category}
          onSelect={(category) => handleFilterChange('category', category)}
        />

        {/* 결과 정보 */}
        {hasActiveFilters && pagination.total > 0 && (
          <div className="mb-4 text-sm text-white/50">
            {pagination.total}개의 콘텐츠
          </div>
        )}

        {/* 콘텐츠 그리드 */}
        <ContentGrid
          contents={contents}
          isLoading={isLoading}
          hasMore={pagination.hasMore}
          onLoadMore={handleLoadMore}
          onOpenContent={handleOpenContent}
        />
      </main>

      {/* Content Detail Modal */}
      {selectedContentId && (
        <ContentDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          contentId={selectedContentId}
        />
      )}
    </div>
  )
}
