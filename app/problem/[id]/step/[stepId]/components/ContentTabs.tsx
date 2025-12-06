'use client'

import React from 'react'

export type ContentTabType = 'why' | 'how' | 'examples' | 'checklist'

interface ContentTabsProps {
  activeTab: ContentTabType
  onTabChange: (tab: ContentTabType) => void
  checklistCount: number
  completedCount: number
}

const tabs: { id: ContentTabType; label: string; icon: string }[] = [
  { id: 'why', label: '왜?', icon: '💡' },
  { id: 'how', label: '어떻게?', icon: '📖' },
  { id: 'examples', label: '사례', icon: '💼' },
  { id: 'checklist', label: '실행', icon: '✓' }
]

export const ContentTabs: React.FC<ContentTabsProps> = ({
  activeTab,
  onTabChange,
  checklistCount,
  completedCount
}) => {
  return (
    <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const isChecklist = tab.id === 'checklist'

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg
              text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-primary text-black'
                : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
              }
            `}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {isChecklist && (
              <span className={`
                ml-1 px-1.5 py-0.5 rounded-full text-xs
                ${isActive ? 'bg-black/20' : 'bg-white/10'}
              `}>
                {completedCount}/{checklistCount}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
