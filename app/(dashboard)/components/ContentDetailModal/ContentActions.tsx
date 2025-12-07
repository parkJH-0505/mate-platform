'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface Props {
    onClose: () => void
    onComplete: () => void
    nextContentId?: string
    completedItems: number
    totalItems: number
}

export function ContentActions({
    onClose,
    onComplete,
    nextContentId,
    completedItems,
    totalItems
}: Props) {
    const router = useRouter()

    const handleComplete = () => {
        if (totalItems > 0 && completedItems < totalItems) {
            const remaining = totalItems - completedItems
            if (!confirm(`아직 ${remaining}개의 체크리스트가 남았습니다. 그래도 완료하시겠습니까?`)) {
                return
            }
        }

        onComplete()
    }

    return (
        <div className="flex-shrink-0 p-4 border-t border-white/[0.1] bg-[#0a0a0a]/80 backdrop-blur-sm">
            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="
            flex-1 py-3 px-4 rounded-xl font-medium transition-all
            bg-white/[0.05] text-white/70
            hover:bg-white/[0.1] hover:text-white
          "
                >
                    ← 목록
                </button>

                <button
                    onClick={handleComplete}
                    className="
            flex-1 py-3 px-4 rounded-xl font-medium transition-all
            bg-gradient-to-r from-accent-purple to-primary
            text-white
            hover:shadow-[0_0_30px_rgba(147,97,253,0.3)]
          "
                >
                    완료하고 다음 →
                </button>
            </div>

            {completedItems > 0 && (
                <p className="text-center text-xs text-green-400 mt-2">
                    ✓ {completedItems}개 체크리스트 완료!
                </p>
            )}
        </div>
    )
}
