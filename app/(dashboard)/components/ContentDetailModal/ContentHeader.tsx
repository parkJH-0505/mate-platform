'use client'

import React from 'react'

interface Props {
    title: string
    category: string
    level: number
    duration: number
    type: string
    onClose: () => void
}

const LEVEL_BADGES: Record<number, { label: string; color: string }> = {
    1: { label: '입문', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    2: { label: '초급', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    3: { label: '중급', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    4: { label: '고급', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    5: { label: '전문가', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
}

const TYPE_ICONS: Record<string, string> = {
    video: '🎬',
    article: '📄',
    template: '📋',
    project: '🎯',
    audio: '🎧'
}

export function ContentHeader({ title, category, level, duration, type, onClose }: Props) {
    const levelBadge = LEVEL_BADGES[level] || LEVEL_BADGES[2]
    const typeIcon = TYPE_ICONS[type] || '📚'

    return (
        <header className="flex-shrink-0 p-6 border-b border-white/[0.1] bg-gradient-to-br from-white/[0.03] to-transparent">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{typeIcon}</span>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${levelBadge.color}`}>
                                {levelBadge.label}
                            </span>
                            <span className="text-xs text-white/40">
                                {duration}분
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            {title}
                        </h2>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
                >
                    <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {category && (
                <span className="text-sm text-accent-purple font-medium">
                    {category}
                </span>
            )}
        </header>
    )
}
