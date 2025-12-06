'use client'

import React, { useState } from 'react'
import { ChecklistItem as ChecklistItemType, ChecklistProgress } from '@/app/data/problemsData'

interface ChecklistSectionProps {
  items: ChecklistItemType[]
  progress: ChecklistProgress[]
  onToggle: (itemId: string) => void
}

interface ChecklistItemProps {
  item: ChecklistItemType
  isCompleted: boolean
  onToggle: () => void
  onHelpClick: () => void
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  isCompleted,
  onToggle,
  onHelpClick
}) => {
  return (
    <div className={`
      p-4 rounded-xl transition-all duration-200
      ${isCompleted
        ? 'bg-green-500/10 border border-green-500/20'
        : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]'
      }
    `}>
      <div className="flex items-start gap-3">
        {/* 체크박스 */}
        <button
          onClick={onToggle}
          className={`
            w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center
            transition-all duration-200
            ${isCompleted
              ? 'bg-green-500 text-white'
              : 'bg-white/10 hover:bg-white/20'
            }
          `}
        >
          {isCompleted && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <p className={`
            text-sm leading-relaxed transition-colors
            ${isCompleted ? 'text-white/50 line-through' : 'text-white'}
          `}>
            {item.text}
          </p>
        </div>

        {/* 도움말 버튼 */}
        {item.helpText && (
          <button
            onClick={onHelpClick}
            className="
              w-6 h-6 rounded-full flex-shrink-0
              bg-white/10 hover:bg-white/20
              flex items-center justify-center
              text-white/40 hover:text-white
              transition-colors
            "
          >
            <span className="text-xs font-bold">?</span>
          </button>
        )}
      </div>
    </div>
  )
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  items,
  progress,
  onToggle
}) => {
  const [helpModal, setHelpModal] = useState<ChecklistItemType | null>(null)

  const completedCount = progress.filter(p => p.completed).length
  const totalCount = items.length
  const allCompleted = completedCount === totalCount

  return (
    <div className="space-y-4">
      {/* 진행률 표시 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white/60">
          {completedCount}/{totalCount} 완료
        </span>
        {allCompleted && (
          <span className="text-sm text-green-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            모두 완료!
          </span>
        )}
      </div>

      {/* 진행률 바 */}
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${allCompleted ? 'bg-green-500' : 'bg-primary'}`}
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* 체크리스트 아이템들 */}
      <div className="space-y-3 mt-4">
        {items.map((item) => {
          const itemProgress = progress.find(p => p.itemId === item.id)
          const isCompleted = itemProgress?.completed || false

          return (
            <ChecklistItem
              key={item.id}
              item={item}
              isCompleted={isCompleted}
              onToggle={() => onToggle(item.id)}
              onHelpClick={() => setHelpModal(item)}
            />
          )
        })}
      </div>

      {/* 도움말 모달 */}
      {helpModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setHelpModal(null)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              className="
                w-full max-w-sm p-6 rounded-2xl
                bg-[#1a1a1a] border border-white/[0.1]
                shadow-2xl
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <span className="text-xl">💡</span>
                </div>
                <button
                  onClick={() => setHelpModal(null)}
                  className="p-1 text-white/40 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 내용 */}
              <h3 className="font-semibold text-white mb-2">도움말</h3>
              <p className="text-sm text-white/60 mb-4">{helpModal.text}</p>
              {helpModal.helpText && (
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-sm text-white/80">{helpModal.helpText}</p>
                </div>
              )}

              {/* 닫기 버튼 */}
              <button
                onClick={() => setHelpModal(null)}
                className="
                  w-full mt-4 py-3 rounded-xl
                  bg-primary text-black font-medium
                  hover:bg-primary/90 transition-colors
                "
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
