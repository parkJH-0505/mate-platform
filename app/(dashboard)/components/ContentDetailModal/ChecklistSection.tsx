'use client'

import React from 'react'

interface Props {
    items: Array<{
        text: string
        description: string
    }>
    checkedItems: Set<number>
    onToggle: (index: number) => void
}

export function ChecklistSection({ items, checkedItems, onToggle }: Props) {
    const completedCount = checkedItems.size
    const totalCount = items.length

    return (
        <div className="pt-6 border-t border-white/[0.1]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span>✅</span>
                    실행 체크리스트
                </h3>
                <span className="text-sm text-white/40">
                    {completedCount}/{totalCount} 완료
                </span>
            </div>

            <div className="space-y-3">
                {items.map((item, idx) => {
                    const isChecked = checkedItems.has(idx)

                    return (
                        <button
                            key={idx}
                            onClick={() => onToggle(idx)}
                            className={`
                w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all
                ${isChecked
                                    ? 'bg-green-500/10 border border-green-500/20'
                                    : 'bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05]'
                                }
              `}
                        >
                            <div className={`
                w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5
                border-2 transition-all
                ${isChecked
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-white/20'
                                }
              `}>
                                {isChecked && (
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>

                            <div className="flex-1">
                                <p className={`font-medium mb-1 ${isChecked ? 'text-white/50 line-through' : 'text-white'}`}>
                                    {item.text}
                                </p>
                                <p className="text-sm text-white/50">
                                    {item.description}
                                </p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
