'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Filters {
  category: string | null
  level: number | null
  contentType: string | null
  sort: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  filters: Filters
  onFilterChange: (key: string, value: any) => void
}

const LEVELS = [
  { id: 1, name: '입문', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 2, name: '초급', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 3, name: '중급', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 4, name: '고급', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 5, name: '전문가', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
]

const CONTENT_TYPES = [
  { id: 'video', name: '영상', icon: '🎬' },
  { id: 'article', name: '아티클', icon: '📄' },
  { id: 'template', name: '템플릿', icon: '📋' },
  { id: 'project', name: '프로젝트', icon: '🎯' },
  { id: 'audio', name: '오디오', icon: '🎧' }
]

const SORT_OPTIONS = [
  { id: 'popular', name: '인기순' },
  { id: 'newest', name: '최신순' },
  { id: 'likes', name: '좋아요순' },
  { id: 'az', name: '가나다순' }
]

export function FilterModal({ isOpen, onClose, filters, onFilterChange }: Props) {
  const handleReset = () => {
    onFilterChange('level', null)
    onFilterChange('contentType', null)
    onFilterChange('sort', 'popular')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* 모달 */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a2e] rounded-t-3xl max-h-[80vh] overflow-y-auto"
          >
            {/* 핸들 */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">필터</h3>
              <button
                onClick={handleReset}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                초기화
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* 레벨 */}
              <div>
                <h4 className="text-sm font-medium text-white/70 mb-3">레벨</h4>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => onFilterChange('level', filters.level === level.id ? null : level.id)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm border
                        transition-all
                        ${filters.level === level.id
                          ? level.color
                          : 'bg-white/[0.05] border-white/[0.08] text-white/60 hover:bg-white/[0.08]'
                        }
                      `}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 콘텐츠 유형 */}
              <div>
                <h4 className="text-sm font-medium text-white/70 mb-3">콘텐츠 유형</h4>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => onFilterChange('contentType', filters.contentType === type.id ? null : type.id)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm
                        flex items-center gap-1.5 transition-all
                        ${filters.contentType === type.id
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-white/[0.05] border border-white/[0.08] text-white/60 hover:bg-white/[0.08]'
                        }
                      `}
                    >
                      <span>{type.icon}</span>
                      <span>{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 정렬 */}
              <div>
                <h4 className="text-sm font-medium text-white/70 mb-3">정렬</h4>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => onFilterChange('sort', option.id)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm transition-all
                        ${filters.sort === option.id
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/[0.05] border border-white/[0.08] text-white/60 hover:bg-white/[0.08]'
                        }
                      `}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 적용 버튼 */}
            <div className="p-5 border-t border-white/[0.06]">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors"
              >
                적용하기
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
