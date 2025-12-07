'use client'

import React, { useState } from 'react'
import { FilterModal } from './FilterModal'

interface Filters {
  category: string | null
  level: number | null
  contentType: string | null
  sort: string
}

interface Props {
  search: string
  onSearchChange: (value: string) => void
  filters: Filters
  onFilterChange: (key: string, value: any) => void
}

export function ExploreHeader({ search, onSearchChange, filters, onFilterChange }: Props) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const activeFilterCount = [
    filters.level,
    filters.contentType
  ].filter(Boolean).length

  return (
    <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* 타이틀 */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">콘텐츠 탐색</h1>
        </div>

        {/* 검색 + 필터 */}
        <div className="flex items-center gap-3">
          {/* 검색 입력 */}
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="콘텐츠 검색..."
              className="
                w-full pl-10 pr-4 py-3 rounded-xl
                bg-white/[0.05] border border-white/[0.08]
                text-white placeholder-white/40
                focus:border-purple-500/50 focus:outline-none
                transition-colors
              "
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* 필터 버튼 */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="
              relative px-4 py-3 rounded-xl
              bg-white/[0.05] border border-white/[0.08]
              text-white/70 hover:text-white hover:bg-white/[0.08]
              transition-colors flex items-center gap-2
            "
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="hidden sm:inline">필터</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full text-xs flex items-center justify-center text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 필터 모달 */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    </header>
  )
}
